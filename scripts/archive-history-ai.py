"""Preserve verified reusable history/AI sources without executing remote HTML.

Run from the project checkout with Python 3 and requests. Existing source files
are replaced only after a successful fetch and validation. No directories are removed.
"""
from __future__ import annotations

import hashlib
import html
import json
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
import re
import time
from urllib.parse import urljoin

import requests

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'public' / 'resources'
STAMP = datetime.now(timezone.utc).isoformat(timespec='seconds')
SESSION = requests.Session()
SESSION.headers['User-Agent'] = 'DaoKnowledgeArchive/1.0 (offline educational resource archive)'
ENTRIES: list[dict] = []
UNAVAILABLE: list[dict] = []

LEIBNIZ = 'https://fr.wikisource.org/wiki/Leibniz-en.francais-Gerhardt.Math.1a7.djvu/Numération.binaire'
REACT = 'https://arxiv.org/abs/2210.03629'
REACT_PDF = 'https://arxiv.org/pdf/2210.03629v3'
SCANS = [
 'https://upload.wikimedia.org/wikisource/fr/thumb/6/6c/Leibniz-en.francais-Gerhardt.Math.1a7.djvu/page529-1280px-Leibniz-en.francais-Gerhardt.Math.1a7.djvu.jpg',
 'https://upload.wikimedia.org/wikisource/fr/thumb/6/6c/Leibniz-en.francais-Gerhardt.Math.1a7.djvu/page530-1280px-Leibniz-en.francais-Gerhardt.Math.1a7.djvu.jpg',
]


def get(url: str, **kwargs):
    last = None
    for attempt in range(4):
        try:
            response = SESSION.get(url, timeout=60, **kwargs)
            if response.status_code == 429:
                response.raise_for_status()  # Stop; do not circumvent the origin's rate limit.
            response.raise_for_status()
            return response
        except requests.RequestException as error:
            last = error
            if error.response is not None and 400 <= error.response.status_code < 500:
                raise
            if attempt < 3:
                time.sleep(attempt + 1)
    raise last


def save(relative: str, content: bytes, *, id: str, source_id: str, title: str,
         url: str, license: str, scope: str, format: str, **extra):
    target = BASE / relative
    assert target.resolve().is_relative_to(BASE.resolve())
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(content)
    record = dict(id=id, sourceId=source_id, title=title, url=url,
                  downloadedAt=STAMP, license=license, scope=scope,
                  format=format, path='/resources/' + relative,
                  bytes=len(content), sha256=hashlib.sha256(content).hexdigest())
    record.update(extra)
    ENTRIES.append(record)


class ReadOnlyHTML(HTMLParser):
    """Keep document semantics and tables; discard scripts and event handlers."""
    allowed = {'div','p','span','a','b','strong','i','em','u','sup','sub','small',
               'blockquote','pre','code','br','hr','table','tbody','thead','tr',
               'th','td','ul','ol','li','h1','h2','h3','h4','figure','figcaption'}
    void = {'br','hr'}
    forbidden = {'script','style','iframe','object','embed','form','input','button','select','textarea','link'}
    block = {'p','div','blockquote','pre','table','tr','ul','ol','li','h1','h2','h3','h4'}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self.text = []
        self.skip = 0

    def handle_starttag(self, tag, attrs):
        if tag in self.forbidden:
            if tag not in {'input','link','embed'}:
                self.skip += 1
            return
        if self.skip:
            return
        if tag in self.block:
            self.text.append('\n')
        if tag not in self.allowed:
            return
        safe = []
        for key, value in attrs:
            if value is None:
                continue
            if key in {'id','class','colspan','rowspan','title','lang','dir'}:
                safe.append((key,value))
            elif key == 'href' and tag == 'a':
                href = urljoin(LEIBNIZ, value)
                if href.startswith(('https://','http://','#')):
                    safe.append(('href',href))
            elif key == 'style' and not re.search(r'url\s*\(|expression|behavior|@import',value,re.I):
                safe.append(('style',value))
        self.parts.append('<'+tag+''.join(' '+k+'="'+html.escape(v,quote=True)+'"' for k,v in safe)+'>')

    def handle_endtag(self, tag):
        if tag in self.forbidden:
            if tag not in {'input','link','embed'} and self.skip:
                self.skip -= 1
            return
        if self.skip:
            return
        if tag in self.allowed and tag not in self.void:
            self.parts.append('</'+tag+'>')
        if tag in self.block:
            self.text.append('\n')

    def handle_data(self, data):
        if not self.skip:
            self.parts.append(html.escape(data))
            self.text.append(data)


def archive_leibniz():
    cache = BASE / 'history' / 'leibniz-source-body.md'
    cached_source = cache.exists()
    if cached_source:
        original = cache.read_text(encoding='utf8')
        parsed = {'revid':11721796}
        text = original
        paragraphs = []
        for block in original.split('\n\n'):
            safe = html.escape(block)
            if block.startswith('`'):
                paragraphs.append('<pre>'+safe.strip('`')+'</pre>')
                continue
            safe = re.sub(r'\[([^\]]+)\]\((https?://[^\s)]+)(?:\s+&quot;[^)]*&quot;)?\)',r'<a href="\2">\1</a>',safe)
            safe = re.sub(r'\*\*([^*]+)\*\*',r'<strong>\1</strong>',safe)
            paragraphs.append('<p>'+safe.replace('\n','\n')+'</p>')
        body = ''.join(paragraphs)
    else:
        response = get('https://fr.wikisource.org/w/api.php',params={
            'action':'parse', 'page':'Leibniz-en.francais-Gerhardt.Math.1a7.djvu/Numération.binaire',
            'prop':'text|revid', 'format':'json'})
        parsed = response.json()['parse']
        original = parsed['text']['*']
        clean = ReadOnlyHTML()
        clean.feed(original)
        text = re.sub(r'\n[ \t]*\n(?:[ \t]*\n)+','\n\n',''.join(clean.text)).strip()
        body = ''.join(clean.parts)
    if 'Le calcul ordinaire' not in original or 'aider l’esprit humain' not in original:
        raise ValueError('French article start or ending missing')
    license = 'Public-domain original; Wikisource transcription CC BY-SA 4.0'
    license_url = 'https://creativecommons.org/licenses/by-sa/4.0/'
    permanent = LEIBNIZ.replace('/wiki/','/w/index.php?title=')+'&oldid='+str(parsed['revid'])
    attribution = ('Gottfried Wilhelm Leibniz; C. I. Gerhardt, Leibnizens mathematische Schriften VII, '
                   'pp. 223–227; Wikisource contributors, revision '+str(parsed['revid']))
    retrieval_note = 'Cached source acquired 2026-10-06 via research connector; origin API revision independently checked 2026-10-29.' if cached_source else 'Fetched from the origin MediaWiki API.'
    metadata = f'<p class="metadata">{html.escape(attribution)}<br>Source: <a href="{html.escape(permanent,quote=True)}">Wikisource fixed revision</a> · Saved {STAMP}<br>Public-domain original; transcription: <a href="{license_url}">CC BY-SA 4.0</a>. Local formatting added; original wording and source image links retained.<br>{retrieval_note}</p>'
    if cached_source:
        save('history/leibniz-source-body.md',original.encode('utf8'),id='leibniz-source-markdown',source_id='leibniz-1703',
             title='Leibniz — complete source transcription (Markdown)',url=LEIBNIZ,license=license,
             scope='Complete article body from fixed Wikisource revision; cached acquisition 2026-10-06',format='markdown',
             revision=str(parsed['revid']),licenseUrl=license_url,sourceAcquiredAt='2026-10-06T00:00:00Z')
    scans_html = []
    saved_scans = []
    for index, url in enumerate(SCANS):
        try:
            content = get(url).content
        except requests.RequestException as error:
            status = getattr(error.response, 'status_code', None)
            UNAVAILABLE.append(dict(sourceId='leibniz-1703',url=url,title='Leibniz linked printed scan '+str(529+index),
                                    status='unavailable',license='Public-domain printed work; linked scan',asset=True,
                                    reason=f'链接的扫描图片未能下载（HTTP {status}）；保留原始链接，没有绕过服务限制。法文转录全文已保存。'))
            scans_html.append(f'<p>Printed page {529+index}: linked scan not saved (HTTP {status}). <a href="{html.escape(url,quote=True)}">Original image</a></p>')
            continue
        if not content.startswith(b'\xff\xd8'):
            raise ValueError('Expected original JPEG scan')
        filename = f'leibniz-page-{529+index}.jpg'
        save('history/'+filename,content,id='leibniz-scan-'+str(529+index),source_id='leibniz-1703',
             title='Leibniz original scan, book page '+str(529+index),url=url,
             license='Public-domain printed work (Gerhardt 1850–1863); faithful scan',
             scope='Original printed page with numerical tables/arithmetic examples',format='image')
        scans_html.append(f'<figure><img src="{filename}" alt="Original printed page {529+index}"><figcaption>Printed page {529+index}; table and calculation examples. <a href="{html.escape(url,quote=True)}">Original image</a></figcaption></figure>')
        saved_scans.append(index)
    for index,url in enumerate(SCANS):
        if index in saved_scans:
            body=body.replace(html.escape(url,quote=True),f'leibniz-page-{529+index}.jpg').replace(html.escape(url.replace('-1280px-','-1024px-'),quote=True),f'leibniz-page-{529+index}.jpg')
    wrapped='''<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><title>Leibniz — Explication de l’arithmétique binaire</title><style>body{max-width:900px;margin:35px auto;padding:0 24px;background:#fffef8;color:#253d33;font:18px/1.9 Georgia,serif}h1{font-size:30px;line-height:1.4}.metadata{font:13px/1.8 sans-serif;background:#edf1e3;padding:20px}a{color:#315f4a}table{border-collapse:collapse;max-width:100%}td,th{padding:4px 8px;vertical-align:top}pre{white-space:pre-wrap;overflow-wrap:anywhere}img{max-width:100%;height:auto}figure{margin:30px 0}figcaption{font:13px/1.8 sans-serif}.ws-noexport,.noprint{display:none}</style></head><body><h1>Explication de l’arithmétique binaire</h1>'''+metadata+body+'<h2>Tables et exemples imprimés / état des scans</h2>'+''.join(scans_html)+'</body></html>'
    save('history/leibniz-binary-full.html',wrapped.encode('utf8'),id='leibniz-full-html',source_id='leibniz-1703',
         title='Leibniz — complete French transcription (linked scan status included)',url=LEIBNIZ,license=license,
         scope=f'Complete Wikisource French text, notes and transcribed table; {len(saved_scans)}/2 separately linked printed scans saved',format='html',
         revision=str(parsed['revid']),licenseUrl=license_url)
    full_text=f'Leibniz — Explication de l’arithmétique binaire\n\n{attribution}\nSource: {permanent}\nSaved: {STAMP}\nLicense: {license}\nLicense URL: {license_url}\n\n{text}\n\nSeparately linked printed scans saved: {len(saved_scans)}/2. See original URLs in the text.\n'
    save('history/leibniz-binary-full.txt',full_text.encode('utf8'),id='leibniz-full-text',source_id='leibniz-1703',
         title='Leibniz — complete French transcription (text)',url=LEIBNIZ,license=license,
         scope='Complete textual transcription; separately linked scan download status recorded in the HTML reader and manifest',format='text',
         revision=str(parsed['revid']),licenseUrl=license_url)


def archive_react():
    metadata=get(REACT).text
    if not re.search(r'https?://creativecommons\.org/licenses/by/4\.0',metadata):
        raise ValueError('ReAct CC BY 4.0 declaration not found on primary page')
    content=get(REACT_PDF).content
    if not content.startswith(b'%PDF-') or b'%%EOF' not in content[-2048:]:
        raise ValueError('Invalid or incomplete ReAct PDF')
    save('ai/react-2210.03629v3.pdf',content,id='react-full-pdf',source_id='ai-react',
         title='ReAct: Synergizing Reasoning and Acting in Language Models — full paper v3',
         url=REACT_PDF,license='CC BY 4.0',scope='Complete original PDF, including figures, references and appendices',
         format='pdf',licenseUrl='https://creativecommons.org/licenses/by/4.0/')
    attribution=f'''# ReAct 原文归档及署名

- 题名：ReAct: Synergizing Reasoning and Acting in Language Models
- 作者：Shunyu Yao、Jeffrey Zhao、Dian Yu、Nan Du、Izhak Shafran、Karthik Narasimhan、Yuan Cao。
- 版本：arXiv:2210.03629v3，2023-03-10；ICLR 2023。
- 原始页面：{REACT}
- 保存原件：{REACT_PDF}
- 保存时间：{STAMP}
- 授权：CC BY 4.0，https://creativecommons.org/licenses/by/4.0/ 。原始 arXiv 页面明确提供该授权链接。
- 完整 PDF 原样保存，没有修改正文、图表、参考文献或附录。
- 本地文件：react-2210.03629v3.pdf。

转载时应保留作者、题名、原始来源、许可链接及本说明。作者不因该归档而为本项目背书。
'''
    save('ai/react-attribution.md',attribution.encode('utf8'),id='react-attribution',source_id='ai-react',
         title='ReAct attribution, version and license record',url=REACT,license='Project bibliographic metadata; paper CC BY 4.0',
         scope='Attribution and license evidence (not a second paper copy)',format='markdown',
         licenseUrl='https://creativecommons.org/licenses/by/4.0/')


def main():
    archive_leibniz()
    archive_react()
    manifest=BASE/'manifests'/'history-ai.json'
    manifest.parent.mkdir(parents=True,exist_ok=True)
    manifest.write_text(json.dumps(ENTRIES,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    restricted=[dict(sourceId='ai-reasoning',url='https://arxiv.org/abs/2005.11401',
                     title='Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',status='restricted',
                     license='arXiv.org perpetual non-exclusive distribution license; no public redistribution license verified',
                     reason='arXiv 页面明确采用向 arXiv 授予非独占传播权的许可；NeurIPS 官方说明作者保留版权，向会议授予发布权。未核实到授予公众全文再分发权的版本，因此未把论文全文复制进可分发的项目。原有摘要与原始链接保留。',
                     evidenceUrls=['https://arxiv.org/abs/2005.11401','https://arxiv.org/licenses/nonexclusive-distrib/1.0/','https://neurips.cc/FAQ/Copyright'])]
    (manifest.parent/'history-ai-unavailable.json').write_text(json.dumps(restricted+UNAVAILABLE,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    print(json.dumps(dict(files=len(ENTRIES),bytes=sum(e['bytes'] for e in ENTRIES),restricted=len(restricted),unavailableAssets=len(UNAVAILABLE)),ensure_ascii=False))


if __name__=='__main__':
    main()

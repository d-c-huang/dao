"""Archive the project's Wikisource classics as full article HTML and text.

Run from any directory: python scripts/archive-classics.py
Requires Python 3.10+ and requests. HTTPS verification remains enabled.
"""
from __future__ import annotations

import concurrent.futures
import datetime as dt
import hashlib
import html
from html.parser import HTMLParser
import json
import os
import posixpath
from pathlib import Path
import re
import sys
import time
from urllib.parse import quote, unquote, urljoin, urlparse

import requests

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
DEST = PUBLIC / "resources" / "classics"
MANIFEST = PUBLIC / "resources" / "manifests" / "classics.json"
TODAY = "2026-10-29"
HEADERS = {"User-Agent": "BaguaLocalArchive/1.0 (personal educational offline reading; Python requests)", "Accept": "application/json"}
LICENSE = "古典正文属公共领域；维基文库转录及编辑信息按 CC BY-SA 4.0 署名与相同方式共享，保留原址、修订及贡献者入口。"
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}
REMOVE = {"script", "style", "link", "meta", "iframe", "object", "embed", "form", "input", "button", "noscript"}
BLOCK = {"div", "p", "section", "article", "h1", "h2", "h3", "h4", "h5", "h6", "table", "tr", "ul", "ol", "li", "dl", "dt", "dd", "blockquote", "pre", "br", "hr"}


class Element:
    def __init__(self, tag: str, attrs=None):
        self.tag, self.attrs, self.children = tag, dict(attrs or []), []


class Tree(HTMLParser):
    def __init__(self, text: str):
        super().__init__(convert_charrefs=True)
        self.root = Element("root")
        self.stack = [self.root]
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        item = Element(tag, attrs)
        self.stack[-1].children.append(item)
        if tag not in VOID:
            self.stack.append(item)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                break

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def hexagrams():
    source = (ROOT / "src" / "hexagrams.ts").read_text(encoding="utf-8")
    data = source.split("export const hexagrams: Hexagram[] =", 1)[1].strip().rstrip(";").strip()
    return json.loads(data)


def documents():
    docs = [{"id": "zhou-yi-index", "sourceId": "zhou-yi-64", "title": "周易 · 原网站目录与组合表", "page": "周易", "stem": "zhou-yi/index"}]
    for item in hexagrams():
        page = unquote(urlparse(item["sourceUrl"]).path).split("/wiki/", 1)[1]
        docs.append({"id": f"zhou-yi-{item['number']:02d}", "sourceId": "zhou-yi-64", "title": f"周易 · 第 {item['number']} 卦 · {item['name']}", "page": page, "stem": f"zhou-yi/{item['number']:02d}"})
    docs.extend([
        {"id": "shuo-gua-full", "sourceId": "shuo-gua", "title": "易傳 · 說卦全文", "page": "易傳/說卦", "stem": "yizhuan/shuo-gua"},
        {"id": "xi-ci-shang-full", "sourceId": "xi-ci-shang", "title": "易傳 · 繫辭上全文", "page": "易傳/繫辭上", "stem": "yizhuan/xi-ci-shang"},
        {"id": "xi-ci-xia-full", "sourceId": "xi-ci-xia", "title": "易傳 · 繫辭下全文", "page": "易傳/繫辭下", "stem": "yizhuan/xi-ci-xia"},
    ])
    return docs


DOCS = documents()
PAGE_PATHS = {item["page"]: "/resources/classics/" + item["stem"] + ".html" for item in DOCS}
for item in hexagrams():
    PAGE_PATHS.setdefault("周易/" + item["traditionalName"], f"/resources/classics/zhou-yi/{item['number']:02d}.html")
PRIOR_RECORDS = json.loads(MANIFEST.read_text(encoding="utf-8")) if MANIFEST.exists() else []


def local_link(value: str, page: str):
    if value.startswith("#"):
        return value
    absolute = urljoin("https://zh.wikisource.org/wiki/" + quote(page, safe="/"), value)
    parsed = urlparse(absolute)
    if parsed.hostname == "zh.wikisource.org":
        path = unquote(parsed.path)
        for prefix in ("/wiki/", "/zh/", "/zh-hant/", "/zh-hans/"):
            if path.startswith(prefix):
                target = path[len(prefix):]
                if target in PAGE_PATHS:
                    return PAGE_PATHS[target] + ("#" + parsed.fragment if parsed.fragment else "")
    return absolute if parsed.scheme in ("https", "http") else "#"


def clean(element, page):
    if isinstance(element, str):
        return html.escape(element), element
    if element.tag in REMOVE or "mw-editsection" in element.attrs.get("class", "").split():
        return "", ""
    if element.tag == "img":
        # All classical text is retained. Remote site icons/illustrations are
        # replaced by their own alt labels, so no live network assets are used.
        alt = element.attrs.get("alt", "")
        return f'<span class="image-alt">{html.escape(alt)}</span>', alt
    children = [clean(item, page) for item in element.children]
    content_html = "".join(item[0] for item in children)
    content_text = "".join(item[1] for item in children)
    if element.tag == "root":
        return content_html, content_text
    attrs = []
    for key, value in element.attrs.items():
        if value is None or key not in {"id", "class", "title", "lang", "dir", "colspan", "rowspan", "href"}:
            continue
        if key == "href":
            value = local_link(value, page)
        attrs.append(f' {key}="{html.escape(value, quote=True)}"')
    rendered = "<" + element.tag + "".join(attrs) + ">" + content_html
    if element.tag not in VOID:
        rendered += "</" + element.tag + ">"
    if element.tag in BLOCK:
        content_text = "\n" + content_text + "\n"
    elif element.tag in {"th", "td"}:
        content_text += "\t"
    return rendered, content_text


CSS = """body{max-width:900px;margin:36px auto;padding:0 24px;font-family:serif;color:#233b31;background:#faf9f4;line-height:1.95}header{border-bottom:1px solid #ccd4c0;margin-bottom:24px;padding-bottom:22px}h1{font-size:30px}a{color:#315f4b}table{border-collapse:collapse;max-width:100%;display:block;overflow:auto}td,th{border:1px solid #d7decc;padding:5px 9px}nav,.archive-meta{font-family:sans-serif;font-size:13px;color:#63745c}.archive-meta p{margin:6px 0}img{max-width:100%}.mw-editsection{display:none}pre{white-space:pre-wrap}.image-alt{font-size:12px;color:#64745b}footer{border-top:1px solid #ccd4c0;margin-top:35px;padding-top:15px;font-family:sans-serif;font-size:12px}#toc{font-size:14px}@media(max-width:600px){body{margin:18px auto;padding:0 18px}h1{font-size:25px}}"""


def fetch_parse(item):
    api = "https://zh.wikisource.org/w/api.php?action=parse&page=" + quote(item["page"], safe="/") + "&prop=text%7Crevid&format=json"
    error = None
    for attempt in range(5):
        try:
            response = requests.get(api, headers=HEADERS, timeout=(15, 35))
            if response.status_code == 429:
                delay = int(response.headers.get("Retry-After", "30"))
                print("RATE LIMIT", item["page"], "waiting", delay, "seconds", flush=True)
                time.sleep(max(delay, 1))
                raise RuntimeError("HTTP 429 rate limit")
            response.raise_for_status()
            result = response.json()
            if "parse" not in result:
                raise RuntimeError(json.dumps(result, ensure_ascii=False)[:250])
            parsed = result["parse"]
            fragment = parsed["text"]["*"]
            if len(fragment) < 150:
                raise RuntimeError("Empty or unexpected content")
            return parsed["revid"], fragment
        except (requests.RequestException, ValueError, RuntimeError) as exc:
            error = exc
            if attempt < 4:
                time.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f"{item['page']}: {error}")


def write_record(item, extension, payload, revision, acquired):
    path = DEST / (item["stem"] + extension)
    path.parent.mkdir(parents=True, exist_ok=True)
    blob = payload.encode("utf-8")
    path.write_bytes(blob)
    return {
        "id": item["id"] + ("-html" if extension == ".html" else "-text"),
        "sourceId": item["sourceId"], "title": item["title"],
        "url": "https://zh.wikisource.org/wiki/" + item["page"],
        "downloadedAt": acquired, "license": LICENSE,
        "scope": "所引维基文库文章正文全文（含站内编者信息）；移除执行脚本与编辑按钮，站点图示转为原有 alt 标签。六十四卦页包含卦辞、彖、大小象及六爻等该页全文。",
        "format": "html" if extension == ".html" else "text",
        "path": "/resources/classics/" + item["stem"] + extension,
        "bytes": len(blob), "sha256": hashlib.sha256(blob).hexdigest(),
        "revisionId": revision,
        "revisionUrl": f"https://zh.wikisource.org/w/index.php?oldid={revision}",
    }


def archive(item):
    if "--repair-manifest" in sys.argv:
        return recover_cached_archive(item)
    # Existing verified snapshots are reusable; remove neither user files nor
    # previous archives. A fresh run refetches only missing document pairs.
    old_html = DEST / (item["stem"] + ".html")
    old_text = DEST / (item["stem"] + ".txt")
    if old_html.exists() and old_text.exists() and MANIFEST.exists():
        records = [record for record in PRIOR_RECORDS if record["id"] in {item["id"] + "-html", item["id"] + "-text"}]
        if len(records) == 2 and all((PUBLIC / record["path"].lstrip("/")).exists() and hashlib.sha256((PUBLIC / record["path"].lstrip("/")).read_bytes()).hexdigest() == record["sha256"] for record in records):
            print("REUSE", item["page"], flush=True)
            return records
    revision, fragment = fetch_parse(item)
    content_html, text = clean(Tree(fragment).root, item["page"])
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    acquired = dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")
    original = "https://zh.wikisource.org/wiki/" + item["page"]
    revision_url = f"https://zh.wikisource.org/w/index.php?oldid={revision}"
    attribution = "https://zh.wikisource.org/w/index.php?title=" + quote(item["page"], safe="/") + "&action=history"
    meta = f'来源：{original}\n修订：{revision_url}\n贡献者：{attribution}\n保存：{acquired}\n许可：{LICENSE}'
    document = '<!doctype html>\n<html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; base-uri \'none\'; form-action \'none\'"><title>' + html.escape(item["title"]) + '</title><style>' + CSS + '</style></head><body><header><nav><a href="/resources/classics/index.html">本地经典全文目录</a> · <a href="/#sources">返回项目资料页</a></nav><h1>' + html.escape(item["title"]) + '</h1><div class="archive-meta"><p>全文离线副本 · 维基文库转录</p><p><a href="' + html.escape(original, quote=True) + '">原始文章</a> · <a href="' + html.escape(revision_url, quote=True) + '">所存修订</a> · <a href="' + html.escape(attribution, quote=True) + '">贡献者历史</a></p><p>保存时间：' + acquired + '</p></div></header><main>' + content_html + '</main><footer>' + html.escape(LICENSE) + ' <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.zh">CC BY-SA 4.0</a>。正文文字完整保留，页面图示以 alt 标签呈现；原网站界面、脚本与样式不属于此正文副本。</footer></body></html>\n'
    plain = item["title"] + "\n\n" + meta + "\n\n===== 文章正文全文 =====\n\n" + text + "\n"
    # The per-hexagram articles must contain all six line-position labels.
    if item["id"].startswith("zhou-yi-") and item["id"] != "zhou-yi-index":
        if not re.search(r"初[九六]", text) or not re.search(r"上[九六]", text):
            raise RuntimeError("Missing line text in " + item["page"])
    records = [write_record(item, ".html", document, revision, acquired), write_record(item, ".txt", plain, revision, acquired)]
    print("SAVED", item["page"], len(text), flush=True)
    return records


def recover_cached_archive(item):
    """Rebuild metadata from successful full snapshots after a file-lock interruption."""
    document = (DEST / (item["stem"] + ".html")).read_text(encoding="utf-8")
    plain = (DEST / (item["stem"] + ".txt")).read_text(encoding="utf-8")
    expected_url = "https://zh.wikisource.org/wiki/" + item["page"]
    if "来源：" + expected_url + "\n" not in plain or "===== 文章正文全文 =====" not in plain:
        raise RuntimeError("Cached source metadata mismatch: " + item["page"])
    revision = re.search(r"修订：https://zh\.wikisource\.org/w/index\.php\?oldid=(\d+)", plain)
    acquired = re.search(r"保存：([^\n]+)", plain)
    if not revision or not acquired or f"oldid={revision[1]}" not in document:
        raise RuntimeError("Missing cached revision: " + item["page"])
    if item["id"].startswith("zhou-yi-") and item["id"] != "zhou-yi-index":
        if not all(re.search(pattern, plain) for pattern in (r"初[九六]", r"[九六]二", r"[九六]三", r"[九六]四", r"[九六]五", r"上[九六]")):
            raise RuntimeError("Incomplete cached six-line text: " + item["page"])
    records = [write_record(item, ".html", document, int(revision[1]), acquired[1]), write_record(item, ".txt", plain, int(revision[1]), acquired[1])]
    print("VERIFIED CACHE", item["page"], flush=True)
    return records


def write_index(records):
    rows = []
    for item in DOCS:
        record = next((record for record in records if record["id"] == item["id"] + "-html"), None)
        if record:
            href = posixpath.relpath(record["path"], "/resources/classics")
            rows.append('<li><a href="' + href + '">' + html.escape(item["title"]) + '</a> · <a href="' + href[:-5] + '.txt">纯文本</a></li>')
    document = '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>本地经典全文目录</title><style>' + CSS + '</style></head><body><header><nav><a href="/#sources">返回项目资料页</a></nav><h1>本地经典全文目录</h1><p>以下为所列维基文库文章正文的完整离线副本，六十四卦包含爻辞与经传全文。</p><p>' + html.escape(LICENSE) + '</p></header><ol>' + ''.join(rows) + '</ol></body></html>\n'
    path = DEST / "index.html"
    path.write_text(document, encoding="utf-8")
    blob = path.read_bytes()
    return {"id": "classics-local-index", "sourceId": "zhou-yi-64", "title": "本地经典全文目录", "url": "https://zh.wikisource.org/wiki/周易", "downloadedAt": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"), "license": LICENSE, "scope": "项目生成的本地导航索引，非网上原文。", "format": "html", "path": "/resources/classics/index.html", "bytes": len(blob), "sha256": hashlib.sha256(blob).hexdigest(), "generated": True}


def make_links_relative(records):
    """Make article links work both behind Vite and by opening the archive files."""
    for record in records:
        if record["format"] != "html":
            continue
        path = PUBLIC / record["path"].lstrip("/")
        document = path.read_text(encoding="utf-8")
        base = posixpath.dirname(record["path"])
        document = re.sub(r'href="(/resources/classics/[^"#]*)(#[^"]*)?"', lambda match: 'href="' + posixpath.relpath(match[1], base) + (match[2] or "") + '"', document)
        blob = document.encode("utf-8")
        path.write_bytes(blob)
        record.update(bytes=len(blob), sha256=hashlib.sha256(blob).hexdigest())


def save_manifest(records):
    temporary = MANIFEST.with_suffix(".json.tmp")
    temporary.write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    for attempt in range(10):
        try:
            temporary.replace(MANIFEST)
            return
        except PermissionError:
            if attempt == 9:
                raise
            time.sleep(0.2)


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    DEST.mkdir(parents=True, exist_ok=True)
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    records, errors = [], []
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        pending = {executor.submit(archive, item): item for item in DOCS}
        for future in concurrent.futures.as_completed(pending):
            item = pending[future]
            try:
                records.extend(future.result())
            except Exception as error:
                errors.append({"page": item["page"], "error": str(error)})
                print("FAILED", item["page"], str(error), flush=True)
            # Save progress safely so a rerun can reuse verified complete pairs.
            ordered = sorted(records, key=lambda record: record["id"])
            if len(records) % 20 == 0 or errors:
                save_manifest(ordered)
    make_links_relative(records)
    records.append(write_index(records))
    records.sort(key=lambda record: record["id"])
    save_manifest(records)
    print(json.dumps({"documents": len(records) // 2, "files": len(records), "bytes": sum(item["bytes"] for item in records), "errors": errors}, ensure_ascii=False), flush=True)
    if errors:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

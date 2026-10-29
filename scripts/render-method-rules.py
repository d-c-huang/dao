"""Render the project's simple, trusted rules Markdown using only Python stdlib."""
from pathlib import Path
import html
import re

ROOT=Path(__file__).resolve().parents[1]
source=(ROOT/'docs/traditional-methods.md').read_text(encoding='utf-8')

def inline(text):
    return re.sub(r'\[([^\]]+)\]\((https://(?:[^\s()]|\([^()]*\))+)\)', r'<a href="\2">\1</a>', html.escape(text))

blocks=[]
lines=source.splitlines()
i=0
while i<len(lines):
    line=lines[i]
    if not line.strip():
        i+=1
        continue
    if line.startswith('|'):
        rows=[]
        while i<len(lines) and lines[i].startswith('|'):
            cells=[v.strip() for v in lines[i].strip('|').split('|')]
            if not all(re.fullmatch(r':?-+:?', v) for v in cells):
                tag='th' if not rows else 'td'
                rows.append('<tr>'+''.join(f'<{tag}>'+inline(v)+f'</{tag}>' for v in cells)+'</tr>')
            i+=1
        blocks.append('<div class="scroll"><table><thead>'+rows[0]+'</thead><tbody>'+''.join(rows[1:])+'</tbody></table></div>')
        continue
    match=re.match(r'^(#{1,3}) (.+)',line)
    if match:
        level=len(match[1]);blocks.append(f'<h{level}>'+inline(match[2])+f'</h{level}>')
    elif line.startswith('- '):
        items=[]
        while i<len(lines) and lines[i].startswith('- '):
            items.append('<li>'+inline(lines[i][2:])+'</li>');i+=1
        blocks.append('<ul>'+''.join(items)+'</ul>');continue
    else:
        blocks.append('<p>'+inline(line)+'</p>')
    i+=1
css='body{max-width:76ch;margin:36px auto;padding:0 24px;background:#fcfaf1;color:#293f30;font:18px/2 serif}h1{font-size:30px;line-height:1.5}h2{font-size:25px;margin-top:48px;border-bottom:1px solid #ccd6bf;padding-bottom:12px}h3{font-size:21px;margin-top:30px}a{color:#42672f}nav{font:13px/1.8 sans-serif;margin-bottom:30px}.scroll{overflow:auto}table{border-collapse:collapse;width:100%;font-size:15px;white-space:nowrap}td,th{padding:8px 12px;border:1px solid #d5dfc8;text-align:left}th{background:#edf2e4}li{margin-bottom:12px}p{overflow-wrap:anywhere}@media(max-width:600px){body{padding:0 18px;font-size:17px}h1{font-size:26px}}'
document='<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; base-uri \'none\'"><title>排盘规则、版本选择与出处</title><style>'+css+'</style></head><body><nav><a href="/#divination">返回术数工坊</a> · <a href="/#sources">返回资料页</a> · <a href="rules.md" download>下载规则 Markdown</a></nav>'+''.join(blocks)+'</body></html>'
dest=ROOT/'public/resources/methods'
dest.mkdir(parents=True,exist_ok=True)
(dest/'rules.html').write_text(document,encoding='utf-8')
(dest/'rules.md').write_text(source,encoding='utf-8')
print('Rendered local rules HTML and Markdown')

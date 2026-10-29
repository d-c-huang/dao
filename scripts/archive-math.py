"""Archive the project's reusable mathematics sources without changing their meaning.

Run from any directory with Python 3.10+: python scripts/archive-math.py
Only the explicit official URLs below are fetched. No websites are crawled.
"""
from __future__ import annotations

from datetime import datetime, timezone
from hashlib import sha256
from html import escape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin
from urllib.request import Request, urlopen
import json
import re
import time

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "public" / "resources" / "mathematics"
MANIFESTS = ROOT / "public" / "resources" / "manifests"
DATE = "2026-10-29"
MIT_BASE = "https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/"
MIT_LICENSE = "https://ocw.mit.edu/pages/privacy-and-terms-of-use/"
NIST_URL = "https://xlinux.nist.gov/dads/HTML/HammingDistance.html"
NIST_LICENSE = "https://www.nist.gov/copyrights-disclaimers"
BERKELEY_URL = "https://people.eecs.berkeley.edu/~daw/teaching/cs70-f03/Notes/hypercube.pdf"


def fetch(url: str) -> bytes:
    for attempt in range(3):
        try:
            with urlopen(Request(url, headers={"User-Agent": "EightTrigramsResearchArchive/1.0"}), timeout=60) as response:
                if response.status != 200:
                    raise RuntimeError(f"Unexpected HTTP status {response.status}: {url}")
                return response.read()
        except Exception:
            if attempt == 2:
                raise
            time.sleep(attempt + 1)
    raise AssertionError("unreachable")


class ArticleHTML(HTMLParser):
    """Keep all article body text and safe markup; do not execute remote scripts."""
    allowed = set("h1 h2 h3 h4 p div span a strong em b i sub sup ul ol li table thead tbody tr th td blockquote pre code br hr dl dt dd".split())
    blocked = {"script", "style", "iframe", "object", "embed", "noscript"}

    def __init__(self, base: str):
        super().__init__(convert_charrefs=True)
        self.base = base
        self.skip = 0
        self.output: list[str] = []
        self.text: list[str] = []

    def handle_starttag(self, tag, attrs):
        if tag in self.blocked:
            self.skip += 1
            return
        if self.skip:
            return
        attrs = dict(attrs)
        if tag == "img":
            self.output.append(escape(attrs.get("alt", "")))
            self.text.append(attrs.get("alt", ""))
        elif tag in self.allowed:
            safe_attrs = ""
            if tag == "a" and attrs.get("href"):
                href = urljoin(self.base, attrs["href"])
                if href.startswith(("https://", "http://", "mailto:", "#")):
                    safe_attrs = f' href="{escape(href, quote=True)}" rel="noreferrer noopener"'
            self.output.append(f"<{tag}{safe_attrs}>")
            if tag in {"p", "div", "h1", "h2", "h3", "li", "br", "hr"}:
                self.text.append("\n")

    def handle_endtag(self, tag):
        if tag in self.blocked:
            self.skip = max(0, self.skip - 1)
            return
        if self.skip:
            return
        if tag in self.allowed and tag not in {"br", "hr"}:
            self.output.append(f"</{tag}>")
            if tag in {"p", "div", "h1", "h2", "h3", "li"}:
                self.text.append("\n")

    def handle_data(self, data):
        if not self.skip:
            self.output.append(escape(data))
            self.text.append(data)


def record(file: Path, source_id: str, title: str, url: str, license_text: str, scope: str, fmt: str, **extra):
    blob = file.read_bytes()
    return {
        "id": file.stem + "-" + file.suffix[1:], "sourceId": source_id,
        "title": title, "url": url,
        "downloadedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "license": license_text, "scope": scope, "format": fmt,
        "path": "/" + file.relative_to(ROOT / "public").as_posix(),
        "bytes": len(blob), "sha256": sha256(blob).hexdigest(), **extra,
    }


def save_pdf(filename, source_id, title, url, scope, document_license="CC BY-NC-SA 4.0 (MIT OpenCourseWare resource license)", license_url=MIT_LICENSE, **extra):
    blob = fetch(url)
    if not blob.startswith(b"%PDF-") or b"%%EOF" not in blob[-4096:]:
        raise RuntimeError(f"The downloaded document is not a complete PDF: {url}")
    file = DEST / filename
    file.write_bytes(blob)
    return record(file, source_id, title, url, document_license, scope, "pdf", licenseUrl=license_url, author="Eric Lehman; F. Thomson Leighton; Albert R. Meyer", **extra)


def main():
    DEST.mkdir(parents=True, exist_ok=True)
    MANIFESTS.mkdir(parents=True, exist_ok=True)
    # The exact Session 25 resource landing page declares this license in metadata.
    resource = fetch(MIT_BASE + "resources/mit6_042js15_session25/").decode("utf-8", errors="replace")
    if "https://creativecommons.org/licenses/by-nc-sa/4.0/" not in resource:
        raise RuntimeError("MIT resource license could not be reconfirmed; archive not refreshed")
    entries = [save_pdf(
        "mit6_042js15_session25.pdf", "counting", "MIT Session 25：Cardinality Rules（原始 PDF 全文）",
        MIT_BASE + "mit6_042js15_session25.pdf",
        "既有资源链接的完整原始 PDF，6 页，含教材页 551–555 及 OCW 署名页；未修改 PDF。",
        pages=6,
    )]
    textbook_landing = fetch(MIT_BASE + "resources/mit6_042js15_textbook/").decode("utf-8", errors="replace")
    if "https://creativecommons.org/licenses/by-nc-sa/4.0/" not in textbook_landing:
        raise RuntimeError("MIT open textbook license could not be reconfirmed")
    entries.append(save_pdf(
        "mit6_042js15_textbook.pdf", "hypercube", "MIT 完整开放教材（超立方体替代阅读）",
        MIT_BASE + "mit6_042js15_textbook.pdf",
        "MIT 原始完整教材，920 页；超立方体定义与练习见教材第 459 页（PDF 第 468 页）。它是可重用的替代阅读，不是 Berkeley 2003 讲义的副本。",
        document_license="CC BY-NC-SA 3.0 (explicit copyright notice on PDF page 2)",
        license_url="https://creativecommons.org/licenses/by-nc-sa/3.0/",
        relation="alternative", role="alternative", alternativeFor=BERKELEY_URL, pages=920,
    ))
    original = fetch(NIST_URL).decode("utf-8", errors="strict")
    body = re.search(r"<body[^>]*>([\s\S]*?)</body>", original, flags=re.I)
    if not body:
        raise RuntimeError("NIST document body was not found")
    parser = ArticleHTML(NIST_URL)
    parser.feed(body.group(1))
    content = "".join(parser.output)
    text = re.sub(r"\n[ \t]*\n(?:[ \t]*\n)+", "\n\n", "".join(parser.text)).strip()
    if "The number of bits which differ" not in text or "Cite this as" not in text:
        raise RuntimeError("NIST article failed content completeness checks")
    if re.search(r"<(?:script|iframe|object|embed)\b", content, flags=re.I):
        raise RuntimeError("Unsafe executable markup remained")
    preface = f"NIST / Paul E. Black. Original: {NIST_URL}\nArchived: {DATE}. License / copying policy: {NIST_LICENSE}\nFull article body retained; executable scripts and remote presentation resources removed.\n\n"
    document = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><title>Hamming distance — local full-text archive</title><style>body{{max-width:850px;margin:40px auto;padding:0 24px;background:#faf9f4;color:#243e35;font:17px/1.85 Georgia,serif}}a{{color:#315e4b;overflow-wrap:anywhere}}.archive-note{{padding:18px 22px;border:1px solid #d7dfca;background:#eef2e5;font:13px/1.8 Arial,sans-serif;margin-bottom:32px}}h1{{line-height:1.35}}hr{{border:0;border-top:1px solid #d7dfca;margin:28px 0}}</style></head><body><div class="archive-note">{escape(preface).replace(chr(10), '<br>')}</div>{content}</body></html>
'''
    html_file = DEST / "nist-hamming-distance.html"
    html_file.write_text(document, encoding="utf-8")
    text_file = DEST / "nist-hamming-distance.txt"
    text_file.write_text(preface + text + "\n", encoding="utf-8")
    scope = "完整词条正文、注记、作者与原页引用信息；清除可执行脚本、远程样式与图片，原站联系及相关词条链接保留。"
    for file, fmt in ((html_file, "html"), (text_file, "text")):
        entries.append(record(file, "hamming", "NIST：Hamming distance（全文）", NIST_URL, "NIST unmarked public information: copying and distribution permitted", scope, fmt, licenseUrl=NIST_LICENSE, author="Paul E. Black / NIST"))
    unavailable = [{
        "sourceId": "hypercube", "url": BERKELEY_URL, "title": "UC Berkeley CS70 Lecture 6 原始讲义",
        "reason": "已检查原始 PDF 的课程入口及作者教学目录，未找到明确允许全文重分发的许可。未把网络公开访问等同于重分发授权；已有短引与原创说明保留，另提供 MIT 开放教材作为替代阅读。",
        "status": "restricted", "license": "No explicit redistribution license located",
        "checkedUrls": [BERKELEY_URL, "https://people.eecs.berkeley.edu/~daw/teaching/cs70-f03/", "https://people.eecs.berkeley.edu/~daw/teaching"],
        "alternativePath": "/resources/mathematics/mit6_042js15_textbook.pdf",
        "checkedAt": DATE,
    }]
    (MANIFESTS / "math.json").write_text(json.dumps(entries, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (MANIFESTS / "math-unavailable.json").write_text(json.dumps(unavailable, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (DEST / "ATTRIBUTION.md").write_text(f'''# Mathematics source attribution

Archived on {DATE}. PDF files preserve the original downloaded bytes.

## MIT OpenCourseWare

Eric Lehman, F. Thomson Leighton and Albert R. Meyer. *Mathematics for Computer Science*, Spring 2015, MIT 6.042J / 18.062J.

- Session 25: {MIT_BASE}mit6_042js15_session25.pdf
- Complete open textbook: {MIT_BASE}mit6_042js15_textbook.pdf
- Session 25 resource page license: https://creativecommons.org/licenses/by-nc-sa/4.0/
- Complete textbook's own copyright notice (PDF page 2): https://creativecommons.org/licenses/by-nc-sa/3.0/
- MIT terms: {MIT_LICENSE}

Retain attribution; noncommercial use and share-alike conditions apply. No changes were made to either PDF. The complete textbook is alternative reading for the hypercube topic, not a copy of the Berkeley lecture. The hypercube definition and exercise are in Problem 11.45, printed page 459 / PDF page 468. The full textbook has 920 PDF pages.

## NIST

Paul E. Black, "Hamming distance", in *Dictionary of Algorithms and Data Structures*, entry modified 31 May 2006.

- Original: {NIST_URL}
- Official copying policy: {NIST_LICENSE}

The policy permits copying/distribution of information not otherwise marked copyrighted. The local HTML retains the complete article body and attribution; executable scripts, remote style sheets and remote imagery were removed. Linked related articles were not recursively downloaded.

## Berkeley original not mirrored

{BERKELEY_URL}

No explicit full-text redistribution license was located in the checked official course/author pages. This archive records that limit instead of labelling the MIT alternative as a Berkeley copy.
''', encoding="utf-8")
    print(json.dumps({"files": len(entries), "bytes": sum(item["bytes"] for item in entries), "restrictedOriginals": len(unavailable)}, ensure_ascii=False))


if __name__ == "__main__":
    main()

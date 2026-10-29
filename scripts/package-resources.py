"""Validate downloaded originals, merge provenance, and package a local archive.

No network access is performed here. Run the source-specific acquisition scripts
to refresh files first. Python 3 standard library only.
"""
from __future__ import annotations

import hashlib
import json
import shutil
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import unquote

BASE = Path(__file__).resolve().parents[1]
RESOURCE_ROOT = (BASE / "public" / "resources").resolve()
PARTS = RESOURCE_ROOT / "manifests"
EXPECTED = {
    "zhou-yi-64", "shuo-gua", "xi-ci-shang", "xi-ci-xia", "leibniz-1703",
    "counting", "hypercube", "hamming", "ai-reasoning", "ai-react",
}
FORMATS = {"html", "markdown", "pdf", "text", "image"}


def read_records(path: Path) -> list[dict]:
    content = json.loads(path.read_text(encoding="utf-8-sig"))
    if isinstance(content, list):
        return content
    for key in ("files", "records", "unavailable"):
        if isinstance(content.get(key), list):
            return content[key]
    raise ValueError(f"Unsupported manifest shape: {path.name}")


def resolve_resource(web_path: str) -> Path:
    decoded = unquote(web_path)
    if not decoded.startswith("/resources/") or "\\" in decoded or any(
        part in (".", "..") for part in decoded.split("/")
    ):
        raise ValueError(f"Unsafe archive path: {web_path}")
    path = (BASE / "public" / decoded.lstrip("/")).resolve()
    if not path.is_relative_to(RESOURCE_ROOT):
        raise ValueError(f"Archive path escapes resources: {web_path}")
    return path


def main() -> None:
    RESOURCE_ROOT.mkdir(parents=True, exist_ok=True)
    files: list[dict] = []
    unavailable: list[dict] = []
    for name in ("classics", "math", "history-ai"):
        part = PARTS / f"{name}.json"
        if not part.is_file():
            raise FileNotFoundError(f"Acquisition is not finished: {part}")
        files.extend(read_records(part))
        missing = PARTS / f"{name}-unavailable.json"
        if missing.is_file():
            unavailable.extend(read_records(missing))

    ids: set[str] = set()
    for record in files:
        for key in ("id", "sourceId", "title", "url", "downloadedAt", "license", "scope", "format", "path"):
            if not isinstance(record.get(key), str) or not record[key].strip():
                raise ValueError(f"Missing {key}: {record}")
        if record["id"] in ids:
            raise ValueError(f"Duplicate asset ID: {record['id']}")
        ids.add(record["id"])
        if record["sourceId"] not in EXPECTED or record["format"] not in FORMATS:
            raise ValueError(f"Unknown source or format: {record['id']}")
        data = resolve_resource(record["path"]).read_bytes()
        if not data:
            raise ValueError(f"Empty asset: {record['path']}")
        digest = hashlib.sha256(data).hexdigest()
        if record.get("bytes") not in (None, len(data)) or record.get("sha256") not in (None, digest):
            raise ValueError(f"Asset differs from its acquisition manifest: {record['path']}")
        record["bytes"] = len(data)
        record["sha256"] = digest
        record.setdefault("relation", "original")
        if record["sourceId"] == "ai-react":
            # The PDF and its attribution note identify the same saved edition.
            record["documentKey"] = "arxiv:2210.03629v3"
        if record["relation"] not in ("original", "alternative"):
            raise ValueError(f"Unknown source relation: {record['id']}")

    represented = {record["sourceId"] for record in files} | {record["sourceId"] for record in unavailable}
    if represented != EXPECTED:
        raise ValueError(f"Source status is incomplete: {EXPECTED - represented}")
    for record in unavailable:
        if record.get("status") not in ("restricted", "unavailable") or not record.get("reason"):
            raise ValueError(f"Missing reason for an unarchived source: {record}")

    files.sort(key=lambda record: (record["sourceId"], record["path"]))
    manifest = {
        "version": 1,
        "generatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "scope": "资料页列出的十条来源及六十四卦关联页面；不递归镜像整个站点。",
        "files": files,
        "unavailable": unavailable,
        "bundlePath": "/resources/source-archive.zip",
    }
    (RESOURCE_ROOT / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    notes_dir = RESOURCE_ROOT / "notes"
    notes_dir.mkdir(exist_ok=True)
    for name in ("archive-classics.md", "archive-math.md", "archive-history-ai.md"):
        provenance = BASE / "docs" / "sources" / name
        if provenance.is_file():
            shutil.copyfile(provenance, notes_dir / name)

    original_sources = {
        record["sourceId"] for record in files
        if record["relation"] == "original" and record["format"] != "image"
    }
    incomplete_sources = {record["sourceId"] for record in unavailable}
    completed = original_sources - incomplete_sources
    lines = [
        "# 八象有解 · 本地全文资源包", "",
        f"保存日期：{manifest['generatedAt'][:10]}。十条来源中 {len(completed)} 条原文已完整归档。", "",
        "古籍 HTML／TXT 包含完整经传正文，原始 PDF 保持下载文件内容。HTML 是可离线阅读的正文快照，",
        "不是来源站点界面、搜索服务或其全部媒体文件的镜像。每个文件的来源、范围、许可、字节数与 SHA-256 见 manifest.json。", "",
        "解压后可直接打开各 HTML 文件或 PDF；项目运行时可在“资料与出处”的“本地全文”中选择阅读。", "",
        "## 原件未归档的项目", "",
    ]
    for item in unavailable:
        lines.append(f"- {item['title']}：{item['reason']} 原址：{item['url']}")
    lines.extend(["", "## 许可与补充阅读", "", "各文件仍受其原有许可约束；保存文件不改变署名、非商业使用或相同方式共享等条件。",
                  "标有 alternative 的文件是开放许可补充阅读，不冒充未获得的原件。具体许可核对记录见 notes/。", ""])
    (RESOURCE_ROOT / "README.md").write_text("\n".join(lines), encoding="utf-8")

    archive_path = RESOURCE_ROOT / "source-archive.zip"
    temporary_path = RESOURCE_ROOT / "source-archive.tmp.zip"
    with zipfile.ZipFile(temporary_path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
        for path in sorted(RESOURCE_ROOT.rglob("*")):
            if not path.is_file() or path in (archive_path, temporary_path):
                continue
            if path.name.endswith((".tmp", ".part")) or "__pycache__" in path.parts:
                continue
            archive.write(path, path.relative_to(RESOURCE_ROOT).as_posix())
    temporary_path.replace(archive_path)
    with zipfile.ZipFile(archive_path) as archive:
        bad = archive.testzip()
        if bad:
            raise ValueError(f"Corrupted ZIP entry: {bad}")
    print(json.dumps({
        "original_sources": len(completed), "source_count": len(EXPECTED),
        "files": len(files), "restricted_or_unavailable": len(unavailable),
        "file_bytes": sum(record["bytes"] for record in files), "zip_bytes": archive_path.stat().st_size,
        "manifest": str(RESOURCE_ROOT / "manifest.json"), "bundle": str(archive_path),
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()

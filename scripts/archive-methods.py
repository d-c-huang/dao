"""Save primary method texts separately from the original ten-source archive."""
import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('classics', ROOT / 'scripts/archive-classics.py')
classic = importlib.util.module_from_spec(spec)
spec.loader.exec_module(classic)
classic.DEST = ROOT / 'public/resources/methods'
classic.MANIFEST = classic.DEST / 'manifest.json'
classic.PRIOR_RECORDS = json.loads(classic.MANIFEST.read_text(encoding='utf-8')) if classic.MANIFEST.exists() else []
documents = [
    ('plum-2', '梅花易數/卷二', '梅花易数 · 卷二 · 体用生克'),
    ('zengshan', '增刪卜易', '增删卜易 · 八宫、纳甲、六亲、世应'),
    ('liuren-1', '六壬大全/1', '六壬大全 · 卷一 · 九宗门起例'),
    ('liuren-7', '六壬大全/7', '六壬大全 · 卷七 · 课经与古例'),
    ('taiyi', '太乙秘書', '太乙秘书 · 主客算法与阴阳七十二局'),
]
classic.PAGE_PATHS = {page: '/resources/methods/' + key + '.html' for key, page, _ in documents}
records = []
for key, page, title in documents:
    records.extend(classic.archive({'id': key, 'sourceId': 'traditional-methods', 'stem': key, 'page': page, 'title': title}))
for record in records:
    record['path'] = record['path'].replace('/resources/classics/', '/resources/methods/')
    record['scope'] = '所引文章正文全文；含原站编者文字，保留来源、修订和许可。图示以原有 alt 文字呈现。'
    if record['format'] == 'html':
        path = ROOT / 'public' / record['path'].lstrip('/')
        document = path.read_text(encoding='utf-8').replace('/resources/classics/index.html', '/resources/methods/rules.html').replace('本地经典全文目录', '排盘规则与出处')
        path.write_text(document, encoding='utf-8')
        import hashlib
        record['bytes'] = len(path.read_bytes())
        record['sha256'] = hashlib.sha256(path.read_bytes()).hexdigest()
classic.MANIFEST.write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('Saved', len(records), 'method source files')

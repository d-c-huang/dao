"""Extract the 28 traditional mansion asterisms and their HYG v4.0 stars.

Missing inputs are downloaded from the documented upstream URLs and verified
against the hashes recorded in the checked-in adapted dataset before import.
Only the required HIP identifiers and J2000 coordinates enter the project.
The resulting adapted dataset is CC BY-SA 4.0; see public/licenses/star-data.txt.
"""
import csv,json,hashlib,gzip
from pathlib import Path
root=Path(__file__).resolve().parents[1]
linefile=root/'scripts/chinese-sky-source.tmp.json'
catalog=root/'scripts/hyg-stars.tmp.csv'
saved=root/'src/star-knowledge.json'
if not linefile.exists() or not catalog.exists():
    import requests
    expected=json.loads(saved.read_text(encoding='utf-8'))['provenance']
    for path,url,digest,compressed in [
        (linefile,'https://raw.githubusercontent.com/Stellarium/stellarium-skycultures/master/chinese/index.json',expected[0]['sha256'],False),
        (catalog,'https://raw.githubusercontent.com/astronexus/HYG-Database/main/hyg/CURRENT/hygdata_v40.csv.gz',expected[1]['sha256Uncompressed'],True)]:
        if path.exists():continue
        response=requests.get(url,timeout=90);response.raise_for_status()
        content=gzip.decompress(response.content) if compressed else response.content
        if hashlib.sha256(content).hexdigest()!=digest:raise ValueError('Upstream changed; review before importing: '+url)
        path.write_bytes(content)
raw=json.loads(linefile.read_text(encoding='utf-8'))
groups=[dict(name='东方青龙',color='#78cfb4',names='角亢氐房心尾箕',description='传统四象中的东方七宿；用角、房、心、尾等名称构成龙形的文化联想。'),dict(name='北方玄武',color='#8ca9f0',names='斗牛女虚危室壁',description='传统四象中的北方七宿。斗宿的斗是南斗，不能与北斗七星混同。'),dict(name='西方白虎',color='#ece1bc',names='奎娄胃昴毕觜参',description='传统四象中的西方七宿。昴、毕、参等星官适合作为辨认冬季星空的线索。'),dict(name='南方朱雀',color='#f39c8d',names='井鬼柳星张翼轸',description='传统四象中的南方七宿。星宿既可泛指群星，也专指这里二十八宿中的“星”宿。')]
english=['Horn','Neck','Root','Room','Heart','Tail','Winnowing Basket','Dipper','Ox','Girl','Emptiness','Rooftop','Encampment','Wall','Legs','Bond','Stomach','Hairy Head','Net','Turtle Beak','Three Stars','Well','Ghosts','Willow','Star','Extended Net','Wings','Chariot']
names=''.join(g['names'] for g in groups)
meanings=['角，传统龙形的起点；以角宿一（Spica）一带为辨认线索。','龙颈的文化意象，不能用字面形状推断恒星的物理联系。','龙根或胸部附近的传统意象。','传统龙形的腹房意象。','其中明亮红星心宿二（Antares）常用于辨认，恒星颜色与温度相关。','弯曲尾形的星官连线，图案是地球视角下的投影。','簸箕形象的传统命名。','南斗星官，区别于北天的北斗七星。','“牵牛”名称有历史语境，此处牛宿不要直接等同于现代俗称牛郎星的河鼓二。','女宿星官，不能直接等同于织女星。','传统北方七宿之一；宿名与空间中的真空没有物理对应。','传统星官名称，位置识别以本页HIP编号与坐标为准。','有营室、屋宇的文化意象。','与室宿相邻，命名有壁垒、墙壁的文化意象。','传统西方七宿之首，跨越现代星座划分。','传统连缀、聚合的文化意象。','传统胃部意象，星官名称不是恒星的科学分类。','昴星团方向的著名星官；星团和传统连线是不同概念。','网形的文化意象，其中毕宿五（Aldebaran）是亮星辨认线索。','觜读zī，传统鸟喙意象，位于参宿附近。','参读shēn，包含著名的三颗腰带星及周围亮星。','井形文化意象，位于银河附近的星区。','鬼宿星区靠近蜂巢星团方向，传统星官不等于整片星团。','弯曲柳枝的文化意象。','专名“星宿”，其中星宿一（Alphard）是辨认线索。','张开的文化意象，传统名称与物理属性应分开理解。','朱雀翅翼的文化意象。','轸读zhěn，车后横木的传统意象。']
mansions=[]
for i,(name,en) in enumerate(zip(names,english)):
    match=[c for c in raw['constellations'] if c.get('common_name',{}).get('english')==en]
    if len(match)!=1:raise ValueError((name,en,len(match)))
    mansions.append(dict(name=name,english=en,group=i//7,meaning=meanings[i],lines=match[0]['lines']))
hips=set(h for m in mansions for path in m['lines'] for h in path)
stars=[]
with catalog.open(encoding='utf-8') as f:
    for row in csv.DictReader(f):
        if row['hip'] and int(row['hip']) in hips:
            stars.append(dict(hip=int(row['hip']),ra=float(row['ra']),dec=float(row['dec']),mag=float(row['mag'])))
assert hips=={s['hip'] for s in stars}, hips-{s['hip'] for s in stars}
data=dict(epoch='J2000.0',license='CC BY-SA 4.0',groups=groups,mansions=mansions,stars=sorted(stars,key=lambda s:s['hip']),provenance=[dict(title='Stellarium Chinese sky culture',url='https://github.com/Stellarium/stellarium-skycultures/blob/master/chinese/index.json',sha256=hashlib.sha256(linefile.read_bytes()).hexdigest()),dict(title='HYG v4.0',url='https://github.com/astronexus/HYG-Database/blob/main/hyg/CURRENT/hygdata_v40.csv.gz',sha256Uncompressed=hashlib.sha256(catalog.read_bytes()).hexdigest())])
(root/'src/star-knowledge.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'Imported {len(mansions)} mansions, {len(stars)} stars')

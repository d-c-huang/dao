"""Generate original project study notes from the same data used by the app."""
from pathlib import Path
import html
import json

ROOT=Path(__file__).resolve().parents[1]
data=json.loads((ROOT/'src/calendar-knowledge.json').read_text(encoding='utf-8'))
sky=json.loads((ROOT/'src/star-knowledge.json').read_text(encoding='utf-8'))
escape=html.escape
sources={s['id']:s for s in data['sources']}
title='时辰、节气农事、天文星宿与历法 · 项目知识整理'
intro='本文件是项目原创知识整理，与网站共用同一份知识数据。不是第三方站点全文或图片镜像。在线原资料的权利归原作者；引用入口逐节列出。年度节气交接时刻由站内历法模块另按所选年份计算，本文件保留全部角度、概念和阅读说明，不提供固定的年度时刻。'
md=['# '+title,'','核对日期：'+data['reviewedAt']+'。知识版本：calendar-study-v1。','',intro,'','## 使用术数工具的注意事项','']
body=['<h1>'+title+'</h1><p>核对日期：'+data['reviewedAt']+' · calendar-study-v1</p><p>'+intro+'</p><h2>使用术数工具的注意事项</h2>']
for p in data['precautions']:
    md+=['### '+p['title'],'',p['summary'],'']+['- '+d for d in p['details']]+['']
    body+=['<h3>'+escape(p['title'])+'</h3><p>'+escape(p['summary'])+'</p><ul>'+''.join('<li>'+escape(d)+'</li>' for d in p['details'])+'</ul>']
md+=['## 24小时与十二时辰对照','','每行一小时；右端点不包含。子时从23:00至次日01:00之前，00:00仍为子时。本项目在00:00换日。','','| 开始 | 结束（不含） | 时辰 | 现代对照分段 |','| --- | --- | --- | --- |']
body+=['<h2>24小时与十二时辰对照</h2><p>右端点不包含；23:00进入子时，00:00才换日期。</p><div class="scroll"><table><thead><tr><th>开始</th><th>结束（不含）</th><th>时辰</th><th>现代对照分段</th></tr></thead><tbody>']
branches='子丑寅卯辰巳午未申酉戌亥'
for hour in range(24):
    values=[f'{hour:02}:00','次日00:00' if hour==23 else f'{hour+1:02}:00',branches[((hour+1)//2)%12]+'时','前半' if hour%2 else '后半']
    md+=['| '+' | '.join(values)+' |']
    body+=['<tr>'+''.join('<td>'+v+'</td>' for v in values)+'</tr>']
md+=['','## 二十四节气','','节气以太阳视黄经每隔15°划分；十二节与十二中气交替。这里按公历年从小寒排至冬至。','','| 节气 | 类型 | 黄经 | 传统分季 | 工坊关联 |','| --- | --- | --- | --- | --- |']
body+=['</tbody></table></div><h2>二十四节气</h2><p>节气是太阳视黄经达到特定角度的时刻，不能用固定15天递加推算；十二节与十二中气交替。</p><div class="scroll"><table><thead><tr><th>节气</th><th>类型</th><th>黄经</th><th>分季</th><th>工坊关联</th></tr></thead><tbody>']
for term in data['terms']:
    link=('中气换'+term['branch']+'将') if term['kind']=='中气' else ('节令'+term['branch']+'月起点')
    values=[term['name'],term['kind'],str(term['longitude'])+'°',term['season'],link]
    md+=['| '+' | '.join(values)+' |']
    body+=['<tr>'+''.join('<td>'+escape(v)+'</td>' for v in values)+'</tr>']
body+=['</tbody></table></div>']
for term in data['terms']:
    md+=['','### '+term['name'],'',term['meaning'],'',term['note'],'']
    body+=['<h3>'+term['name']+'</h3><p>'+escape(term['meaning'])+'</p><p>'+escape(term['note'])+'</p>']
    farming=term['farming']
    md+=['#### 农事：'+farming['stage'],'',farming['north'],'',farming['south'],'','关注风险：'+farming['risk']+'。','']
    body+=['<h4>农事：'+escape(farming['stage'])+'</h4><p>'+escape(farming['north'])+'</p><p>'+escape(farming['south'])+'</p><p>关注风险：'+escape(farming['risk'])+'。</p>']
    refs=[sources[s] for s in farming['sources']]
    md+=['农事依据：'+'、'.join('['+s['title']+']('+s['url']+')' for s in refs),'']
    body+=['<p class="references">农事依据：'+' · '.join('<a href="'+escape(s['url'],quote=True)+'">'+escape(s['title'])+'</a>' for s in refs)+'</p>']
farming_note='农事为地域和作物生育期的学习示例，不是全国统一播期。实际作业应结合当地品种、苗情、地温、墒情、天气预报及当地农技指导。'
md+=['',farming_note,''];body+=['<p class="lead">'+farming_note+'</p>']
md+=['','节气定义与角度来源：['+sources['hko-terms']['title']+']('+sources['hko-terms']['url']+')。','']
for section,label in [('hours','时辰与时间规则'),('astronomy','天文基础与3D模型'),('stars','星宿与天球'),('calendar','历法规则')]:
    md+=['## '+label,''];body+=['<h2>'+label+'</h2>']
    for chapter in data['chapters']:
        if chapter['section']!=section:continue
        md+=['### '+chapter['title'],'',chapter['lead'],'']
        body+=['<section id="'+chapter['id']+'"><h3>'+escape(chapter['title'])+'</h3><p class="lead">'+escape(chapter['lead'])+'</p>']
        for p in chapter['paragraphs']:
            md+=[p,''];body+=['<p>'+escape(p)+'</p>']
        references=[sources[s] for s in chapter['sources']]
        md+=['依据：'+'、'.join('['+s['title']+']('+s['url']+')' for s in references),'']
        body+=['<p class="references">依据：'+' · '.join('<a href="'+escape(s['url'],quote=True)+'">'+escape(s['title'])+'</a>' for s in references)+'</p></section>']
md+=['## 二十八宿完整知识索引','','三维图绘制同名星官连线，不代表传统宿界。所有恒星方向以J2000.0为基准；同球半径不代表真实距离。','']
body+=['<h2>二十八宿完整知识索引</h2><p>星官连线不代表传统宿界。J2000.0目录方向投影至同一球面，不代表真实距离。</p>']
for group_index,group in enumerate(sky['groups']):
    md+=['### '+group['name'],'',group['description'],''];body+=['<h3>'+group['name']+'</h3><p>'+group['description']+'</p>']
    for m in sky['mansions']:
        if m['group']!=group_index:continue
        md+=['#### '+m['name']+'宿','',m['meaning'],''];body+=['<h4>'+m['name']+'宿</h4><p>'+escape(m['meaning'])+'</p>']
md+=['数据：Stellarium中国星官连线、HYG v4.0恒星坐标；本地星表见star-data.json，署名与改编许可见../../licenses/star-data.txt。','']
body+=['<p>数据：Stellarium中国星官连线、HYG v4.0恒星坐标。<a href="star-data.json">下载本地星表与连线</a> · <a href="/licenses/star-data.txt">署名及CC BY-SA许可</a>。3D功能需在项目网页中打开，本文保留完整文字供离线阅读。</p>']
md+=['## 全部参考资料',''];body+=['<h2>全部参考资料</h2><ol>']
for s in data['sources']:
    md+=['- ['+s['title']+']('+s['url']+')：'+s['note']]
    body+=['<li><a href="'+escape(s['url'],quote=True)+'">'+escape(s['title'])+'</a>：'+escape(s['note'])+'</li>']
body+=['</ol><p>历法库lunar-typescript 1.8.6按MIT许可使用，<a href="/licenses/lunar-typescript.txt">本地许可全文</a>。</p>']
markdown='\n'.join(md)+'\n'
css='body{max-width:76ch;margin:34px auto;padding:0 24px;background:#fcfaf1;color:#30452f;font:18px/2 serif}h1{font-size:30px;line-height:1.6}h2{font-size:26px;border-bottom:1px solid #ccd8bf;padding-bottom:12px;margin-top:45px}h3{font-size:21px;margin-top:30px}a{color:#4a7039}p{overflow-wrap:anywhere}.lead{padding:12px 17px;border-left:3px solid #aabe92;background:#f0f4e7}.scroll{overflow:auto}table{border-collapse:collapse;width:100%;white-space:nowrap;font-size:14px}th,td{border:1px solid #d8e1cc;padding:8px 12px;text-align:left}th{background:#edf2e2}.references,nav{font:12px/1.9 sans-serif;color:#77866a}li+li{margin-top:10px}@media(max-width:600px){body{padding:0 18px;font-size:17px}h1{font-size:26px}}'
document='<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; base-uri \'none\'"><title>'+title+'</title><style>'+css+'</style></head><body><nav><a href="/#calendar">返回天文与历法</a> · <a href="/#divination">返回术数工坊</a> · <a href="guide.md" download>下载Markdown</a></nav>'+''.join(body)+'</body></html>'
dest=ROOT/'public/resources/calendar';dest.mkdir(parents=True,exist_ok=True)
(ROOT/'docs/calendar-and-astronomy.md').write_text(markdown,encoding='utf-8')
(dest/'guide.md').write_text(markdown,encoding='utf-8')
(dest/'guide.html').write_text(document,encoding='utf-8')
(dest/'star-data.json').write_text(json.dumps(sky,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'Rendered study guide: {len(data["terms"])} solar terms, {len(data["chapters"])} chapters, {len(data["precautions"])} precautions')

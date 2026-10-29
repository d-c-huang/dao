import {useEffect,useState,lazy,Suspense} from 'react';
import {calendarKnowledge,solarTerms,hours24,branchForClock,annualSolarTerms,isGregorianLeapYear,currentBeijingYear,type AnnualSolarTerm} from './calendarKnowledge';
import {EmbeddedResourceReader} from './EmbeddedResourceReader';
import {UsagePrecautions} from './UsagePrecautions';
import './calendar-knowledge.css';
import './astronomy.css';
const AstronomyExplorer=lazy(()=>import('./AstronomyExplorer').then(m=>({default:m.AstronomyExplorer})));
function AstronomyPanel({stars=false}:{stars?:boolean}){return <Suspense fallback={<section className="panel" role="status">正在加载星历与观测台…</section>}><AstronomyExplorer stars={stars}/></Suspense>}

const sections=[{id:'hours',name:'时辰与24小时'},{id:'terms',name:'节气与农事'},{id:'astronomy',name:'3D天文'},{id:'stars',name:'星宿与3D天球'},{id:'calendar',name:'历法规则'},{id:'usage',name:'工具使用须知'}] as const;
type Section=typeof sections[number]['id'];
function CitationLinks({ids}:{ids:string[]}){return <div className="knowledge-citations">依据：{ids.map(id=>{const s=calendarKnowledge.sources.find(s=>s.id===id)!;return <a key={id} href={s.url} target="_blank" rel="noreferrer">{s.title} ↗</a>})}</div>}
function Chapters({section}:{section:Section}){return <div className="knowledge-chapters">{calendarKnowledge.chapters.filter(c=>c.section===section).map((c,i)=><article className="panel knowledge-chapter" id={c.id} key={c.id}><span className="eyebrow">{String(i+1).padStart(2,'0')} / 阅读与理解</span><h2>{c.title}</h2><p className="knowledge-lead">{c.lead}</p>{c.paragraphs.map(p=><p key={p}>{p}</p>)}<CitationLinks ids={c.sources}/></article>)}</div>}

function LongitudeDiagram({angle,name}:{angle:number;name:string}){
  const point=(a:number,r=112)=>({x:160+r*Math.cos(a*Math.PI/180),y:160-r*Math.sin(a*Math.PI/180)}),sun=point(angle);
  return <svg className="longitude-diagram" viewBox="0 0 320 320" role="img" aria-label={`${name}：太阳黄经${angle}度，春分0度、夏至90度、秋分180度、冬至270度`}>
    <circle cx="160" cy="160" r="112" fill="none" stroke="#cad5ba" strokeWidth="1.5"/>
    {solarTerms.map(t=>{const p=point(t.longitude),q=point(t.longitude,104);return <line key={t.name} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={t.kind==='中气'?'#7c9366':'#c1cbb5'} strokeWidth={t.kind==='中气'?2:1}/>})}
    {[{a:0,t:'春分 0°'},{a:90,t:'夏至 90°'},{a:180,t:'秋分 180°'},{a:270,t:'冬至 270°'}].map(p=>{const q=point(p.a,133);return <text key={p.a} x={q.x} y={q.y+4} textAnchor="middle" fill="#587048" fontSize="10">{p.t}</text>})}
    <line x1="160" y1="160" x2={sun.x} y2={sun.y} stroke="#b18a4c" strokeWidth="1.5"/>
    <circle cx="160" cy="160" r="12" fill="#48798a"/><text x="160" y="190" textAnchor="middle" fill="#63775a" fontSize="11">地球视角</text>
    <circle cx={sun.x} cy={sun.y} r="8" fill="#b99451"/><text x="160" y="143" textAnchor="middle" fill="#3e5e33" fontSize="17">{name} · {angle}°</text>
  </svg>;
}

function TermsStudy(){
  const [year,setYear]=useState(currentBeijingYear),[selected,setSelected]=useState('春分'),[table,setTable]=useState<AnnualSolarTerm[]>([]),[loading,setLoading]=useState(false),[error,setError]=useState('');
  useEffect(()=>{let active=true;setTable([]);setError('');if(!Number.isSafeInteger(year)||year<1901||year>2100){setLoading(false);setError('请输入1901—2100年的整数年份');return()=>{active=false}}setLoading(true);annualSolarTerms(year).then(rows=>{if(active)setTable(rows)}).catch(e=>{if(active)setError(e instanceof Error?e.message:'历法模块加载失败')}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[year]);
  const term=solarTerms.find(t=>t.name===selected)!,at=table.find(t=>t.name===selected)?.at;
  function chooseTerm(name:string){setSelected(name);if(window.matchMedia('(max-width:800px)').matches)requestAnimationFrame(()=>document.getElementById('term-reading')?.scrollIntoView({block:'start'}))}
  return <><section className="panel"><span className="eyebrow">24个太阳位置 / 每隔黄经15°</span><h2>节气是一个交接时刻。</h2><p>二十四节气包含十二个“节”和十二个“中气”，交替出现。下表按公历年从小寒排至冬至；春分的黄经为0°。名称里的冷暖、晴雨属于传统物候语境，不能替代地方天气预报。</p><p className="knowledge-small">点选任意节气，查看黄经、交接时刻、物候释义、地域农事与工坊关联。</p><div className="knowledge-year"><label>节气表年份<input type="number" min="1901" max="2100" step="1" value={Number.isNaN(year)?'':year} onChange={e=>setYear(e.target.value===''?NaN:Number(e.target.value))}/></label><button className="text-btn" onClick={()=>setYear(currentBeijingYear())}>回到今年</button><span>北京时间 · 本地历法计算</span></div>{error&&<p role="alert">{error}</p>}<p className="knowledge-small">计算引擎 lunar-typescript 1.8.6。显示到秒不等于与所有权威历表逐秒一致，交接临界请核对年历。</p></section>
    <section className="terms-workspace"><div className="term-selector" role="group" aria-label="选择二十四节气">{solarTerms.map(t=><button key={t.name} aria-pressed={selected===t.name} className={selected===t.name?'active':''} onClick={()=>chooseTerm(t.name)}><b>{t.name}</b><small>{t.longitude}° · {t.kind}</small></button>)}</div><article id="term-reading" className="panel term-reading" aria-label={term.name+'知识'}><div><span className="eyebrow">{term.season}季 · {term.kind}</span><h2>{term.name}</h2><p>{term.meaning}</p><p className="term-moment">{loading?'正在计算交接时刻…':at??'年份无效，暂不显示交接时刻'}</p><p>{term.note}</p><p className="term-tool-rule">{term.kind==='中气'?`工坊关联：交此中气后采用${term.branch}将，是大六壬的月将规则。`:`常用节令月序：此节起${term.branch}月；这是节令月支，不能代替农历月数或月将。`}</p></div><LongitudeDiagram angle={term.longitude} name={term.name}/><div className="farming-reading"><span className="eyebrow">农事学习 / 按地区和生育期理解</span><h3>{term.farming.stage}</h3><div className="farming-regions"><div><h4>北方代表地区</h4><p>{term.farming.north}</p></div><div><h4>南方代表地区</h4><p>{term.farming.south}</p></div></div><p><b>关注风险：</b>{term.farming.risk}。</p><p className="farming-context">节气不等于固定播期。实际作业须结合当地品种、生育期、地温、墒情及天气预报；这里提供知识示例，具体管理以当地农技指导为准。</p><CitationLinks ids={term.farming.sources}/></div></article></section>
    <section className="panel"><h2>{Number.isSafeInteger(year)?year+'年':''}二十四节气交接表</h2><p>同名节气每年的公历日期和时刻会变化；不能以固定15天相加推算。</p>{loading?<p role="status">正在计算全年节气…</p>:table.length>0?<div className="table-scroll"><table className="knowledge-table"><caption>北京时间，按公历年排列；非农历月序。</caption><thead><tr><th>节气</th><th>类型</th><th>太阳黄经</th><th>交接时刻</th><th>分季语境</th></tr></thead><tbody>{table.map(t=><tr key={t.name} className={selected===t.name?'selected':''}><th><button onClick={()=>chooseTerm(t.name)}>{t.name}</button></th><td>{t.kind}</td><td>{t.longitude}°</td><td>{t.at}</td><td>{t.season}</td></tr>)}</tbody></table></div>:<p>请先输入有效年份。</p>}<CitationLinks ids={['hko-terms','hko-calendar','lunar-engine']}/></section></>;
}

export function CalendarKnowledgeReferences(){return <section className="panel calendar-references"><span className="eyebrow">天文与历法 / 原创知识整理与权威出处</span><h2>按概念查来源，按版本核对日期。</h2><p>知识文字由项目整理，附权威资料链接，可离线阅读、下载。星宿模型采用已保存到本地的星表与连线改编数据，保留作者、来源和许可；不镜像来源站点的整页内容。</p><div className="knowledge-reader-actions"><EmbeddedResourceReader path="/resources/calendar/guide.html" title="时辰、节气农事、天文星宿与历法知识整理"/><a href="/resources/calendar/guide.md" download>下载知识整理 Markdown ↓</a></div><details><summary>展开全部参考资料（{calendarKnowledge.sources.length}条）</summary>{calendarKnowledge.sources.map(s=><div className="knowledge-reference-item" key={s.id}><a href={s.url} target="_blank" rel="noreferrer">{s.title} ↗</a><small>{s.note}</small></div>)}<p className="knowledge-small">资料核对：{calendarKnowledge.reviewedAt}。MIT历法库许可见 <a href="/licenses/lunar-typescript.txt">本地许可全文</a>。</p></details></section>}

export function CalendarKnowledgePage(){
  const [section,setSection]=useState<Section>('hours'),[clock,setClock]=useState('23:00'),[leapYear,setLeapYear]=useState(currentBeijingYear);
  let clockResult:ReturnType<typeof branchForClock>|null=null;try{clockResult=branchForClock(clock)}catch{/* Clearing the time field leaves the example empty. */}
  const leapValid=Number.isSafeInteger(leapYear)&&leapYear>0&&leapYear<=9999;
  return <div className="calendar-knowledge-page"><div className="knowledge-tabs" role="group" aria-label="天文历法知识分类">{sections.map(s=><button key={s.id} aria-pressed={section===s.id} className={section===s.id?'active':''} onClick={()=>setSection(s.id)}>{s.name}</button>)}</div>
    {section==='hours'&&<><section className="panel clock-study"><div><span className="eyebrow">先分清单位，再核对日界</span><h2>一天24小时，对照十二时辰。</h2><p>现代一昼夜分24小时；按常用等时对照，12时辰 × 每时辰2小时＝24小时。下面以24行逐小时查阅，两种单位分别标明。</p><label>输入钟表时间<input type="time" value={clock} onInput={e=>setClock(e.currentTarget.value)} onChange={e=>setClock(e.target.value)}/></label></div><div className="clock-result" aria-live="polite">{clockResult?<><small>按本工具钟表时规则</small><b>{clockResult.branch}时</b><span>{clock} · 该时辰{clockResult.half}</span><p>23:00进入子时；00:00才更换日期。</p></>:<span>请选择钟表时间</span>}</div></section><section className="panel"><h2>24小时—十二时辰对照表</h2><div className="table-scroll"><table className="knowledge-table"><caption>每行一小时，右端点不包含；23:00到次日01:00之前都属子时。</caption><thead><tr><th>开始</th><th>结束（不含）</th><th>时辰</th><th>现代对照分段</th></tr></thead><tbody>{hours24.map(h=><tr key={h.clock} className={clockResult?.index===h.index?'selected':''}><td>{h.clock}</td><td>{h.end}</td><th>{h.branch}时</th><td>{h.half}</td></tr>)}</tbody></table></div></section><Chapters section="hours"/></>}
    {section==='terms'&&<TermsStudy/>}
    {section==='astronomy'&&<><AstronomyPanel/><Chapters section="astronomy"/></>}
    {section==='stars'&&<><AstronomyPanel stars/><Chapters section="stars"/></>}
    {section==='calendar'&&<><section className="panel leap-study"><span className="eyebrow">先用一个年份验证公历规则</span><h2>公历闰年，与农历闰月分开看。</h2><label>检验公历年份<input type="number" min="1" max="9999" step="1" value={Number.isNaN(leapYear)?'':leapYear} onChange={e=>setLeapYear(e.target.value===''?NaN:Number(e.target.value))}/></label><p aria-live="polite">{leapValid?`${leapYear}年为${isGregorianLeapYear(leapYear)?'闰年，公历全年366日':'平年，公历全年365日'}。`:'请输入1—9999年的整数年份。'}</p><p className="knowledge-small">能被400整除，或能被4整除但不能被100整除。农历置闰不是这个规则。</p></section><Chapters section="calendar"/></>}
    {section==='usage'&&<UsagePrecautions full/>}
    <CalendarKnowledgeReferences/>
  </div>;
}

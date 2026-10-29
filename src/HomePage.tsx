import { useState, type ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, Binary, BookOpen, CalendarDays, Compass, Layers, Search, Sparkles } from 'lucide-react';
import { trigrams } from './data';
import { Gua } from './Gua';
import type { Page } from './navigation';
import './home.css';

export function HomePage({wheel,selected,order,onOrder,onNavigate,onFind,sourceCount}:{wheel:ReactNode;selected:(typeof trigrams)[number];order:boolean;onOrder:(later:boolean)=>void;onNavigate:(page:Page)=>void;onFind:(query:string)=>void;sourceCount:number}) {
 const [query,setQuery]=useState('');
 return <div className="discovery-home">
  <section className="discovery-hero">
   <div className="discovery-copy"><div className="discovery-kicker"><span/>经典有出处，理解有路径</div><h1>从一阴一阳，<br/>到<span>清晰的理解。</span></h1><p>读懂八卦与六十四卦的结构，连接数学与 AI 推理。<br className="desktop-break"/>让古老的符号，成为可以观察、比较与验证的知识。</p><div className="discovery-actions"><button className="primary" onClick={()=>onNavigate('原理入门')}>从零开始学 <ArrowRight size={18}/></button><button className="text-btn" onClick={()=>onNavigate('六十四卦与AI推理')}>六十四卦与 AI 推理 <ArrowUpRight size={18}/></button></div><div className="discovery-facts"><span><b>08</b> 基本卦象</span><span><b>64</b> 重卦解析</span><button onClick={()=>onNavigate('资料与出处')}><b>{String(sourceCount).padStart(2,'0')}</b> 本地资料 <ArrowUpRight size={12}/></button></div></div>
   <div className="discovery-diagram"><div className="discovery-diagram-heading"><span>THE LANGUAGE OF CHANGE</span><span>点选一卦，观察其象</span></div>{wheel}<div className="discovery-diagram-footer"><div className="segmented"><button aria-pressed={!order} className={!order?'active':''} onClick={()=>onOrder(false)}>先天八卦</button><button aria-pressed={order} className={order?'active':''} onClick={()=>onOrder(true)}>后天八卦</button></div><span>{selected.name} · {selected.image} · {selected.quality}</span></div></div>
  </section>
  <section className="discovery-lookup" aria-labelledby="lookup-title"><div><span className="discovery-section-index">01 / 随时查阅</span><h2 id="lookup-title">你想读哪一卦？</h2></div><form onSubmit={event=>{event.preventDefault();onFind(query.trim())}}><Search size={20}/><label className="sr-only" htmlFor="home-hexagram-search">搜索六十四卦</label><input id="home-hexagram-search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="卦名、拼音或卦序，如：既济、qian、63"/><button type="submit" aria-label="查找卦象"><ArrowRight size={21}/></button></form><div className="discovery-popular"><span>从这里开始</span>{['乾','泰','既济'].map(name=><button key={name} onClick={()=>onFind(name)}>{name}</button>)}<button onClick={()=>onNavigate('六十四卦')}>全部 64 卦 <ArrowUpRight size={13}/></button></div></section>
  <section className="discovery-paths"><div className="discovery-section-heading"><div><span className="discovery-section-index">02 / 选择你的探索路径</span><h2>从认识符号，到建立联系。</h2></div><span>按好奇心出发，也可以循序学习</span></div><div className="discovery-path-list">{[
   {page:'八卦图鉴' as Page,n:'01',icon:Compass,title:'认识八种自然之象',description:'观察阴阳爻，理解卦象、卦德与自然取象。',meta:'8 个基本符号'},
   {page:'六十四卦' as Page,n:'02',icon:Layers,title:'走进六十四种组合',description:'从上下卦出发，查阅卦辞、大象与入门解释。',meta:'完整卦序与组合表'},
   {page:'八卦与数学' as Page,n:'03',icon:Binary,title:'发现结构背后的数学',description:'亲手验证二进制、组合计数与变爻关系。',meta:'可交互的数学模型'},
   {page:'六十四卦与AI推理' as Page,n:'04',icon:Sparkles,title:'把观察变成好的问题',description:'从64卦情境检查内外条件、证据与验证行动。',meta:'现代类比与离线提纲'},
   {page:'天文与历法' as Page,n:'05',icon:CalendarDays,title:'读懂时辰、节气与历法',description:'从24小时对照到太阳黄经、月相与阴阳合历，核对排盘的时间依据。',meta:'交互示意与节气年表'},
  ].map(path=><button key={path.n} onClick={()=>onNavigate(path.page)}><span className="discovery-path-number">{path.n}</span><path.icon size={24} strokeWidth={1.5}/><div><h3>{path.title}</h3><p>{path.description}</p></div><span className="discovery-path-meta">{path.meta}</span><ArrowUpRight size={20}/></button>)}</div></section>
  <section className="discovery-spotlight"><div className="discovery-selected-gua"><Gua bits={selected.bits} size={68}/><span>{selected.name}</span></div><div><span className="discovery-section-index">刚刚选中的卦 / {selected.pinyin}</span><h2>{selected.name}为{selected.image}，{selected.quality}。</h2><p>{selected.description}</p></div><button onClick={()=>onNavigate('八卦图鉴')} aria-label={`在图鉴中阅读${selected.name}卦`}><BookOpen size={18}/> 读懂这个卦 <ArrowUpRight size={18}/></button></section>
 </div>;
}

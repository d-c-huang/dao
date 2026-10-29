import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, ArrowRight, RotateCcw, Download, Check } from 'lucide-react';
import './style.css';
import { Foundations, DivinationWorkbench } from './TraditionPages';
import { AppShell } from './AppShell';
import { HomePage } from './HomePage';
import {CalendarKnowledgePage} from './CalendarKnowledgePage';
import { SiteSearch } from './SiteSearch';
import { trigrams, early, later, byBits, flipLine, combine, type Bits } from './data';
import { Gua } from './Gua';
import { Mathematics } from './Mathematics';
import { SourceLibrary } from './SourceLibrary';
import { HexagramLibrary } from './HexagramLibrary';
import { AiReasoning } from './AiReasoningPage';
import { hexagramByTrigrams } from './hexagramStructure';
import { sources } from './sources';
import { pages, isPage, pageFromHash, pageHash, type Page } from './navigation';

function App(){
 const [page,setPage]=useState<Page>(()=>pageFromHash(window.location.hash));
 const [selected,setSelected]=useState('乾');
 const [order,setOrder]=useState(false);
 const [bits,setBits]=useState<Bits>([1,1,1]);
 const [lower,setLower]=useState('坤');
 const [upper,setUpper]=useState('乾');
 const [lab,setLab]=useState(0);
 const [quiz,setQuiz]=useState(0);
 const [answer,setAnswer]=useState('');
 const [note,setNote]=useState(()=>{try{return localStorage.getItem('bagua-note')||''}catch{return ''}});
 const [saved,setSaved]=useState(false);
 const [hexagramNumber,setHexagramNumber]=useState(1);
 const [hexagramQuery,setHexagramQuery]=useState('');
 const [sourceId,setSourceId]=useState<string|undefined>();
 const [searchOpen,setSearchOpen]=useState(false);
 useEffect(()=>{
  const restore=()=>{setPage(pageFromHash(window.location.hash));setSourceId(undefined);setHexagramQuery('')};
  const shortcut=(event:KeyboardEvent)=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();setSearchOpen(true)}};
  window.addEventListener('popstate',restore);window.addEventListener('hashchange',restore);document.addEventListener('keydown',shortcut);
  return()=>{window.removeEventListener('popstate',restore);window.removeEventListener('hashchange',restore);document.removeEventListener('keydown',shortcut)};
 },[]);
 useEffect(()=>{document.title=page==='探索首页'?'八象有解 · Eight Trigrams, Explained':page+' · 八象有解'},[page]);
 const go=(next:Page)=>{
  if(next!=='资料与出处')setSourceId(undefined);
  if(next!=='六十四卦')setHexagramQuery('');
  setPage(next);
  if(window.location.hash!==pageHash(next))window.history.pushState(null,'',pageHash(next));
  window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 };
 const navigate=(next:string)=>{if(isPage(next)){setHexagramQuery('');if(next==='六十四卦')setHexagramNumber(1);go(next)}};
 const openHexagram=(number:number)=>{setHexagramNumber(number);setHexagramQuery('');go('六十四卦')};
 const findHexagrams=(query:string)=>{setHexagramNumber(1);setHexagramQuery(query);go('六十四卦')};
 const active=trigrams.find(t=>t.name===selected)!;
 const combinedHexagram=hexagramByTrigrams(lower,upper);
 function download(){const el=document.querySelector('#design-export');if(!el)return;const blob=new Blob([new XMLSerializer().serializeToString(el)],{type:'image/svg+xml;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='八象有解-'+selected+'.svg';a.click();URL.revokeObjectURL(url);}
 const wheel=<div className="wheel" aria-label={order?'后天八卦交互图':'先天八卦交互图'}><div className="wheel-ring ring-two"/><div className="wheel-ring ring-three"/><span className="direction north">南 · 上</span><span className="direction south">北 · 下</span><div className="wheel-axis axis-one"/><div className="wheel-axis axis-two"/><div className="wheel-axis axis-three"/><div className="wheel-axis axis-four"/>{(order?later:early).map((name,i)=>{const t=trigrams.find(t=>t.name===name)!;const a=i*Math.PI/4;return <button key={name} className={`wheel-gua ${selected===name?'selected':''}`} style={{left:`${50+37*Math.sin(a)}%`,top:`${50-37*Math.cos(a)}%`}} onClick={()=>setSelected(name)} aria-pressed={selected===name}><Gua bits={t.bits} size={45}/><span>{name}<small>{t.image}</small></span></button>})}<div className="wheel-center"><div className="taiji"/><span>一阴一阳之谓道</span></div></div>;
 return <AppShell page={page} onNavigate={navigate} onSearch={()=>setSearchOpen(true)}><main>{page==='探索首页'?<HomePage wheel={wheel} selected={active} order={order} onOrder={setOrder} onNavigate={go} onFind={findHexagrams} sourceCount={sources.length}/>:<><div className="page-title"><div className="eyebrow">EIGHT TRIGRAMS / 知识与探索</div><h1>{page==='六十四卦与AI推理'?'六十四卦与 AI 推理':page}</h1><p>{pages.find(entry=>entry.name===page)?.description}</p></div>
 {page==='原理入门'&&<><div className="learn-grid"><section className="panel"><div className="eyebrow">01 / 三爻成卦</div><h2>轻触一爻，观察变化。</h2><p>实线为阳，断线为阴。爻位从下往上数，三个位置共有 2³＝8 种组合。</p><div className="line-editor">{[2,1,0].map(i=><button key={i} onClick={()=>setBits(flipLine(bits,i))} aria-label={`切换${['初','二','三'][i]}爻，当前为${bits[i]?'阳':'阴'}`}><span>{['初爻','二爻','三爻'][i]}</span><div className={`editable-line ${bits[i]?'yang':'yin'}`}><i/><i/></div><small>{bits[i]?'阳':'阴'}</small></button>)}</div><button className="text-btn" onClick={()=>setBits([1,1,1])}><RotateCcw size={15}/> 重置为乾</button></section><section className="panel result-panel"><span className="eyebrow">你组合出的卦象</span><Gua bits={bits} size={104}/><h2>{byBits(bits).name}为{byBits(bits).image}</h2><p>{byBits(bits).description}</p></section></div><section className="panel combine-panel"><div><div className="eyebrow">02 / 两卦相重</div><h2>由八卦，走向六十四卦。</h2><p>下卦三爻与上卦三爻相重，共有 8 × 8＝64 种组合。选择上下卦，查找对应卦名与经典原文。</p><div className="select-row"><label>下卦<select value={lower} onChange={e=>setLower(e.target.value)}>{trigrams.map(t=><option key={t.name}>{t.name}</option>)}</select></label><label>上卦<select value={upper} onChange={e=>setUpper(e.target.value)}>{trigrams.map(t=><option key={t.name}>{t.name}</option>)}</select></label></div></div><div className="combined-result"><Gua bits={combine(trigrams.find(t=>t.name===lower)!.bits,trigrams.find(t=>t.name===upper)!.bits)} size={115}/><span>上{upper} · 下{lower}</span><strong>第 {combinedHexagram.number} 卦 · {combinedHexagram.title}</strong><button className="text-btn" onClick={()=>openHexagram(combinedHexagram.number)}>阅读此卦 <ArrowUpRight size={16}/></button></div></section></>}
 {page==='八卦图鉴'&&<><div className="trigram-tabs">{trigrams.map(t=><button key={t.name} className={selected===t.name?'active':''} onClick={()=>setSelected(t.name)}><Gua bits={t.bits} size={48}/><span>{t.name}<small>{t.image}</small></span></button>)}</div><section className="detail-panel"><div className="detail-mark"><Gua bits={active.bits} size={150}/><h2>{active.name}</h2><span>{active.pinyin} / {active.image.toUpperCase()}</span></div><div><div className="eyebrow">八卦图鉴 / {active.name}卦</div><h2>{active.name}为{active.image}，{active.name}{active.quality}也。</h2><p>{active.description}</p><h3>读懂结构</h3><p>由下至上：{active.bits.map((b,i)=>`${['初爻','二爻','三爻'][i]}为${b?'阳':'阴'}`).join('，')}。图形的爻序与文字阅读方向不同，先从底部观察。</p><h3>试着想一想 <span className="tag">现代延伸</span></h3><p>{active.prompt}</p><button className="text-btn" onClick={()=>go('资料与出处')}>查看《说卦传》来源 <ArrowUpRight size={16}/></button></div></section></>}
 {page==='先后天对照'&&<><div className="compare-grid">{[false,true].map(isLater=><section className="panel comparison" key={String(isLater)}><div className="eyebrow">{isLater?'LATER HEAVEN':'EARLIER HEAVEN'}</div><h2>{isLater?'后天八卦 · 流行与方位':'先天八卦 · 对待与平衡'}</h2><div className="mini-wheel">{(isLater?later:early).map((name,i)=>{const t=trigrams.find(t=>t.name===name)!;return <div key={name} style={{left:`${50+37*Math.sin(i*Math.PI/4)}%`,top:`${50-37*Math.cos(i*Math.PI/4)}%`}}><Gua bits={t.bits} size={39}/><b>{name}</b></div>})}<span className="mini-center">南上<br/>北下</span></div><p>{isLater?'常见后天图以离南坎北、震东兑西组织方位，可联系《说卦传》“帝出乎震”等文字理解。':'常见先天图以乾南坤北、离东坎西排列，呈现相对卦象。今见图式通常与宋代易学传统联系。'}</p></section>)}</div><aside className="note">阅读提示：这里采用传统图式中常见的南上北下视角，左为东、右为西；图式、命名与年代的讨论，应与经传文字分别考察。</aside></>}
 {page==='应用实验室'&&<><div className="lab-tabs">{['卦象小练习','卦象设计工坊','思考记录'].map((x,i)=><button className={lab===i?'active':''} key={x} onClick={()=>setLab(i)}>{x}</button>)}</div>{lab===0?<section className="panel quiz"><div className="eyebrow">认识符号 / 第 {quiz+1} 题</div><h2>你能认出这个卦象吗？</h2><Gua bits={trigrams[quiz%8].bits} size={120}/><div className="quiz-options">{trigrams.map(t=><button className={answer===t.name?'active':''} key={t.name} onClick={()=>setAnswer(t.name)}>{t.name}</button>)}</div><p aria-live="polite">{answer?(answer===trigrams[quiz%8].name?`答对了，${answer}为${trigrams[quiz%8].image}。`:'还差一点，再观察一下每条爻的虚实。'):'从下往上观察，选择对应的卦名。'}</p><button className="primary" onClick={()=>{setQuiz((quiz+1)%8);setAnswer('')}}>下一题 <ArrowRight size={16}/></button></section>:lab===1?<section className="panel design-lab"><div><div className="eyebrow">由符号，到创作</div><h2>一卦一张海报。</h2><p>选择一个卦象，导出可编辑的 SVG。<br/>这是一种现代视觉创作，配色并非传统固定对应。</p><select aria-label="选择海报卦象" value={selected} onChange={e=>setSelected(e.target.value)}>{trigrams.map(t=><option key={t.name}>{t.name}</option>)}</select><button className="primary" onClick={download}>导出 SVG <Download size={16}/></button></div><svg id="design-export" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 520" role="img" aria-label={`${selected}卦海报`}><rect width="400" height="520" fill="#183f35"/><circle cx="200" cy="220" r="142" fill="none" stroke="#829182" strokeWidth="1"/>{[...active.bits].reverse().map((v,i)=><g fill="#eee7d6" key={i}>{v?<rect x="115" y={140+i*49} width="170" height="22"/>:<><rect x="115" y={140+i*49} width="69" height="22"/><rect x="216" y={140+i*49} width="69" height="22"/></>}</g>)}<text x="200" y="390" textAnchor="middle" fill="#eee7d6" fontSize="45" fontFamily="serif">{active.name}为{active.image}</text><text x="200" y="449" textAnchor="middle" fill="#b8c6ba" fontSize="12" letterSpacing="4">EIGHT TRIGRAMS, EXPLAINED</text></svg></section>:<section className="panel"><div className="eyebrow">现代延伸 / 项目策划练习</div><h2>换一个角度，看看你的想法。</h2><p>以“策划一场文化展览”为例，或记录你自己的项目。以下问题是本项目设计的思考提示。</p><div className="prompt-grid">{trigrams.map(t=><button className={selected===t.name?'active':''} key={t.name} onClick={()=>setSelected(t.name)}>{t.name} · {t.quality}</button>)}</div><blockquote>{active.prompt}</blockquote><label className="note-label" htmlFor="reflection">我的思考记录</label><textarea id="reflection" value={note} placeholder="写下你的想法、需要验证的条件与下一步行动……" onChange={e=>{setNote(e.target.value);setSaved(false)}}/><button className="primary" onClick={()=>{try{localStorage.setItem('bagua-note',note);setSaved(true)}catch{setSaved(false);alert('浏览器无法保存，请复制记录到本地。')}}}>{saved?<><Check size={16}/> 已保存到本机浏览器</>:'保存记录'}</button><small className="storage-hint">仅保存在此浏览器，不会同步到其他设备。</small></section>}</>}
 {page==='六十四卦'&&<HexagramLibrary initialQuery={hexagramQuery} initialNumber={hexagramNumber} onSources={id=>{setSourceId(id);go('资料与出处')}}/>}
 {page==='八卦与数学'&&<Mathematics onHexagram={openHexagram} onSources={id=>{setSourceId(id);go('资料与出处')}}/>}
 {page==='六十四卦与AI推理'&&<AiReasoning onSources={id=>{setSourceId(id);go('资料与出处')}}/>}
 {page==='五行与干支'&&<Foundations/>}
 {page==='天文与历法'&&<CalendarKnowledgePage/>}
 {page==='术数工坊'&&<DivinationWorkbench onHexagram={openHexagram} onCalendar={()=>go('天文与历法')}/>}
 {page==='资料与出处'&&<SourceLibrary initialId={sourceId}/>}
</>}</main><SiteSearch open={searchOpen} onClose={()=>setSearchOpen(false)} onPage={go} onHexagram={openHexagram}/></AppShell>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);

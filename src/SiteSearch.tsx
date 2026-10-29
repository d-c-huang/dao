import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, BookOpen, Search, X } from 'lucide-react';
import { hexagrams } from './hexagrams';
import { pages, type Page } from './navigation';

const pageKeywords:Partial<Record<Page,string>>={'天文与历法':'二十八宿 星宿 四象 青龙 白虎 朱雀 玄武 星官 天球 赤道 赤经 赤纬 3D 农事 播种 24时辰 二十四时辰 24节气 二十四节气 阴历 阳历 闰月 朔望月 黄道 黄经 子时 真太阳时 十二时辰 天文历法 工具使用注意事项'};
const normalize=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f\s]/g,'').toLowerCase();

export function SiteSearch({open,onClose,onPage,onHexagram}:{open:boolean;onClose:()=>void;onPage:(page:Page)=>void;onHexagram:(number:number)=>void}) {
 const dialog=useRef<HTMLDialogElement>(null);
 const input=useRef<HTMLInputElement>(null);
 const [query,setQuery]=useState('');
 useEffect(()=>{
  if(open){setQuery('');dialog.current?.showModal();input.current?.focus()}
  else dialog.current?.close();
 },[open]);
 const term=normalize(query);
 const number=query.trim().match(/^(?:第\s*|#\s*)?(\d+)\s*卦?$/);
 const matchedPages=pages.filter(page=>!term||normalize(page.name+page.description+(pageKeywords[page.name]??'')).includes(term))
  .sort((a,b)=>Number(normalize(b.name).includes(term))-Number(normalize(a.name).includes(term)));
 const matchedHexagrams=term?hexagrams.filter(h=>number?h.number===Number(number[1]):normalize([h.name,h.traditionalName,h.title,h.pinyin,...h.keywords].join(' ')).includes(term)):hexagrams.filter(h=>[1,2,11,12,63,64].includes(h.number));
 const choosePage=(page:Page)=>{onClose();onPage(page)};
 const chooseHexagram=(number:number)=>{onClose();onHexagram(number)};
 const pagesFirst=!term||!matchedHexagrams.length||matchedPages.some(page=>normalize(page.name).includes(term));
 const pageResults=matchedPages.length>0&&<section><h3>{term?'相关主题':'学习主题'}</h3>{matchedPages.slice(0,term?5:4).map(page=><button key={page.slug} onClick={()=>choosePage(page.name)}><BookOpen size={18}/><span><b>{page.name}</b><small>{page.description}</small></span><ArrowUpRight size={17}/></button>)}</section>;
 const hexagramResults=matchedHexagrams.length>0&&<section><h3>{term?`相关卦象 · ${matchedHexagrams.length} 卦`:'常用查阅'}</h3>{matchedHexagrams.slice(0,10).map(h=><button key={h.number} onClick={()=>chooseHexagram(h.number)}><span className="site-search-number">{String(h.number).padStart(2,'0')}</span><span><b>{h.title}</b><small>{h.pinyin} · 上{h.upper}下{h.lower}</small></span><ArrowUpRight size={17}/></button>)}</section>;
 return <dialog ref={dialog} className="site-search-dialog" aria-labelledby="site-search-title" onCancel={event=>{event.preventDefault();onClose()}} onClick={event=>{if(event.target===dialog.current)onClose()}}>
  <div className="site-search-content">
   <div className="site-search-heading"><h2 id="site-search-title">搜索知识</h2><button aria-label="关闭搜索" onClick={onClose}><X size={21}/></button></div>
   <form onSubmit={event=>{event.preventDefault();if(pagesFirst&&matchedPages.length)choosePage(matchedPages[0].name);else if(matchedHexagrams.length)chooseHexagram(matchedHexagrams[0].number)}}>
    <label className="site-search-input"><Search size={21}/><input ref={input} type="search" aria-label="搜索页面、卦名或卦序" placeholder="输入卦名、拼音、卦序或学习主题" value={query} onChange={event=>setQuery(event.target.value)}/><kbd>Esc</kbd></label>
   </form>
   <div className="site-search-results" aria-live="polite">
    {pagesFirst?<>{pageResults}{hexagramResults}</>:<>{hexagramResults}{pageResults}</>}
    {!matchedPages.length&&!matchedHexagrams.length&&<p className="site-search-empty">没有匹配的内容。可以试试“既济”“qian”“63”或“AI”。</p>}
   </div>
   <div className="site-search-footnote">搜索本地知识库 <span>Enter 打开首项 · Esc 关闭</span></div>
  </div>
 </dialog>;
}

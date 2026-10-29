import { useEffect, useState } from 'react';
import { ArrowUpRight, BookOpen, Download } from 'lucide-react';
import { sources } from './sources';
import { LocalResourceFiles, ResourceArchiveOverview, useResourceArchive } from './LocalResourceArchive';
import {MethodReferences} from './AdvancedTraditionPanels';
import {CalendarKnowledgeReferences} from './CalendarKnowledgePage';
import './sources.css';
import './reader.css';

const categories=[['all','全部'],['classic','经典原文'],['history','历史资料'],['math','数学解释'],['ai','AI 研究']] as const;

export function SourceLibrary({initialId}:{initialId?:string}) {
 const [category,setCategory]=useState('all');
 const [selectedId,setSelectedId]=useState(initialId??'zhou-yi-64');
 const {manifest,error}=useResourceArchive();
 useEffect(()=>{if(initialId){setCategory('all');setSelectedId(initialId)}},[initialId]);
 const filtered=sources.filter(s=>category==='all'||s.category===category);
 const selected=filtered.find(s=>s.id===selectedId)??filtered[0];
 function downloadSources() {
  const content='# 八象有解 · 资料与出处\n\n本地资料摘编。古籍原文、历史短引与项目释义分别标注。\n\n'+sources.map(s=>`## ${s.title}\n\n- 作者／编者：${s.author}\n- 位置：${s.locator}\n- 来源：${s.url}\n- 查阅日期：${s.accessed}\n- 项目文件：${s.localPath}\n- 文本说明：${s.rights}\n\n### 来源摘录\n\n${s.excerpt}\n\n### 项目释义\n\n${s.summary}\n\n### 用于本项目\n\n${s.usage}\n`).join('\n');
  const url=URL.createObjectURL(new Blob([content],{type:'text/markdown;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download='八象有解-资料与出处.md';a.click();URL.revokeObjectURL(url);
 }
 function chooseSource(id:string) {
  setSelectedId(id);
  if(window.matchMedia('(max-width:700px)').matches)requestAnimationFrame(()=>document.getElementById('source-reading')?.scrollIntoView({block:'start'}));
 }
 return <section className="reference-library">
  <div className="reference-intro"><div><BookOpen size={21}/><span><b>{sources.length} 条资料索引与本地摘录。</b><small>选择资料阅读全文，已归档文件可从下方入口离线打开。</small></span></div><button className="excerpt-download" onClick={downloadSources}>导出资料摘录 <Download size={16}/></button></div>
  <details className="reference-archive-details"><summary>归档情况与全文资源包 · 查看保存范围及下载</summary><ResourceArchiveOverview manifest={manifest} error={error} sourceCount={sources.length}/></details>
  <div className="reference-filters" role="group" aria-label="筛选资料">{categories.map(([id,label])=><button key={id} onClick={()=>setCategory(id)} className={id===category?'active':''} aria-pressed={id===category}>{label}<small>{id==='all'?sources.length:sources.filter(s=>s.category===id).length}</small></button>)}</div>
  <div className="reference-workspace"><div className="reference-catalog" role="group" aria-label="资料目录">{filtered.map(s=><button key={s.id} className={selected?.id===s.id?'selected':''} aria-pressed={selected?.id===s.id} onClick={()=>chooseSource(s.id)}><span>{categories.find(c=>c[0]===s.category)?.[1]}</span><b>{s.title}</b><small>{s.locator}</small></button>)}</div>
   {selected&&<article className="panel source reference-reading" id="source-reading" aria-label={selected.title} key={selected.id}><span className="tag">{categories.find(c=>c[0]===selected.category)?.[1]}</span><h2>{selected.title}</h2><dl className="source-meta"><div><dt>作者／编者</dt><dd>{selected.author}</dd></div><div><dt>原文位置</dt><dd>{selected.locator}</dd></div></dl><LocalResourceFiles manifest={manifest} sourceId={selected.id}/><h3>资料摘录</h3>{selected.excerpt.length>1800?<details className="source-expanded"><summary>展开全部原文与逐卦出处</summary><blockquote className="source-excerpt">{selected.excerpt}</blockquote></details>:<blockquote className="source-excerpt">{selected.excerpt}</blockquote>}<h3>项目释义</h3><p>{selected.summary}</p><h3>用于本项目</h3><p>{selected.usage}</p><a href={selected.url} target="_blank" rel="noreferrer">打开来源核对全文 <ArrowUpRight size={15}/></a><details className="reference-provenance"><summary>版本与保存信息</summary><p>{selected.rights}</p><p>查阅日期：{selected.accessed}</p><p>项目文件：<code>{selected.localPath}</code></p></details></article>}
  </div>
  <MethodReferences/>
  <CalendarKnowledgeReferences/>
 </section>;
}

import { useEffect, useState } from 'react';
import { ArrowUpRight, Download, FileCheck2, FolderArchive } from 'lucide-react';
import { archiveDocuments, formatArchiveBytes, isSafeArchivePath, type ArchiveManifest } from './resourceArchive';
import './resource-archive.css';
import { EmbeddedResourceReader } from './EmbeddedResourceReader';

let manifestRequest:Promise<ArchiveManifest>|null=null;
function requestManifest():Promise<ArchiveManifest> {
 if(!manifestRequest)manifestRequest=fetch('/resources/manifest.json').then(async response=>{
  if(!response.ok)throw new Error('资源清单尚未加载');
  const manifest=await response.json() as ArchiveManifest;
  if(manifest.version!==1||!Array.isArray(manifest.files)||!Array.isArray(manifest.unavailable)||!isSafeArchivePath(manifest.bundlePath)||manifest.files.some(file=>!isSafeArchivePath(file.path)))throw new Error('资源清单不完整');
  return manifest;
 }).catch(error=>{manifestRequest=null;throw error});
 return manifestRequest;
}
export function useResourceArchive() {
 const [manifest,setManifest]=useState<ArchiveManifest|null>(null);
 const [error,setError]=useState('');
 useEffect(()=>{let active=true;requestManifest().then(data=>{if(active)setManifest(data)}).catch(()=>{if(active)setError('全文资源尚未加载，请刷新页面重试。')});return()=>{active=false}},[]);
 return {manifest,error};
}

export function ResourceArchiveOverview({manifest,error,sourceCount}:{manifest:ArchiveManifest|null;error:string;sourceCount:number}) {
 if(!manifest)return <div className="archive-overview archive-loading" role="status">{error||'正在读取本地全文资源清单……'}</div>;
 const originals=manifest.files.filter(file=>file.relation!=='alternative'&&file.format!=='image');
 const archivedSourceIds=new Set(originals.map(file=>file.sourceId));
 const affected=new Set(manifest.unavailable.map(item=>item.sourceId));
 const restricted=new Set(manifest.unavailable.filter(item=>item.status==='restricted').map(item=>item.sourceId));
 const missing=new Set(manifest.unavailable.filter(item=>item.status==='unavailable').map(item=>item.sourceId));
 const complete=[...archivedSourceIds].filter(id=>!affected.has(id)).length;
 const documents=new Set(originals.map(file=>file.documentKey??file.url));
 const size=manifest.files.reduce((sum,file)=>sum+file.bytes,0);
 return <section className="archive-overview" aria-label="本地全文资源包"><div className="archive-overview-copy"><FolderArchive size={25}/><div><h2>原文文件，已保存在项目中。</h2><p>{complete} / {sourceCount} 条来源完整归档 · {documents.size} 篇原文 · {formatArchiveBytes(size)}</p><small>古籍保存完整经传正文；教材、论文保留获准下载的原始文件。{restricted.size>0&&`${restricted.size} 条原件许可受限。`}{missing.size>0&&`${missing.size} 条资料尚有未获取的附件。`}详情见各条资料。</small></div></div><a className="primary" href={manifest.bundlePath} download>下载全文资源包 <Download size={17}/></a></section>;
}

export function LocalResourceFiles({manifest,sourceId}:{manifest:ArchiveManifest|null;sourceId:string}) {
 const documents=manifest?archiveDocuments(manifest.files,sourceId):[];
 const [selectedKey,setSelectedKey]=useState('');
 useEffect(()=>setSelectedKey(''),[sourceId]);
 if(!manifest)return null;
 const unavailable=manifest.unavailable.filter(item=>item.sourceId===sourceId);
 const selected=documents.find(document=>document.key===selectedKey)??documents[0];
 const primary=selected?.files[0];
 return <div className="local-resource-files">
  <div className="local-resource-heading"><FileCheck2 size={18}/><h3>本地全文</h3><span>{documents.some(document=>!document.alternative)?unavailable.length?'正文已保存，附件未齐':'全文已保存':'原件未归档'}</span></div>
  {unavailable.map(item=><p className="archive-restriction" key={item.url}><b>{item.title}：{item.status==='restricted'?'未复制全文。':'未获取。'}</b>{item.reason}</p>)}
  {selected&&primary?<>
   {documents.length>1&&<label className="archive-document-picker">选择要阅读的原文<select aria-label="选择本地全文" value={selected.key} onChange={event=>setSelectedKey(event.target.value)}>{documents.map(document=><option key={document.key} value={document.key}>{document.title}{document.alternative?'（补充阅读）':''}</option>)}</select></label>}
   <div className="local-document-title"><b>{selected.title}</b>{selected.alternative&&<span className="tag">开放许可补充阅读</span>}</div>
   <p className="local-document-scope">{primary.scope}</p>
   {primary.format==='html'&&<EmbeddedResourceReader key={primary.path} path={primary.path} title={selected.title}/>}
   <div className="local-resource-actions"><a href={primary.path} target="_blank" rel="noreferrer">打开本地{primary.format==='pdf'?' PDF':'全文'} <ArrowUpRight size={15}/></a>{selected.files.map(file=><a key={file.id} href={file.path} download>下载 {file.format==='text'?'TXT':file.format.toUpperCase()} <small>{formatArchiveBytes(file.bytes)}</small></a>)}</div>
   <div className="archive-file-meta"><span>{primary.license}</span><span>保存于 {primary.downloadedAt.slice(0,10)}</span></div>
  </>:!unavailable.length&&<p className="local-document-scope">暂无全文文件；下方保留已有摘录和来源链接。</p>}
 </div>;
}

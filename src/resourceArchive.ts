export type ArchiveFormat = 'html'|'markdown'|'pdf'|'text'|'image';
export interface ArchivedFile {
 id:string;
 sourceId:string;
 title:string;
 url:string;
 downloadedAt:string;
 license:string;
 licenseUrl?:string;
 scope:string;
 format:ArchiveFormat;
 path:string;
 bytes:number;
 sha256:string;
 relation?:'original'|'alternative';
 documentKey?:string;
}
export interface ArchiveUnavailable {
 sourceId:string;
 url:string;
 title:string;
 reason:string;
 status:'restricted'|'unavailable';
 license:string;
}
export interface ArchiveManifest {
 version:1;
 generatedAt:string;
 scope:string;
 files:ArchivedFile[];
 unavailable:ArchiveUnavailable[];
 bundlePath:string;
}
export interface ArchiveDocument {key:string;title:string;url:string;files:ArchivedFile[];alternative:boolean}

export function isSafeArchivePath(path:string):boolean {
 try {
  const decoded=decodeURIComponent(path);
  return decoded.startsWith('/resources/')&&!/[\\?#\0]/.test(decoded)&&!decoded.split('/').some(part=>part==='..'||part==='.')&&decoded.length>11;
 } catch{return false}
}
export function archiveDocuments(files:ArchivedFile[],sourceId:string):ArchiveDocument[] {
 const documents=new Map<string,ArchiveDocument>();
 for(const file of files){
  if(file.sourceId!==sourceId||file.format==='image')continue;
  const key=`${file.documentKey??file.url}|${file.relation??'original'}`;
  const entry=documents.get(key)??{key,title:file.title,url:file.url,files:[],alternative:file.relation==='alternative'};
  entry.files.push(file);documents.set(key,entry);
 }
 const priority:Record<ArchiveFormat,number>={html:0,pdf:1,markdown:2,text:3,image:4};
 return [...documents.values()].map(document=>{
  const files=[...document.files].sort((a,b)=>priority[a.format]-priority[b.format]);
  return {...document,title:files[0].title,files};
 });
}
export function formatArchiveBytes(bytes:number) {
 return bytes>=1024*1024?`${(bytes/(1024*1024)).toFixed(1)} MB`:bytes>=1024?`${Math.round(bytes/1024)} KB`:`${bytes} B`;
}

import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { archiveDocuments, isSafeArchivePath, type ArchiveManifest } from '../src/resourceArchive';
import { sources } from '../src/sources';

const publicRoot=resolve(process.cwd(),'public');
const resourcesRoot=resolve(publicRoot,'resources');
const manifest=JSON.parse(readFileSync(resolve(resourcesRoot,'manifest.json'),'utf8')) as ArchiveManifest;
const readAsset=(path:string)=>readFileSync(resolve(publicRoot,path.slice(1)));

describe('本地原文归档与出处完整性',()=>{
 it('每份已列文件真实存在，大小与SHA-256一致，路径限于资源目录',()=>{
  expect(manifest.version).toBe(1);
  expect(new Set(manifest.files.map(file=>file.id)).size).toBe(manifest.files.length);
  expect(manifest.files.length).toBeGreaterThan(130);
  for(const file of manifest.files){
   expect(isSafeArchivePath(file.path),file.path).toBe(true);
   expect(resolve(publicRoot,file.path.slice(1)).startsWith(resourcesRoot+sep)).toBe(true);
   const content=readAsset(file.path);
   expect(content.length,file.path).toBe(file.bytes);
   expect(content.length).toBeGreaterThan(0);
   expect(createHash('sha256').update(content).digest('hex'),file.path).toBe(file.sha256);
   expect(file.license.trim(),file.path).not.toBe('');
  }
 });
 it('十条来源均有归档或明确的缺失原因，替代教材不冒充Berkeley原件',()=>{
  for(const source of sources){
   expect(manifest.files.some(file=>file.sourceId===source.id)||manifest.unavailable.some(item=>item.sourceId===source.id),source.id).toBe(true);
  }
  for(const item of manifest.unavailable)expect(item.reason.trim()).not.toBe('');
  expect(manifest.unavailable.find(item=>item.sourceId==='ai-reasoning')?.status).toBe('restricted');
  expect(manifest.unavailable.find(item=>item.sourceId==='hypercube')?.status).toBe('restricted');
  const alternative=manifest.files.find(file=>file.sourceId==='hypercube');
  expect(alternative?.relation).toBe('alternative');
  expect(alternative?.url).toContain('ocw.mit.edu');
 });
 it('六十四卦均有全文HTML与文本，正文包含初爻和上爻',()=>{
  const documents=archiveDocuments(manifest.files,'zhou-yi-64');
  expect(documents.length).toBeGreaterThanOrEqual(65);
  const hexagramPages=documents.filter(document=>document.files.some(file=>file.format==='html')&&document.files.some(file=>file.format==='text'));
  let completeHexagrams=0;
  for(const document of hexagramPages){
   const text=readAsset(document.files.find(file=>file.format==='text')!.path).toString('utf8');
   if(/初[六九]/.test(text)&&/上[六九]/.test(text))completeHexagrams++;
  }
  expect(completeHexagrams).toBeGreaterThanOrEqual(64);
  for(const id of ['shuo-gua','xi-ci-shang','xi-ci-xia']){
   expect(archiveDocuments(manifest.files,id).some(document=>document.files.some(file=>file.format==='html')&&document.files.some(file=>file.format==='text')),id).toBe(true);
  }
 });
 it('本地HTML无远程脚本或自动加载的网络资源，PDF是实际原始文件',()=>{
  for(const file of manifest.files){
   const content=readAsset(file.path);
   if(file.format==='html'){
    const html=content.toString('utf8');
    expect(html,file.path).not.toMatch(/<script\b/i);
    expect(html,file.path).not.toMatch(/\b(?:src|srcset)\s*=\s*["']\s*(?:https?:)?\/\//i);
    expect(html,file.path).toMatch(/<title[\s>]/i);
   }
   if(file.format==='pdf')expect(content.subarray(0,5).toString()).toBe('%PDF-');
  }
 });
 it('全文包为有效ZIP并包含归档清单和实际资源条目',()=>{
  const zip=readAsset(manifest.bundlePath);
  expect(zip.subarray(0,2).toString()).toBe('PK');
  const end=zip.lastIndexOf(Buffer.from([0x50,0x4b,0x05,0x06]));
  expect(end).toBeGreaterThan(0);
  expect(zip.readUInt16LE(end+10)).toBeGreaterThanOrEqual(manifest.files.length);
  expect(zip.includes(Buffer.from('manifest.json'))).toBe(true);
 });
 it('拒绝目录逃逸，并将同一篇HTML与TXT合并为一个阅读项',()=>{
  for(const path of ['/resources/../secret','/resources/%2e%2e/secret','https://example.com/a','/resources/foo\\bar','/resources/a?remote=1'])expect(isSafeArchivePath(path)).toBe(false);
  const source=manifest.files.find(file=>file.sourceId==='shuo-gua')!;
  const documents=archiveDocuments(manifest.files,'shuo-gua');
  expect(documents).toHaveLength(1);
  expect(documents[0].files.length).toBeGreaterThanOrEqual(2);
  expect(documents[0].files[0].format).toBe('html');
  expect(documents[0].url).toBe(source.url);
 });
});

import {it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
it('术数五篇原典的十份副本与独立清单、哈希一致',()=>{
  const records=JSON.parse(readFileSync('public/resources/methods/manifest.json','utf8'));
  expect(records).toHaveLength(10);
  for(const r of records){
    const bytes=readFileSync('public'+r.path);
    expect(bytes.length).toBe(r.bytes);
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(r.sha256);
    expect(bytes.toString('utf8')).toContain(r.revisionUrl);
    expect(r.revisionId).toBeGreaterThan(0);
    expect(r.license).toContain('CC BY-SA');
    if(r.format==='html'){expect(bytes.toString('utf8')).not.toMatch(/<script[\s>]/i);expect(bytes.toString('utf8')).toContain('/resources/methods/rules.html')}
  }
});
it('项目规则阅读副本与文档同步，保留手动盘位和版本选择说明',()=>{
  const source=readFileSync('docs/traditional-methods.md','utf8');
  expect(readFileSync('public/resources/methods/rules.md','utf8')).toBe(source);
  const html=readFileSync('public/resources/methods/rules.html','utf8');
  for(const phrase of ['纳甲表','九宗门三传','涉害','主客算','同宫','720','阴阳遁','手动','网上原出处'])expect(html).toContain(phrase);
});

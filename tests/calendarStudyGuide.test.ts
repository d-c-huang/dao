import {it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
it('离线知识整理与同源数据同步，全部节气、章节和注意事项可查阅',()=>{
  const data=JSON.parse(readFileSync('src/calendar-knowledge.json','utf8'));
  const md=readFileSync('docs/calendar-and-astronomy.md','utf8'),html=readFileSync('public/resources/calendar/guide.html','utf8');
  expect(readFileSync('public/resources/calendar/guide.md','utf8')).toBe(md);
  for(const p of data.precautions){expect(md).toContain(p.title);expect(html).toContain(p.title)}
  for(const t of data.terms){expect(md).toContain(t.meaning);expect(html).toContain(t.note)}
  for(const c of data.chapters){expect(md).toContain(c.title);expect(html).toContain(c.title);for(const p of c.paragraphs)expect(md).toContain(p)}
  for(const s of data.sources)expect(md).toContain(s.url);
  expect(html).not.toMatch(/<script[\s>]/i);expect(md).toContain('项目原创知识整理');
  for(const t of data.terms){expect(md).toContain(t.farming.north);expect(html).toContain(t.farming.south);expect(md).toContain(t.farming.risk)}
  const sky=JSON.parse(readFileSync('src/star-knowledge.json','utf8'));
  expect(JSON.parse(readFileSync('public/resources/calendar/star-data.json','utf8'))).toEqual(sky);
  for(const m of sky.mansions){expect(md).toContain(m.name+'宿');expect(html).toContain(m.meaning)}
  expect(readFileSync('public/licenses/star-data.txt','utf8')).toContain('CC BY-SA 4.0');
});

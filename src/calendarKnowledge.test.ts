import {describe,it,expect} from 'vitest';
import {calendarKnowledge,solarTerms,hours24,branchForClock,isGregorianLeapYear,annualSolarTerms} from './calendarKnowledge';
import {pages,pageFromHash,pageHash} from './navigation';

describe('时辰、节气、天文与历法知识',()=>{
  it('24小时恰好对应12支各2小时，午夜两侧不混淆',()=>{
    expect(hours24).toHaveLength(24);
    for(const b of '子丑寅卯辰巳午未申酉戌亥')expect(hours24.filter(h=>h.branch===b)).toHaveLength(2);
    expect(branchForClock('23:00')).toMatchObject({branch:'子',half:'前半'});
    expect(branchForClock('00:59')).toMatchObject({branch:'子',half:'后半'});
    expect(branchForClock('01:00').branch).toBe('丑');expect(branchForClock('22:59').branch).toBe('亥');
    for(const invalid of ['', '24:00','12:60','2:00'])expect(()=>branchForClock(invalid)).toThrow();
  });
  it('节气黄经24等分、十二节与十二中气交替，月将关联不混用节令月支',()=>{
    expect(solarTerms).toHaveLength(24);expect(new Set(solarTerms.map(t=>t.name)).size).toBe(24);
    expect(new Set(solarTerms.map(t=>t.longitude)).size).toBe(24);
    expect(solarTerms.filter(t=>t.kind==='节')).toHaveLength(12);expect(solarTerms.filter(t=>t.kind==='中气')).toHaveLength(12);
    solarTerms.forEach((t,i)=>expect((solarTerms[(i+1)%24].longitude-t.longitude+360)%360).toBe(15));
    expect(solarTerms.find(t=>t.name==='立春')).toMatchObject({longitude:315,kind:'节',branch:'寅'});
    expect(solarTerms.find(t=>t.name==='雨水')).toMatchObject({longitude:330,kind:'中气',branch:'亥'});
    expect(solarTerms.find(t=>t.name==='霜降')).toMatchObject({longitude:210,branch:'卯'});
  });
  it('按公历年筛选别名，跨年冬至不能取到上一年',async()=>{
    for(const year of [1901,2000,2025,2026,2100]){
      const rows=await annualSolarTerms(year);expect(rows).toHaveLength(24);
      expect(rows.every(t=>t.at.startsWith(year+'-'))).toBe(true);
      expect(rows.map(t=>t.at)).toEqual(rows.map(t=>t.at).sort());
      expect(rows.at(-1)).toMatchObject({name:'冬至'});expect(rows[0]).toMatchObject({name:'小寒'});
    }
  });
  it('2026年寒露对照天文历表的14:29，霜降与工坊中气换将保持一致',async()=>{
    const rows=await annualSolarTerms(2026);
    expect(rows.find(t=>t.name==='寒露')?.at).toMatch(/^2026-10-08 14:29:/);
    expect(rows.find(t=>t.name==='霜降')?.at).toBe('2026-10-23 17:37:57');
    await expect(annualSolarTerms(NaN)).rejects.toThrow();await expect(annualSolarTerms(2101)).rejects.toThrow();
  });
  it('公历世纪闰年例外正确',()=>{
    expect(isGregorianLeapYear(2000)).toBe(true);expect(isGregorianLeapYear(2024)).toBe(true);
    expect(isGregorianLeapYear(1900)).toBe(false);expect(isGregorianLeapYear(2100)).toBe(false);
    expect(()=>isGregorianLeapYear(0)).toThrow();expect(()=>isGregorianLeapYear(2026.5)).toThrow();
  });
  it('各篇有可追溯出处，知识、工具须知及导航完整',()=>{
    const ids=new Set(calendarKnowledge.sources.map(s=>s.id));
    expect(calendarKnowledge.chapters.length).toBeGreaterThanOrEqual(14);
    expect(calendarKnowledge.precautions).toHaveLength(6);
    for(const c of calendarKnowledge.chapters){expect(c.paragraphs.length).toBeGreaterThanOrEqual(3);for(const s of c.sources)expect(ids.has(s)).toBe(true)}
    expect(pages.some(p=>p.name==='天文与历法')).toBe(true);expect(pageFromHash('#calendar')).toBe('天文与历法');expect(pageHash('天文与历法')).toBe('#calendar');
  });
});

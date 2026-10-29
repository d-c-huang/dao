import {afterEach,describe,it,expect,vi} from 'vitest';
import {calendarAt,timeFieldsMatch,snapshotSummary} from './traditionTime';

afterEach(()=>vi.useRealTimers());
describe('当前时间转术数参数 · 北京时间',()=>{
  it('2026-10-29 对照香港天文台日期表为九月二十，丙午年',async()=>{
    const s=await calendarAt(new Date('2026-10-29T13:30:00Z'));
    expect(s.solar).toBe('2026-10-29 21:30:00');
    expect(s).toMatchObject({month:9,day:20,yearBranch:6,hourBranch:11,dayGanZhi:'丙子',general:3,leapMonth:false});
    expect(s.previousQi.name).toBe('霜降');expect(snapshotSummary(s)).toContain('亥时');
  });
  it('正月初一换年，区别于立春和公历元旦',async()=>{
    const before=await calendarAt(new Date('2026-02-16T23:59:59+08:00'));
    const after=await calendarAt(new Date('2026-02-17T00:00:00+08:00'));
    expect(before.yearBranch).toBe(5);expect(after.yearBranch).toBe(6);
    expect(after).toMatchObject({month:1,day:1,hourBranch:0});
    expect((await calendarAt(new Date('2026-01-01T12:00:00+08:00'))).yearBranch).toBe(5);
  });
  it('23时为子时但不提前换日；00时才切换日干支和农历日',async()=>{
    const a=await calendarAt(new Date('2026-10-29T22:59:59+08:00'));
    const b=await calendarAt(new Date('2026-10-29T23:00:00+08:00'));
    const c=await calendarAt(new Date('2026-10-30T00:00:00+08:00'));
    expect(a.hourBranch).toBe(11);expect(b.hourBranch).toBe(0);expect(c.hourBranch).toBe(0);
    expect(b.dayIndex).toBe(a.dayIndex);expect(b.day).toBe(a.day);
    expect(c.dayIndex).toBe((b.dayIndex+1)%60);expect(c.day).toBe(21);
    expect((await calendarAt(new Date('2026-10-30T01:00:00+08:00'))).hourBranch).toBe(1);
  });
  it('月将按中气实际时刻切换，同一天交接前后用不同月将',async()=>{
    const before=await calendarAt(new Date('2026-10-23T17:37:56+08:00'));
    const after=await calendarAt(new Date('2026-10-23T17:37:57+08:00'));
    expect(before.previousQi.name).toBe('秋分');expect(before.general).toBe(4);
    expect(after.previousQi.name).toBe('霜降');expect(after.general).toBe(3);
  });
  it('跨年取上一中气，冬至后丑将、大寒后子将',async()=>{
    expect((await calendarAt(new Date('2026-01-01T12:00:00+08:00'))).general).toBe(1);
    expect((await calendarAt(new Date('2026-02-01T12:00:00+08:00'))).general).toBe(0);
  });
  it('闰六月按六月填入，并在时间记录中保留闰月标记',async()=>{
    const s=await calendarAt(new Date('2025-07-25T12:00:00+08:00'));
    expect(s).toMatchObject({month:6,day:1,leapMonth:true});expect(s.lunarLabel).toContain('闰六');
  });
  it('同一瞬间的输入时区写法不同，换算一致；默认读取点击时的设备时钟',async()=>{
    const a=await calendarAt(new Date('2026-10-29T00:30:00+08:00'));
    const b=await calendarAt(new Date('2026-10-28T16:30:00Z'));
    expect(a).toEqual(b);
    vi.useFakeTimers();vi.setSystemTime(new Date('2026-10-29T13:30:00Z'));
    expect((await calendarAt()).solar).toBe('2026-10-29 21:30:00');
  });
  it('手动调整后不把旧快照当作当前演算参数；六爻和太乙只记录时间',async()=>{
    const s=await calendarAt(new Date('2026-10-29T13:30:00Z'));
    const fields={month:s.month,day:s.day,year:s.yearBranch,hour:s.hourBranch,dateIndex:s.dayIndex,general:s.general};
    expect(timeFieldsMatch(s,1,fields)).toBe(true);
    expect(timeFieldsMatch(s,1,{...fields,day:1})).toBe(false);
    expect(timeFieldsMatch(s,3,{...fields,general:0})).toBe(false);
    expect(timeFieldsMatch(s,2,{...fields,day:1})).toBe(true);
    expect(timeFieldsMatch(s,4,{...fields,day:1})).toBe(true);
    expect(JSON.parse(JSON.stringify(s))).toEqual(s);
  });
  it('无效设备日期清楚报错，不生成错误盘面',async()=>{
    await expect(calendarAt(new Date('invalid'))).rejects.toThrow('有效时间');
    await expect(calendarAt(new Date('1800-01-01T00:00:00Z'))).rejects.toThrow('1901—2100');
  });
});

import {describe,it,expect} from 'vitest';
import {eightPalaces,sixYao,liurenTransmissions,taiyiCounts} from './advancedTradition';
import {cycle,branches} from './tradition';
import {hexagrams} from './hexagrams';
import {hexagramBits} from './hexagramStructure';

describe('八宫纳甲六亲世应',()=>{
  it('八宫各八卦，唯一覆盖六十四卦；世应相隔三爻',()=>{
    expect(new Set(eightPalaces.map(p=>p.number)).size).toBe(64);
    for(const p of eightPalaces){expect((p.shi+2)%6+1).toBe(p.ying);expect(p.shi).not.toBe(p.ying)}
    expect(eightPalaces.filter(p=>p.palace==='乾').map(p=>p.number)).toEqual([1,44,33,12,20,23,35,14]);
    for(const h of hexagrams)expect(sixYao(hexagramBits(h).map(b=>b?7:8)).base).toHaveLength(6);
  });
  it('乾卦与古书装卦例相符',()=>{
    const r=sixYao([7,7,7,7,7,7]);
    expect(r.palace).toMatchObject({palace:'乾',element:'金',shi:6,ying:3});
    expect(r.base.map(l=>l.ganZhi)).toEqual(['甲子','甲寅','甲辰','壬午','壬申','壬戌']);
    expect(r.base.map(l=>l.relative)).toEqual(['子孙','妻财','父母','官鬼','兄弟','父母']);
  });
  it('坤纳乙癸，变卦六亲以本卦宫金为参照',()=>{
    const r=sixYao([9,9,9,9,9,9]);
    expect(r.changed.map(l=>l.ganZhi)).toEqual(['乙未','乙巳','乙卯','癸丑','癸亥','癸酉']);
    expect(r.changed.map(l=>l.relative)).toEqual(['父母','官鬼','妻财','父母','子孙','兄弟']);
    expect(eightPalaces.find(p=>p.number===35)).toMatchObject({stage:'游魂',shi:4,ying:1});
    expect(eightPalaces.find(p=>p.number===14)).toMatchObject({stage:'归魂',shi:3,ying:6});
  });
});

describe('九宗门三传 · 六壬大全卷七古例',()=>{
  const examples:[string,string,string,string[],string][]=[
    ['甲子','子','卯',['午','卯','子'],'元首'],
    ['丁丑','申','子',['巳','丑','酉'],'元首'],
    ['丁卯','亥','丑',['亥','酉','未'],'涉害'],
    ['庚子','申','戌',['午','辰','寅'],'涉害'],
    ['甲午','午','辰',['辰','午','申'],'涉害'],
    ['壬辰','辰','巳',['戌','酉','申'],'比用'],
    ['壬辰','申','巳',['戌','丑','辰'],'遥克'],
    ['壬申','亥','申',['巳','申','亥'],'遥克'],
    ['戊申','辰','卯',['戌','酉','午'],'昴星'],
    ['丁丑','丑','辰',['子','辰','戌'],'昴星'],
    ['丙辰','辰','卯',['亥','午','午'],'别责'],
    ['甲寅','丑','辰',['丑','亥','亥'],'八专'],
    ['己未','酉','未',['酉','酉','酉'],'八专'],
    ['癸丑','午','午',['丑','戌','未'],'伏吟'],
    ['乙亥','午','午',['辰','亥','巳'],'伏吟'],
    ['丁卯','午','午',['卯','子','午'],'伏吟'],
    ['辛丑','亥','巳',['亥','未','辰'],'返吟'],
  ];
  for(const [date,g,h,triple,method] of examples)it(`${date}日 ${g}将${h}时`,()=>{
    const r=liurenTransmissions(cycle.indexOf(date),branches.indexOf(g),branches.indexOf(h));
    expect(r.transmissions).toEqual(triple);expect(r.method).toContain(method);
  });
  it('720课全部能给出合法三传及可复核步骤',()=>{
    const methods=new Set<string>();
    for(let d=0;d<60;d++)for(let shift=0;shift<12;shift++){
      const r=liurenTransmissions(d,shift,0);methods.add(r.method.split(' · ')[0]);
      expect(r.transmissions).toHaveLength(3);expect(r.transmissions.every(b=>branches.includes(b))).toBe(true);expect(r.trace.length).toBeGreaterThan(1);
    }
    expect([...methods]).toEqual(expect.arrayContaining(['贼克','比用','涉害','遥克','昴星','别责','八专','伏吟','返吟']));
  });
});

describe('太乙主客算 · 太乙秘书阳局',()=>{
  it('一局武德7、大武13；三局阴主1、大义40',()=>{
    let r=taiyiCounts(1,11,10);expect(r.hostCount.total).toBe(7);expect(r.guestCount.total).toBe(13);
    expect(r.hostCount.general).toBe(7);expect(r.hostCount.assistant).toBe(1);
    r=taiyiCounts(1,13,15);expect(r.hostCount.total).toBe(1);expect(r.guestCount.total).toBe(40);expect(r.guestCount.general).toBe(4);
  });
  it('四局阴德25、阳德17；九局和德同宫3、太簇15',()=>{
    let r=taiyiCounts(2,14,1);expect(r.hostCount.total).toBe(25);expect(r.guestCount.total).toBe(17);expect(r.hostCount.general).toBe(5);expect(r.hostCount.assistant).toBe(5);
    r=taiyiCounts(3,2,12);expect(r.hostCount.total).toBe(3);expect(r.hostCount.samePalace).toBe(true);expect(r.guestCount.total).toBe(15);
  });
  it('初始间神计一、途中间神不加；排除中五与非法索引',()=>{
    expect(taiyiCounts(1,11,10).hostCount.steps.map(s=>s.value)).toEqual([1,6]);
    expect(()=>taiyiCounts(5,0,0)).toThrow();expect(()=>taiyiCounts(1,16,0)).toThrow();expect(()=>taiyiCounts(1,NaN,0)).toThrow();
  });
});

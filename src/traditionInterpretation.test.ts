import {describe,it,expect} from 'vitest';
import {explainSmallLiuren,explainPlum,explainSixYao,explainLiuren,explainTaiyi,interpretationTopics} from './traditionInterpretation';
import {smallLiuren,plumBlossom,branches,cycle} from './tradition';
import {sixYao,liurenTransmissions,taiyiCounts} from './advancedTradition';
import {hexagrams} from './hexagrams';
import {hexagramBits} from './hexagramStructure';

describe('随盘生成的结果解说',()=>{
  it('小六壬以最终时宫为主，六宫释义随输入变化且不将三宫作时间线',()=>{
    const first=explainSmallLiuren(smallLiuren(3,5,5));
    expect(first.headline).toContain('小吉');expect(first.signals.map(s=>s.value)).toEqual(['速喜','大安','小吉']);
    const changed=explainSmallLiuren(smallLiuren(3,5,6));
    expect(changed.headline).toContain('空亡');expect(changed.suggestions).not.toEqual(first.suggestions);
    expect(first.limits.join('')).toContain('过去、现在和未来');
    expect(new Set(Array.from({length:6},(_,i)=>explainSmallLiuren(smallLiuren(1,1,i+1)).headline)).size).toBe(6);
    expect(()=>explainSmallLiuren(['未知'])).toThrow();
  });
  it('梅花革之咸例：离火克兑金为用克体；变艮土生兑金为用生体',()=>{
    const r=plumBlossom(5,12,17,9),explanation=explainPlum(r);
    expect(explanation.headline).toBe('革之咸：用克体');
    expect(explanation.signals.find(s=>s.label==='变后体用')?.value).toBe('艮土 · 用生体');
    expect(explanation.summary).toContain('第1爻动');
  });
  it('六爻按真实世应解释方向，静卦不编造变爻',()=>{
    const r=explainSixYao(sixYao([7,7,7,7,7,7]),'合作关系');
    expect(r.signals.find(s=>s.label==='世应生克')?.value).toBe('世土 → 应土 · 比和');
    expect(r.signals.some(s=>s.label.startsWith('动爻'))).toBe(false);
    expect(r.signals.find(s=>s.label==='动静')?.meaning).toContain('不表示现实事情不会变化');
  });
  it('六爻动爻逐爻解释，不以本宫作世应生克的参照',()=>{
    const cast=sixYao([7,7,7,7,9,7]),r=explainSixYao(cast);
    expect(r.signals.filter(s=>s.label.startsWith('动爻'))).toHaveLength(1);
    expect(r.signals.find(s=>s.label==='动爻 · 五爻')?.meaning).toContain('回头生');
    expect(r.signals.find(s=>s.label==='世应生克')?.value).toContain('世土');
  });
  it('主题改变用神候选；明爻未现不误报为现实资源不存在',()=>{
    const cast=sixYao([7,7,7,7,7,7]);
    const work=explainSixYao(cast,'工作学业'),money=explainSixYao(cast,'资源财物');
    expect(work.signals.find(s=>s.label.startsWith('主题'))?.value).toContain('四爻官鬼');
    expect(money.signals.find(s=>s.label.startsWith('主题'))?.value).toBe('二爻妻财');
    const missing=hexagrams.map(h=>sixYao(hexagramBits(h).map(b=>b?7:8))).find(r=>!r.base.some(l=>l.relative==='妻财'))!;
    const signal=explainSixYao(missing,'资源财物').signals.find(s=>s.label.startsWith('主题'))!;
    expect(signal.value).toContain('未现妻财明爻');expect(signal.meaning).toContain('不能解作现实中没有机会或资源');
  });
  it('六壬按日干读三传，标记旬空；返吟优先识别为返吟课义',()=>{
    const d=cycle.indexOf('甲子'),chart=liurenTransmissions(d,0,3),r=explainLiuren(chart,d);
    expect(r.signals.find(s=>s.label==='初传 · 发端线索')?.value).toBe('午火 · 日干生传神');
    expect(r.signals.find(s=>s.label==='三传衔接 · 初到中')?.meaning).toContain('后传木生前传火');
    const returning=explainLiuren(liurenTransmissions(cycle.indexOf('辛丑'),11,5),cycle.indexOf('辛丑'));
    expect(returning.summary).toContain('往来反复');
    const empty=explainLiuren({...chart,transmissions:['戌','亥','子']},d);
    expect(empty.signals.find(s=>s.label==='初传 · 发端线索')?.meaning).toContain('戌落旬空');
  });
  it('720课的解说覆盖所有取课分支，三传与日干的关系均有文本',()=>{
    for(let d=0;d<60;d++)for(let shift=0;shift<12;shift++){
      const r=explainLiuren(liurenTransmissions(d,shift,0),d);
      expect(r.signals).toHaveLength(6);expect(JSON.stringify(r)).not.toContain('undefined');
    }
    expect(()=>explainLiuren(liurenTransmissions(0,0,3),NaN)).toThrow();
  });
  it('太乙不能仅按长短定胜负，杜塞、囚、掩均按当前盘位识别',()=>{
    const first=explainTaiyi(taiyiCounts(1,11,10));
    expect(first.headline).toBe('客算长于主算：7 对 13');
    expect(first.signals[0].meaning).toContain('不能仅凭算数判胜负');
    const blocked=explainTaiyi(taiyiCounts(2,14,1));
    expect(blocked.signals.find(s=>s.label==='主算条件')?.value).toBe('八门杜塞');
    expect(explainTaiyi(taiyiCounts(3,2,2)).signals.map(s=>s.value)).toEqual(expect.arrayContaining(['文昌同宫 · 囚','始击同宫 · 掩']));
    expect(explainTaiyi(taiyiCounts(1,11,11)).headline).toBe('主客算相等：7 对 7');
  });
  it('五种解说均可按主题导出，含出处与规则版本且不修改原盘',()=>{
    const cast=sixYao([9,7,8,6,7,8]),snapshot=JSON.stringify(cast);
    for(const topic of interpretationTopics){
      const results=[explainSmallLiuren(['大安','留连','赤口'],topic),explainPlum(plumBlossom(5,12,17,9),topic),explainSixYao(cast,topic),explainLiuren(liurenTransmissions(0,0,3),0,topic),explainTaiyi(taiyiCounts(1,11,10),topic)];
      for(const r of results){
        expect(r.topic).toBe(topic);expect(r.version).toBe('traditional-reading-v2');expect(r.sources.length).toBeGreaterThan(0);
        expect(JSON.parse(JSON.stringify(r))).toEqual(r);expect(r.summary).not.toMatch(/undefined|NaN/);
      }
    }
    expect(JSON.stringify(cast)).toBe(snapshot);expect(branches).toHaveLength(12);
  });
});

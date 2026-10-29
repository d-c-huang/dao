import {describe,it,expect} from 'vitest';
import {resolveQuestion,interpretQuestion} from './questionReading';
import {explainPlum,explainSixYao,explainSmallLiuren,explainTaiyi} from './traditionInterpretation';
import {plumBlossom} from './tradition';
import {sixYao,taiyiCounts} from './advancedTradition';

describe('问题选择对应的传统解读规则',()=>{
  it('截图问题自动归为天气，并识别繁体与其他具体问题',()=>{
    expect(resolveQuestion('明天是否有大太阳')).toMatchObject({topic:'天时天气',mode:'keyword'});
    expect(resolveQuestion('明天會下雨嗎')).toMatchObject({topic:'天时天气'});
    expect(resolveQuestion('这次考试能通过吗')).toMatchObject({topic:'工作学业',focus:'考试与录取'});
    expect(resolveQuestion('月底能收到货款吗')).toMatchObject({topic:'资源财物',focus:'款项与凭据'});
    expect(resolveQuestion('这次能否签约合作')).toMatchObject({topic:'合作关系'});
  });
  it('太阳能项目、雨水节气等词不被当作天气问题',()=>{
    expect(resolveQuestion('太阳能项目能完成吗').topic).toBe('计划推进');
    expect(resolveQuestion('有太阳能项目可以合作吗').topic).toBe('合作关系');
    expect(resolveQuestion('雨水节气之后签合同好吗').topic).toBe('合作关系');
  });
  it('尊重手动选择，多主题及未知问题给出明确说明',()=>{
    const manual=resolveQuestion('明天是否下雨','计划推进');
    expect(manual.topic).toBe('计划推进');expect(manual.note).toContain('可能不一致');
    expect(resolveQuestion('下雨会影响项目推进吗').note).toContain('多个主题');
    expect(resolveQuestion('会怎么样呢').mode).toBe('fallback');
    expect(resolveQuestion('会怎么样呢').note).toContain('通用盘面');
  });
});

describe('梅花天时解读 · 截图回归',()=>{
  const cast=plumBlossom(7,9,20,12); // 豫之晋，第六爻动，互蹇。
  it('同一盘问天气与问人事采用不同规则，不改动原盘',()=>{
    const before=JSON.stringify(cast);
    expect(cast.base.number).toBe(16);expect(cast.mutual.number).toBe(39);expect(cast.transformed.number).toBe(35);
    const weather=explainPlum(cast,'天时天气','明天是否有大太阳');
    const general=explainPlum(cast,'综合观察');
    expect(general.headline).toContain('用克体');
    expect(weather.headline).toBe('豫之晋：晴雨意象并见');
    expect(weather.response?.text).toContain('不能把“有大太阳”直断为明确肯定');
    expect(weather.signals.map(s=>s.value)).toEqual(['雷地豫','水山蹇','火地晋','不分体用 · 全观诸卦']);
    expect(weather.summary).toContain('坎（雨、水湿）');expect(weather.summary).toContain('离（日光、晴）');
    expect(weather.signals.some(s=>s.label.includes('体用'))).toBe(false);
    expect(weather.sources[0].locator).toContain('天时占第一');
    expect(JSON.stringify(cast)).toBe(before);
  });
  it('晴雨混杂、仅云与仅晴分别表述，不用重复次数制造概率',()=>{
    const bright={...cast,base:{...cast.base,lower:'乾',upper:'离'},mutual:{...cast.mutual,lower:'离',upper:'乾'},transformed:{...cast.transformed,lower:'乾',upper:'离'}};
    const r=explainPlum(bright,'天时天气','明天晴不晴');
    expect(r.headline).toContain('见晴明意象');expect(r.response?.text).toContain('不能进一步确认');
    const cloud={...bright,base:{...bright.base,lower:'坤',upper:'兑'},mutual:{...bright.mutual,lower:'坤',upper:'兑'},transformed:{...bright.transformed,lower:'坤',upper:'兑'}};
    expect(explainPlum(cloud,'天时天气','有太阳吗').headline).toContain('见阴雨或云气');
    const mixed={...bright,base:{...bright.base,lower:'坤'}};
    expect(explainPlum(mixed,'天时天气','会不会下雨').headline).toContain('晴明与云气并见');
    expect(r.signals.at(-1)?.meaning).toContain('不能用出现次数换算概率');
  });
  it('温度、风力问题不伪造气象数值、台风路径或预警',()=>{
    expect(explainPlum(cast,'天时天气','明天气温几度').response?.text).toContain('不能回答具体几度');
    expect(explainPlum(cast,'天时天气','明天风力几级').response?.text).toContain('不能据此排除实际大风');
  });
  it('未实现天气断法的工具说明边界，提供切换梅花入口',()=>{
    const route=resolveQuestion('明天是否有大太阳');
    for(const [tool,base] of [[0,explainSmallLiuren(['大安','大安','大安'])],[2,explainSixYao(sixYao([7,7,7,7,7,7]))],[4,explainTaiyi(taiyiCounts(1,11,10))]] as const){
      const r=interpretQuestion(base,route,tool);
      expect(r.response?.kind).toBe('unsupported-weather');expect(r.response?.action?.tool).toBe(1);
      expect(r.signals).toHaveLength(1);expect(r.suggestions.join('')).not.toContain('合作');
    }
  });
  it('其他主题给出面向所问内容的回应，未知问题不假装已理解',()=>{
    const route=resolveQuestion('这次考试能通过吗');
    const r=interpretQuestion(explainPlum(cast,route.topic),route,1);
    expect(r.response?.label).toContain('考试与录取');expect(r.response?.text).toContain('外部约束');
    const unknown=interpretQuestion(explainPlum(cast),resolveQuestion('后来呢'),1);
    expect(unknown.response).toBeUndefined();expect(unknown.routingNote).toContain('通用盘面');
  });
  it('导出保留选择方式、识别依据、实际主题和针对性回应',()=>{
    const route=resolveQuestion('明天是否有大太阳');
    const r=interpretQuestion(explainPlum(cast,route.topic,route.question),route,1);
    const record={context:{topic:route.topic,topicSelection:route.selection,routing:route},interpretation:r};
    expect(JSON.parse(JSON.stringify(record))).toEqual(record);expect(record.context.routing.matched).toContain('天气变化');
    expect(record.interpretation.response?.kind).toBe('traditional-weather');
  });
});

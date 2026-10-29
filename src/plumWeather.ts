import type {plumBlossom} from './tradition';
import type {Interpretation} from './traditionInterpretation';

const weatherImages:Record<string,{name:string;text:string}>={
  乾:{name:'晴明',text:'乾在天时占中取晴明之象。'},
  离:{name:'日光、晴',text:'离取日光、晴明之象；不能由此推定日照强度。'},
  坎:{name:'雨、水湿',text:'坎取雨、水湿之象；雨雪之别还需季节条件。'},
  坤:{name:'阴晦、地气',text:'坤取阴晦、地气之象。'},
  兑:{name:'泽气、阴',text:'兑取泽气，原典有不雨亦阴的表述。'},
  震:{name:'雷动',text:'震取雷象；原典强调春夏等时令条件，不能见震就断雷雨。'},
  巽:{name:'风',text:'巽取风象；未据此推定风力等级。'},
  艮:{name:'山云、止势',text:'艮有山云、止势之象；久雨见艮取止雨须以已有久雨为条件。'},
};
export function explainPlumWeather(r:ReturnType<typeof plumBlossom>,question:string,version:string):Interpretation {
  const guas=[r.base,r.mutual,r.transformed];
  const present=guas.flatMap(h=>[h.lower,h.upper]);
  const hasBright=present.some(n=>n==='乾'||n==='离'),hasRain=present.includes('坎'),hasCloud=present.some(n=>n==='坤'||n==='兑');
  const mix=hasBright&&(hasRain||hasCloud);
  const mixedName=hasRain?'晴雨意象并见':'晴明与云气并见';
  const sunnyQuestion=/太阳|太陽|日照|晒|曬|晴/.test(question),rainQuestion=/雨|雪/.test(question);
  let answer:string;
  if(mix)answer=sunnyQuestion?`这组卦${mixedName}，不能把“有大太阳”直断为明确肯定；可读作有晴明线索，同时仍有${hasRain?'雨象':'阴云'}线索。`:rainQuestion?`这组卦同时有晴明和${hasRain?'阴雨':'阴云'}线索，不能只凭其中一卦断定一定下雨或完全无雨。`:`这组卦${mixedName}，适合保留天气变化的观察线索。`;
  else if(hasBright)answer=sunnyQuestion?'按本、互、变卦的传统天时取象，本组见晴明线索；不能进一步确认“大太阳”、持续日照或具体日期。':rainQuestion?'本组卦见晴明意象，未见坎的雨象；这不等于能排除实际降雨。':'按传统天时取象，本组卦见晴明线索；仍不能把卦象当作天气预报。';
  else if(hasRain||hasCloud)answer=sunnyQuestion?'本组卦见阴雨或云气意象，未见乾离的晴明意象，传统取象不足以支持“整日大太阳”的明确判断。':'本组卦见阴雨或云气意象，可先关注这些线索；不能据此确定实际降水。';
  else answer='本组卦以风、雷或山云止势等意象为主，尚不足以从晴雨两端给出明确取向。';
  if(/气温|氣溫|温度|溫度|多少度|几度|幾度|冷不冷|热不热|熱不熱/.test(question))answer='这组卦不包含气象温度数据，不能回答具体几度或冷热程度。下方仅提供传统天时意象；温度问题需核对所问地点、时段的气象预报。';
  else if(/刮风|刮風|大风|大風|风力|風力|台风|颱風/.test(question))answer=present.includes('巽')?'本组卦见巽的风象，可作为传统风势取象；不能据此判断实际风力等级、台风路径或是否有预警。':'本组卦未见巽的直接风象，但不能据此排除实际大风或台风影响。风力与预警信息需要核对当地气象预报。';
  const evidence=[...new Set(present)].map(n=>`${n}（${weatherImages[n].name}）`).join('、');
  return {
    version,topic:'天时天气',headline:`${r.base.name}之${r.transformed.name}：${mix?mixedName:hasBright?'见晴明意象':hasRain||hasCloud?'见阴雨或云气意象':'风雷云势的观察线索'}`,
    summary:`天时占按本卦、互卦、变卦整体观察，不用体用生克判天气。本次见${evidence}。`,
    response:{label:'针对本次天气问题 · 传统天时取象',text:answer,kind:'traditional-weather'},
    signals:[...guas.map((h,i)=>({label:['本卦 · 天时取象','互卦 · 天时取象','变卦 · 天时取象'][i],value:h.title,meaning:`下卦${h.lower}：${weatherImages[h.lower].text}上卦${h.upper}：${weatherImages[h.upper].text}`})),
      {label:'解读规则',value:'不分体用 · 全观诸卦',meaning:'依据《梅花易数》卷二“天时占第一”。同一卦象在本、互、变中重复，不是多次独立预测，不能用出现次数换算概率。'}],
    suggestions:['先明确所问地点和时段；“明天”是所问日期，不是把取卦时间改成明天。','核对当地气象预报中的云量、日照和降水信息，再安排实际活动。'],
    limits:['这份内容是传统天气取象，未接入实时气象预报，不提供实际天气结论。','尚未合看季节、当地晴雨实况及完整制化，不能推定日照强弱、降水量或风力等级。','本互变卦不自动对应上午、中午、下午或三个确定时间段。'],
    sources:[{title:'《梅花易数》卷二',url:'https://zh.wikisource.org/wiki/梅花易數/卷二',locator:'体用生克篇之二·天时占第一',localPath:'/resources/methods/plum-2.html'}],
  };
}

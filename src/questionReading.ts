import type {Interpretation,InterpretationTopic} from './traditionInterpretation';

export type TopicSelection=InterpretationTopic|'自动识别问题';
export interface QuestionRoute {
  question:string;
  topic:InterpretationTopic;
  selection:TopicSelection;
  mode:'manual'|'keyword'|'fallback';
  matched:string[];
  focus:string;
  note:string;
}
const rules:{topic:InterpretationTopic;pattern:RegExp;focus:string}[]=[
  {topic:'天时天气',pattern:/天气|天氣|气象|氣象|气温|氣溫|温度|溫度|多少度|几度|幾度|冷不冷|热不热|熱不熱|下雨|下雪|降雨|降水|暴雨|雷雨|阴天|陰天|晴天|晴不晴|会晴|會晴|天晴|大太阳|大太陽|有太阳|有太陽|出太阳|出太陽|晒太阳|曬太陽|太阳大不大|太陽大不大|日照|刮风|刮風|大风|大風|风力|風力|台风|颱風/,focus:'天气变化'},
  {topic:'工作学业',pattern:/考试|考試|考研|考公|考证|考證|成绩|成績|录取|錄取|升学|升學/,focus:'考试与录取'},
  {topic:'工作学业',pattern:/工作|求职|求職|应聘|應聘|面试|面試|职位|職位|升职|升職|晋升|晉升|转岗|轉崗/,focus:'求职与职位'},
  {topic:'工作学业',pattern:/学习|學習|学业|學業|论文|論文|毕业|畢業|材料|文书|文書/,focus:'学习与材料准备'},
  {topic:'资源财物',pattern:/回款|货款|貨款|收款|尾款|账款|賬款|欠款|借款|还钱|還錢/,focus:'款项与凭据'},
  {topic:'资源财物',pattern:/财物|財物|收入|预算|預算|资金|資金|资源|資源|钱财|錢財|求财|求財|盈利|利润|利潤/,focus:'资源与收支'},
  {topic:'合作关系',pattern:/合作|合伙|合夥|合同|签约|簽約|伙伴|夥伴|对方|對方|关系|關係|沟通|溝通|感情|恋爱|戀愛|复合|復合/,focus:'双方关系与配合'},
  {topic:'计划推进',pattern:/计划|計劃|项目|項目|推进|推進|进展|進展|筹备|籌備|安排|启动|啟動|完成|开展|開展/,focus:'计划与进展'},
];
export function resolveQuestion(question:string,selection:TopicSelection='自动识别问题'):QuestionRoute {
  const text=question.trim(),matches=rules.filter(r=>r.pattern.test(r.topic==='天时天气'?text.replace(/太阳能|太陽能/g,'能源'):text));
  if(selection!=='自动识别问题'){
    const same=matches.find(r=>r.topic===selection);
    return {question:text,topic:selection,selection,mode:'manual',matched:matches.map(r=>r.focus),focus:same?.focus??selection,note:`按手动选择的“${selection}”解读。${matches.length&&!same?'问题关键词与当前主题可能不一致，可改为自动识别。':''}`};
  }
  if(!matches.length)return {question:text,topic:'综合观察',selection,mode:'fallback',matched:[],focus:'综合观察',note:text?'暂未识别到专门问题类型，当前提供通用盘面说明；可手动选择解说主题。':'填写问题后，自动匹配已有解读规则；也可手动选择主题。'};
  const first=matches[0],mixed=new Set(matches.map(r=>r.topic)).size>1;
  return {question:text,topic:first.topic,selection,mode:'keyword',matched:matches.map(r=>r.focus),focus:first.focus,note:`根据关键词按“${first.topic}”解读。${mixed?'问题涉及多个主题，当前优先此类；可手动更改。':'识别有误时可手动更改。'}`};
}

export function interpretQuestion(base:Interpretation,route:QuestionRoute,method:number):Interpretation {
  if(route.topic==='天时天气'&&method!==1){
    return {...base,topic:route.topic,headline:'当前工具尚未提供天气专门解读',summary:'这套工具现有的课名、生克或主客算不能直接回答晴雨问题。可以改用已核对《梅花易数·天时占》的解读。',
      response:{label:'针对本次天气问题',text:'目前不能用这份盘面回答天气是否晴、雨或有大太阳。若要阅读传统天时取象，请切换梅花易数；实际天气仍需结合地点和时段核对预报。',kind:'unsupported-weather',action:{label:'切换梅花天时解读',tool:1}},
      signals:[{label:'本次盘面记录',value:base.headline,meaning:'排盘结果保留在上方；这里不把通用吉凶、世应关系或长短算移植成天气结论。'}],
      suggestions:['明确所问地点与时段，并核对当地气象预报。'],limits:['本工具当前未实现对应的天时专门断法。'],routingNote:route.note};
  }
  if(base.response)return {...base,routingNote:route.note};
  if(!route.question||route.mode==='fallback')return {...base,routingNote:route.note};
  let text='';
  if(method===1){
    const relation=base.signals.find(s=>s.label==='本卦体用')?.value??'';
    const meanings:Record<string,string>={
      用克体:`对“${route.focus}”，这组体用突出外部约束。先核对实际标准、对方条件或准备是否充分；这一项不能直接断为事情必败。`,
      体生用:`对“${route.focus}”，这组体用突出己方投入与消耗。可先核对付出能否持续、反馈是否落实，不能只凭卦名认定会达成。`,
      用生体:`对“${route.focus}”，这组体用有外部生扶的传统取象。可重点确认哪些支持真正可用，以及支持附带的条件。`,
      体克用:`对“${route.focus}”，这组体用有主动施为、约束条件的传统取象。可先落实自己能控制的一步，仍不能把它当作结果保证。`,
      体用比和:`对“${route.focus}”，体用同类有协调相助的传统取象。可先核对共同目标与已有基础，再看后续变化。`,
    };text=meanings[relation]??base.summary;
  }else if(method===2){
    const seats=base.signals.find(s=>s.label==='世应生克');
    const focus=base.signals.find(s=>s.label.startsWith('主题相关六亲'));
    text=route.topic==='合作关系'?`本次世应为${seats?.value}。${seats?.meaning}这只能提示双方条件的观察方向，不能判定对方真实想法；请用实际沟通核对。`:focus?`就“${route.focus}”，本盘可先核对${focus.value}。这些是候选参考，仍需结合具体事项选用神与核定旺衰，不能据此保证成败。`:`就“${route.focus}”，先从${base.headline}的世应和动爻观察条件。当前缺少完整用神与旺衰判断，不能给出成败保证。`;
  }else if(method===3){
    text=`就“${route.focus}”，本课为${base.headline}。${base.signals[0].meaning}可将其作为核对事情发端、承接和收束条件的线索，不能把三传读成必然发生的三个事件。`;
  }else if(method===4){
    text=`就“${route.focus}”，当前${base.headline}。须先说明主客在本次问题中各指哪一方，再合看杜塞与同宫条件；不能单凭长短算判断哪一方达成目的。`;
  }else{
    text=`就“${route.focus}”，本次${base.headline}。${base.signals[2].meaning}可参考下方与此落点对应的行动提示，不能将课名换成确定的“能”或“不能”。`;
  }
  return {...base,response:{label:`针对本次所问 · ${route.focus}`,text,kind:'traditional-context'},routingNote:route.note};
}

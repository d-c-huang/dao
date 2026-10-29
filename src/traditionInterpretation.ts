import {branches,branchElements,stemElements,relation,integer} from './tradition';
import type {plumBlossom} from './tradition';
import type {sixYao,liurenTransmissions,taiyiCounts} from './advancedTradition';
import {explainPlumWeather} from './plumWeather';

export const interpretationTopics=['综合观察','计划推进','工作学业','合作关系','资源财物','天时天气'] as const;
export type InterpretationTopic=typeof interpretationTopics[number];
export type ReadingSignal={label:string;value:string;meaning:string};
type ReadingSource={title:string;url:string;locator:string;localPath?:string};
export interface Interpretation {
  version:string;
  topic:InterpretationTopic;
  headline:string;
  summary:string;
  signals:ReadingSignal[];
  suggestions:string[];
  limits:string[];
  sources:ReadingSource[];
  response?:{label:string;text:string;kind:'traditional-context'|'traditional-weather'|'unsupported-weather';action?:{label:string;tool:number}};
  routingNote?:string;
}
const version='traditional-reading-v2';
const guaElements:Record<string,string>={乾:'金',兑:'金',离:'火',震:'木',巽:'木',坎:'水',艮:'土',坤:'土'};
const topicPrompts:Record<InterpretationTopic,string>={
  综合观察:'把当前已知事实、尚待确认的信息和可以先做的一步分别写下，再核对后续反馈。',
  计划推进:'先确认依赖条件、负责人和下一次检查点，用可完成的小步骤验证进展。',
  工作学业:'核对任务标准、材料是否齐全、反馈渠道与截止时间，再安排下一步。',
  合作关系:'分别确认双方需求、承诺和边界，用实际沟通核对彼此的理解。',
  资源财物:'核对预算、收支凭证和资源到位情况，再评估可承受的投入。',
  天时天气:'明确所问地点与时段，并核对当地气象预报。',
};
function reading(topic:InterpretationTopic,data:Omit<Interpretation,'version'|'topic'>):Interpretation {
  return {version,topic,...data,suggestions:[...data.suggestions,topicPrompts[topic]]};
}
const zengshan:ReadingSource={title:'《增删卜易》',url:'https://zh.wikisource.org/wiki/增刪卜易',locator:'用神章、动变章、黄金策总断千金赋直解（世应）',localPath:'/resources/methods/zengshan.html'};
const liurenSource:ReadingSource={title:'《六壬大全》卷七',url:'https://zh.wikisource.org/wiki/六壬大全/7',locator:'课经集一各课名段落',localPath:'/resources/methods/liuren-7.html'};
const taiyiSource:ReadingSource={title:'《太乙秘书》',url:'https://zh.wikisource.org/wiki/太乙秘書',locator:'主客算、太乙金镜七十二局赋',localPath:'/resources/methods/taiyi.html'};

export const smallPalaceMeanings:Record<string,{theme:string;meaning:string;advice:string}>={
  大安:{theme:'安定守成',meaning:'常用释义偏向平稳、安定，适合从已有秩序与基础理解。',advice:'先保持已验证的安排，确认稳定条件是否仍在。'},
  留连:{theme:'迟滞反复',meaning:'常用释义有拖延、牵连与反复，需要留意尚未处理的环节。',advice:'找出一个造成等待的依赖，向相关人核实，给计划留出缓冲。'},
  速喜:{theme:'消息与进展',meaning:'常用释义偏向喜讯、较快的反馈；“速”是课名取象，不是具体日期。',advice:'留意实际到来的消息，收到反馈后核对内容并及时回应。'},
  赤口:{theme:'言语与分歧',meaning:'常用释义偏向口舌争执，可从表达、协商和误解的角度阅读。',advice:'重要约定写清楚，先复述对方意思，再讨论分歧。'},
  小吉:{theme:'小成与相助',meaning:'常用释义偏向顺利与有人相助，可从小范围配合和逐步促成理解。',advice:'把目标拆小，寻找一位能给出明确帮助的协作者。'},
  空亡:{theme:'落空与未落实',meaning:'常用释义有落空、不落实之意，适合检查依据与承诺是否成立。',advice:'先核实关键消息、承诺与条件，准备一条不依赖它们的替代路径。'},
};
export function explainSmallLiuren(palaces:string[],topic:InterpretationTopic='综合观察') {
  if(palaces.length!==3||palaces.some(p=>!smallPalaceMeanings[p]))throw new RangeError('请提供合法的月、日、时三宫');
  const final=smallPalaceMeanings[palaces[2]];
  return reading(topic,{
    headline:`时宫${palaces[2]}：${final.theme}`,
    summary:`本次顺数落在${palaces.join(' → ')}，最终时宫为${palaces[2]}。解说以时宫为本次落点，月宫、日宫用于说明顺数来路。`,
    signals:palaces.map((p,i)=>({label:['月宫 · 起月落点','日宫 · 起日落点','时宫 · 最终落点'][i],value:p,meaning:smallPalaceMeanings[p].meaning})),
    suggestions:[final.advice],
    limits:['三宫不是三次独立吉凶投票，也不自动对应事情的过去、现在和未来。','本法“空亡”是六宫之一的课名，与大六壬按日干支求出的旬空不同。','课名释义为现代通行整理，不能据此确定成败、方位或应期。'],
    sources:[{title:'小六壬所选顺数法的公开实现',url:'https://fatboy001.github.io/Divination/',locator:'六神的基本意思、月上起日与日上起时；现代参照，非古籍'}],
  });
}

const bodyUse:Record<string,{name:string;meaning:string;advice:string}>={
  比和:{name:'体用比和',meaning:'体用同一五行，传统多解为协调、相助，仍需结合条件与时令。',advice:'确认双方已有的共同目标，先推进共识清楚的一步。'},
  生我:{name:'用生体',meaning:'用卦生体卦，传统多解为外部生扶、助益。',advice:'辨认实际可用的支持，确认支持的条件与持续时间。'},
  我生:{name:'体生用',meaning:'体卦生用卦，传统多从付出、耗泄理解，需留意投入与承接能力。',advice:'列出目前的付出，核对时间和资源是否足够。'},
  我克:{name:'体克用',meaning:'体卦克用卦，传统常作可制、可谋解，但不等于不需投入便能达成。',advice:'明确自己能影响的条件，选择一项可控的行动先验证。'},
  克我:{name:'用克体',meaning:'用卦克体卦，传统多解为受制、阻力，需另看体卦旺衰与其他生扶。',advice:'先识别外部限制，补足关键条件，再决定是否扩大行动。'},
};
export function explainPlum(r:ReturnType<typeof plumBlossom>,topic:InterpretationTopic='综合观察',question='') {
  if(topic==='天时天气')return explainPlumWeather(r,question,version);
  const body=guaElements[r.body],use=guaElements[r.use],key=relation(body,use),current=bodyUse[key];
  const changedUse=r.movingLine<=3?r.transformed.lower:r.transformed.upper;
  const after=bodyUse[relation(body,guaElements[changedUse])];
  return reading(topic,{
    headline:`${r.base.name}之${r.transformed.name}：${current.name}`,
    summary:`体卦${r.body}属${body}，用卦${r.use}属${use}，本卦为${current.name}。第${r.movingLine}爻动，用卦变为${changedUse}，变后关系为${after.name}。`,
    signals:[
      {label:'本卦体用',value:current.name,meaning:current.meaning},
      {label:'本卦卦意 · 项目释义',value:r.base.title,meaning:r.base.summary},
      {label:'互卦线索 · 项目释义',value:r.mutual.title,meaning:r.mutual.summary},
      {label:'变后体用',value:`${changedUse}${guaElements[changedUse]} · ${after.name}`,meaning:after.meaning},
      {label:'变卦卦意 · 项目释义',value:r.transformed.title,meaning:r.transformed.summary},
    ],
    suggestions:[current.advice,'把本卦与变卦的不同之处作为观察问题，留意实际反馈是否支持这些变化线索。'],
    limits:['当前只解释体用五行和卦意，未加入时令旺衰、外应及具体爻辞的综合断法。','互卦、变卦是阅读线索，不能直接当作确定的过程和最终结局。'],
    sources:[{title:'《梅花易数》卷二',url:'https://zh.wikisource.org/wiki/梅花易數/卷二',locator:'体用生克篇·人事占第二、体用总诀',localPath:'/resources/methods/plum-2.html'},{title:'《周易》本卦原文',url:r.base.sourceUrl,locator:r.base.title,localPath:`/resources/classics/zhou-yi/${String(r.base.number).padStart(2,'0')}.html`}],
  });
}

const seatRelation:Record<string,string>={比和:'世应同类，传统可作同气相协；同类也可能有竞争，须结合所问之事。',我生:'世生应，传统可从己方向对方付出、支持理解。',生我:'应生世，传统可从对方或外部条件对己方生扶理解。',我克:'世克应，可从己方对对方有所约束或试图掌控理解。',克我:'应克世，可从己方受到对方条件约束理解，不能单凭这一项定凶。'};
const relativeMeanings:Record<string,string>={父母:'文书、凭据、承载与支持条件',官鬼:'职位、责任、规则约束与压力',兄弟:'同类、同伴及资源竞争',妻财:'财物与可调配的资源',子孙:'产出、后续成果及解忧之象'};
const pos=(n:number)=>['初爻','二爻','三爻','四爻','五爻','上爻'][n-1];
export function explainSixYao(r:ReturnType<typeof sixYao>,topic:InterpretationTopic='综合观察') {
  const shi=r.base[r.palace.shi-1],ying=r.base[r.palace.ying-1],key=relation(shi.element,ying.element);
  const focus=topic==='工作学业'?['官鬼','父母']:topic==='资源财物'?['妻财']:[];
  const selected=r.base.filter(l=>focus.includes(l.relative));
  const signals:ReadingSignal[]=[
    {label:'世爻 · 己方观察点',value:`${pos(shi.position)} ${shi.ganZhi}${shi.element} · ${shi.relative}`,meaning:`世爻常用于自占或彼此关系中的己方。${shi.relative}在此可从${relativeMeanings[shi.relative]}取象；具体角色仍依所问之事。`},
    {label:'应爻 · 对方观察点',value:`${pos(ying.position)} ${ying.ganZhi}${ying.element} · ${ying.relative}`,meaning:'涉及双方时，应爻可作为对方或相对条件的观察点；不是所有问题都必须以应爻为用神。'},
    {label:'世应生克',value:`世${shi.element} → 应${ying.element} · ${key}`,meaning:seatRelation[key]},
  ];
  if(focus.length)signals.push({label:'主题相关六亲 · 候选参考',value:selected.length?selected.map(l=>`${pos(l.position)}${l.relative}`).join('、'):`本卦未现${focus.join('、')}明爻`,meaning:`本主题先列${focus.join('、')}供核对，不自动指定唯一用神。${focus.map(f=>`${f}常用于${relativeMeanings[f]}`).join('；')}。本卦未现时还应查伏神，不能解作现实中没有机会或资源。`});
  for(const n of r.cast.moving){
    const a=r.base[n-1],b=r.changed[n-1],change=relation(b.element,a.element);
    const text=change==='我生'?'变爻生本爻，传统称回头生。':change==='我克'?'变爻克本爻，传统称回头克。':change==='比和'?'本变五行相同；是否进退，不能仅看同五行。':change==='生我'?'本爻生变爻，可从向外付出、耗泄取象。':'本爻克变爻，显示本变之间存在制约。';
    signals.push({label:`动爻 · ${pos(n)}`,value:`${a.ganZhi}${a.element} ${a.relative} → ${b.ganZhi}${b.element} ${b.relative}`,meaning:text+'这里只说明五行方向，仍须核对日月旺衰、冲合与空破。'});
  }
  if(!r.cast.moving.length)signals.push({label:'动静',value:'六爻皆静',meaning:'本次没有6或9所标记的变爻，可先阅读本卦与相关用神；静卦不表示现实事情不会变化。'});
  return reading(topic,{
    headline:`${r.cast.base.title}：${r.palace.palace}宫${r.palace.stage}，${r.cast.moving.length?`${r.cast.moving.length}爻动`:'六爻皆静'}`,
    summary:`世在${pos(r.palace.shi)}、应在${pos(r.palace.ying)}。${seatRelation[key]}${r.cast.moving.length?`本次${r.cast.moving.map(pos).join('、')}发动，下面逐爻说明变化。`:'本卦没有动爻，先从世应及所问主题读起。'}`,
    signals,suggestions:[topic==='合作关系'?'把世应当作核对双方条件的提问框架：谁在投入，谁提供支持，谁设置约束？':'先选清所问之事对应的用神，再看其所处条件；不要按六亲名称直接判断人物好坏。'],
    limits:['当前未将月建、日辰纳入旺衰断课，也未排六神、伏神与旬空；不能给出完整吉凶或应期。','卦意、六亲、世应是不同阅读层次；不把本变卦名直接等同于成败。'],sources:[zengshan],
  });
}

const lessonMeaning:Record<string,{meaning:string;advice:string}>={
  元首:{meaning:'传统课义重在上制下、顺其秩序，可关注明确的主次与责任。',advice:'确认谁负责决策、谁负责执行，沿清楚的流程推进。'},
  重审:{meaning:'传统课义强调重新审察、详审后动，可关注内部异议或尚未厘清的条件。',advice:'复核一项核心假设，先处理内部尚未一致的意见。'},
  比用:{meaning:'传统知一课有两岐择一之意，可从取舍、亲疏与选定路径理解。',advice:'把两个主要选项的依据并列，只选择一项先验证。'},
  涉害:{meaning:'传统课义取历涉艰难、辨深浅，可从多重约束、先难后通的线索理解。',advice:'逐项列出阻力，先确认影响最大的那一个环节。'},
  遥克:{meaning:'传统课义有隔位相克、影响较远之意，可关注间接压力和未经核实的传闻。',advice:'区分直接证据和转述消息，向直接相关的人核实。'},
  昴星:{meaning:'传统课义有闭塞、守静待察之象，可从信息不足与行动条件受限理解。',advice:'先补足关键事实，保留回旋余地，再安排下一次行动。'},
  别责:{meaning:'传统课义取四课不备、另求相合，可关注现有条件不足及借助外部配合。',advice:'确认缺少什么条件，寻找能补上这一环的人或资源。'},
  八专:{meaning:'传统课义重在干支同位、事务集中，可从内部事务、重复牵连理解。',advice:'先把内部职责与重复工作理顺，再扩展到外部事项。'},
  伏吟:{meaning:'传统课义有守旧待新、静中思动之象，可关注停滞、重复和既有安排。',advice:'先检查旧问题为何反复，改变一个可验证的条件。'},
  返吟:{meaning:'传统课义有往来反复、改动之象，可关注计划回转与条件变化。',advice:'给变更留出余地，写下何时继续、何时调整的条件。'},
};
function elementReading(base:string,other:string){
  const key=relation(base,other);
  return {key,text:({比和:'同类，可作同气或同类事务的线索。',我生:'日干生传神，可作付出与耗泄的线索。',生我:'传神生日干，可作生扶与支持的线索。',我克:'日干克传神，可作所制、所求资源的线索。',克我:'传神克日干，可作约束与压力的线索。'} as Record<string,string>)[key]};
}
export function explainLiuren(r:ReturnType<typeof liurenTransmissions>,dayIndex:number,topic:InterpretationTopic='综合观察') {
  integer(dayIndex,0,59);
  const kind=r.method.includes('返吟')?'返吟':r.method.includes('元首')?'元首':r.method.includes('重审')?'重审':r.method.split(' · ')[0];
  const lesson=lessonMeaning[kind];if(!lesson)throw new Error('未知课式');
  const dayElement=stemElements[dayIndex%10];
  const signals:ReadingSignal[]=[{label:'课式含义 · 传统取象',value:r.method,meaning:lesson.meaning},...r.transmissions.map((b,i)=>{
    const element=branchElements[branches.indexOf(b)],rel=elementReading(dayElement,element);
    const label:Record<string,string>={比和:'与日干同类',我生:'日干生传神',生我:'传神生日干',我克:'日干克传神',克我:'传神克日干'};
    return {label:['初传 · 发端线索','中传 · 承接线索','末传 · 收束线索'][i],value:`${b}${element} · ${label[rel.key]}`,meaning:rel.text+(r.voids.includes(b)?`本日${b}落旬空，传统另有待实、未实等解释；空不等于永远不发生。`:'未落本日旬空。')};
  })];
  for(let i=0;i<2;i++){
    const a=branchElements[branches.indexOf(r.transmissions[i])],b=branchElements[branches.indexOf(r.transmissions[i+1])];
    const pair:Record<string,string>={比和:`前后均属${a}，可作同类相承的线索。`,我生:`前传${a}生后传${b}，可从前一环节向后一环节投入理解。`,生我:`后传${b}生前传${a}，可从后续条件对前一环节有所生扶理解。`,我克:`前传${a}克后传${b}，可从前一环节约束后续条件理解。`,克我:`后传${b}克前传${a}，可从后续条件反过来制约前一环节理解。`};
    signals.push({label:`三传衔接 · ${i===0?'初到中':'中到末'}`,value:`${r.transmissions[i]} → ${r.transmissions[i+1]}`,meaning:pair[relation(a,b)]});
  }
  return reading(topic,{
    headline:`${r.method}：${r.transmissions.join(' → ')}`,
    summary:`${lesson.meaning}日干属${dayElement}，按初、中、末观察发端、承接、收束三层关系。`,
    signals,suggestions:[lesson.advice],
    limits:['三传是传统阅读层次，不是现实中必然依次发生的三个事件。','尚未布天将、月令旺衰、年命等，课名或单一生克不能独立决定吉凶与应期。'],sources:[liurenSource],
  });
}

export function explainTaiyi(r:ReturnType<typeof taiyiCounts>,topic:InterpretationTopic='综合观察') {
  const a=r.hostCount.total,b=r.guestCount.total;
  const comparison=a===b?'主客算相等':a>b?'主算长于客算':'客算长于主算';
  const signals:ReadingSignal[]=[{label:'长短算比较',value:`主${a} · 客${b}`,meaning:`${comparison}。原典将长多、短少列作比较条件，但还要合看门具、将发与掩迫等，不能仅凭算数判胜负。`}];
  for(const [label,eye,count] of [['主',r.host,r.hostCount],['客',r.guest,r.guestCount]] as const){
    const blocked=[5,15,25].includes(count.total);
    signals.push({label:`${label}算条件`,value:blocked?'八门杜塞':`算数 ${count.total}`,meaning:blocked?'原典将5、15、25称八门杜塞，传统有行动条件闭塞之义。可先核对通路、资源与配合条件。':'未触发本页按算数识别的5、15、25杜塞条件；这不等于已经核定“三门具、五将发”。'});
    if(count.samePalace)signals.push({label:`${label}目与太乙同宫`,value:label==='主'?'文昌同宫 · 囚':'始击同宫 · 掩',meaning:`${eye.name}在太乙${r.palace}宫。此为传统同宫术语，可作条件受牵制的阅读线索，不按字面预测灾祸。`});
    if(count.general===r.palace)signals.push({label:`${label}大将位置`,value:`大将${count.general}宫与太乙同宫`,meaning:'古局称大将囚；本页只标出同宫关系，其他格迫、将发仍需完整盘式。'});
  }
  const support=[1,8,3,4].includes(r.palace)?'助主':'助客';
  signals.push({label:'太乙宫的传统配属',value:`${r.palace}宫 · ${support}`,meaning:'《太乙金镜七十二局赋》以一八三四助主、九二七六助客。这是盘内配属，不覆盖其他相反条件，也不表示现实中某一方必胜。'});
  return reading(topic,{
    headline:`${comparison}：${a} 对 ${b}`,
    summary:`文昌${r.host.position}得主算${a}，始击${r.guest.position}得客算${b}。先看长短，再核对下列杜塞、同宫与宫位条件。`,
    signals,suggestions:['在所问场景中先说明“主”和“客”各指哪一方，再比较双方现实中可核实的条件与准备程度。'],
    limits:['主客是传统盘内角色，不能直接固定为“我方一定是主、对方一定是客”。','当前为手动盘位主客算，未完成全部门将与掩击格迫判断；不把数值差换算成概率或胜负结论。'],sources:[taiyiSource],
  });
}

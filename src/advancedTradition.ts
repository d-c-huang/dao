import {trigrams} from './data';
import {hexagramBits} from './hexagramStructure';
import {hexagrams} from './hexagrams';
import {branches,branchElements,stemElements,relation,castResult,bigLiuren,taiyiPalaces} from './tradition';

const mod=(n:number,d:number)=>((n%d)+d)%d;
const palaceElements:Record<string,string>={乾:'金',兑:'金',离:'火',震:'木',巽:'木',坎:'水',艮:'土',坤:'土'};
const stages=['本宫','一世','二世','三世','四世','五世','游魂','归魂'];
const seats=[6,1,2,3,4,5,4,3];
export const eightPalaces=trigrams.flatMap(t=>{
  let bits=[...t.bits,...t.bits];
  return stages.map((stage,i)=>{
    if(i>=1&&i<=5)bits=bits.map((b,k)=>k===i-1?1-b:b);
    if(i===6)bits=bits.map((b,k)=>k===3?1-b:b);
    if(i===7)bits=bits.map((b,k)=>k<3?1-b:b);
    const hexagram=hexagrams.find(h=>hexagramBits(h).every((b,k)=>b===bits[k]))!;
    return {number:hexagram.number,palace:t.name,element:palaceElements[t.name],stage,shi:seats[i],ying:mod(seats[i]+2,6)+1};
  });
});
// Each row is 初爻→上爻, as in the classic's 浑天甲子 table.
const najia:Record<string,string[]>={
  乾:['甲子','甲寅','甲辰','壬午','壬申','壬戌'],坤:['乙未','乙巳','乙卯','癸丑','癸亥','癸酉'],
  震:['庚子','庚寅','庚辰','庚午','庚申','庚戌'],巽:['辛丑','辛亥','辛酉','辛未','辛巳','辛卯'],
  坎:['戊寅','戊辰','戊午','戊申','戊戌','戊子'],离:['己卯','己丑','己亥','己酉','己未','己巳'],
  艮:['丙辰','丙午','丙申','丙戌','丙子','丙寅'],兑:['丁巳','丁卯','丁丑','丁亥','丁酉','丁未']
};
const relatives:Record<string,string>={比和:'兄弟',我生:'子孙',生我:'父母',我克:'妻财',克我:'官鬼'};
export function sixYao(lines:number[]){
  const cast=castResult(lines),palace=eightPalaces.find(p=>p.number===cast.base.number)!;
  function install(h:typeof cast.base){return Array.from({length:6},(_,i)=>{
    const ganZhi=najia[i<3?h.lower:h.upper][i],element=branchElements[branches.indexOf(ganZhi[1])];
    return {position:i+1,ganZhi,element,relative:relatives[relation(palace.element,element)]};
  })}
  return {cast,palace,base:install(cast.base),changed:install(cast.transformed),reference:'zengshan',rulesVersion:'najia-eight-palaces-v1'};
}

const lodges=[2,4,5,7,5,7,8,10,11,1];
const punish=[3,10,5,0,4,8,6,1,2,9,7,11];
const controls=(a:string,b:string)=>relation(a,b)==='我克';
export function liurenTransmissions(dayIndex:number,general:number,hour:number){
  const chart=bigLiuren(dayIndex,general,hour),stem=dayIndex%10,day=dayIndex%12,yang=stem%2===0;
  const above=(b:number)=>mod(b+chart.shift,12),under=(b:number)=>mod(b-chart.shift,12);
  const positions=[lodges[stem],above(lodges[stem]),day,above(day)];
  const tops=positions.map(above),bottomElements=[stemElements[stem],branchElements[tops[0]],branchElements[day],branchElements[tops[2]]];
  const unique=(ns:number[])=>ns.filter((n,i)=>ns.findIndex(j=>tops[j]===tops[n])===i);
  const lower=unique([0,1,2,3].filter(i=>controls(bottomElements[i],branchElements[tops[i]])));
  const upper=unique([0,1,2,3].filter(i=>controls(branchElements[tops[i]],bottomElements[i])));
  const candidates=lower.length?lower:upper;
  const trace:string[]=[`月将加占时，天盘位移 ${chart.shift}；下贼 ${lower.length} 神，上克 ${upper.length} 神（同神去重）。`];
  let method='',triple:number[]=[];
  function successive(initial:number){return [initial,above(initial),above(above(initial))]}
  function choose(indices:number[]){
    if(indices.length===1){method=lower.length?'贼克 · 重审':'贼克 · 元首';return tops[indices[0]]}
    const matching=indices.filter(i=>tops[i]%2===stem%2);
    let pool=matching.length?matching:indices;
    trace.push(`比用：${yang?'阳':'阴'}日取同阴阳上神，候选 ${pool.map(i=>branches[tops[i]]).join('、')}。`);
    if(pool.length===1){method='比用 · 知一';return tops[pool[0]]}
    method='涉害';
    const depths=pool.map(i=>{
      let depth=0;
      // Exclude the initial position, already represented by the lesson's 克.
      for(let step=1;step<=mod(tops[i]-positions[i],12);step++){
        const p=mod(positions[i]+step,12),es=[branchElements[p],...lodges.flatMap((l,k)=>l===p?[stemElements[k]]:[])];
        depth+=es.filter(e=>lower.length?controls(e,branchElements[tops[i]]):controls(branchElements[tops[i]],e)).length;
      }
      return {i,depth};
    });
    const deepest=Math.max(...depths.map(d=>d.depth));pool=depths.filter(d=>d.depth===deepest).map(d=>d.i);
    trace.push(`涉害归本家，沿途支与寄干计克：${depths.map(d=>branches[tops[d.i]]+' '+d.depth+'重').join('；')}。`);
    if(pool.length>1){
      const rank=(i:number)=>positions[i]%3===2?0:positions[i]%3===0?1:2;
      const best=Math.min(...pool.map(rank));pool=pool.filter(i=>rank(i)===best);
      trace.push('深度相等，先孟、次仲；再同取刚日干上先见、柔日支上先见。');
      const order=yang?[0,1,2,3]:[2,3,0,1];pool.sort((a,b)=>order.indexOf(a)-order.indexOf(b));
    }
    return tops[pool[0]];
  }
  if(chart.shift===0){
    method='伏吟';
    const initial=candidates.length?tops[candidates[0]]:yang?lodges[stem]:day;
    let middle=punish[initial];
    if(middle===initial)middle=initial===lodges[stem]?day:lodges[stem];
    let end=punish[middle];
    if(end===middle||end===initial)end=mod(middle+6,12);
    triple=[initial,middle,end];trace.push('伏吟：有克取克，无克刚干柔辰；依次取刑。初传自刑改取日辰，次传自刑或刑回初传则取冲。');
  }else if(candidates.length){
    const initial=choose(candidates);triple=successive(initial);
    if(chart.shift===6)method='返吟 · '+method;
    trace.push('初传确定后，取初传上神为中传，中传上神为末传。');
  }else if(chart.shift===6){
    method='返吟 · 无克';
    const horse=[2,11,8,5][day%4];triple=[horse,tops[2],tops[0]];
    trace.push('无克返吟：支之驿马发用，辰上为中，干上为末。');
  }else if(lodges[stem]===day){
    method='八专';triple=[mod(yang?tops[0]+2:tops[3]-2,12),tops[0],tops[0]];
    trace.push('八专论克不论遥：阳从干阳顺数三，阴从支阴逆数三（含本位）；中末并干上。');
  }else{
    const remoteUpper=unique([1,2,3].filter(i=>controls(branchElements[tops[i]],stemElements[stem])));
    const remoteLower=unique([1,2,3].filter(i=>controls(stemElements[stem],branchElements[tops[i]])));
    const remote=remoteUpper.length?remoteUpper:remoteLower;
    if(remote.length){
      const matching=remote.filter(i=>tops[i]%2===stem%2),pool=matching.length?matching:remote;
      method=remoteUpper.length?'遥克 · 蒿矢':'遥克 · 弹射';
      if(pool.length!==1)throw new Error('遥克候选未能唯一确定，请核对课式');
      triple=successive(tops[pool[0]]);trace.push(`先神克日、后日克神；比日取 ${branches[triple[0]]}，再迭取上神。`);
    }else if(new Set(tops).size===3){
      method='别责';triple=[yang?above(lodges[(stem+5)%10]):mod(day+4,12),tops[0],tops[0]];
      trace.push('三课无克无遥：刚取干合寄宫上神；柔取支前三合神（本项目采用支前三合本神）；中末并干上。');
    }else{
      method='昴星';triple=yang?[above(9),tops[2],tops[0]]:[under(9),tops[0],tops[2]];
      trace.push(yang?'阳日仰取地盘酉上神，辰中干末。':'阴日俯取天盘酉下神，干中辰末。');
    }
  }
  return {...chart,method,transmissions:triple.map(b=>branches[b]),trace,reference:'liuren-1',rulesVersion:'nine-gates-depth-v1'};
}

export const taiyiRing=[
  ['子','地主',8],['丑','阳德',0],['艮','和德',3],['寅','吕申',0],['卯','高丛',4],['辰','太阳',0],['巽','大炅',9],['巳','大神',0],
  ['午','大威',2],['未','天道',0],['坤','大武',7],['申','武德',0],['酉','太簇',6],['戌','阴主',0],['乾','阴德',1],['亥','大义',0]
].map(([position,name,palace])=>({position:String(position),name:String(name),palace:Number(palace)}));
export function taiyiCounts(palace:number,host:number,guest:number){
  if(!taiyiPalaces.some(p=>p.number===palace))throw new RangeError('太乙宫须为1、2、3、4、6、7、8、9');
  if(![host,guest].every(n=>Number.isSafeInteger(n)&&n>=0&&n<16))throw new RangeError('二目须为十六神位置');
  const target=taiyiRing.findIndex(p=>p.palace===palace);
  function count(start:number){
    const steps:{label:string;value:number}[]=[];
    // Same palace counts its own palace number; otherwise stop BEFORE 太乙.
    if(start===target)steps.push({label:taiyiRing[start].position+'（同宫）',value:palace});
    else for(let k=0;k<mod(target-start,16);k++){
      const p=taiyiRing[(start+k)%16];
      if(p.palace||k===0)steps.push({label:p.position+' · '+p.name,value:p.palace||1});
    }
    const total=steps.reduce((s,p)=>s+p.value,0),general=total%10||Math.floor(total/10);
    return {total,steps,general,assistant:general*3%10,samePalace:start===target};
  }
  return {palace,host:taiyiRing[host],guest:taiyiRing[guest],hostCount:count(host),guestCount:count(guest),reference:'taiyi',rulesVersion:'taiyi-palace-sum-v1'};
}

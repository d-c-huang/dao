import { trigrams, byBits, type Bits } from './data';
import { hexagramByTrigrams } from './hexagramStructure';
export const stems=[...'甲乙丙丁戊己庚辛壬癸'];
export const branches=[...'子丑寅卯辰巳午未申酉戌亥'];
export const elements=['木','火','土','金','水'];
export const stemElements=['木','木','火','火','土','土','金','金','水','水'];
export const branchElements=['水','土','木','木','土','火','火','土','金','金','土','水'];
export const animals=[...'鼠牛虎兔龙蛇马羊猴鸡狗猪'];
export const cycle=Array.from({length:60},(_,i)=>stems[i%10]+branches[i%12]);
export const mod=(a:number,n:number)=>((a%n)+n)%n;
export function integer(n:number,min:number,max:number){if(!Number.isSafeInteger(n)||n<min||n>max)throw new Error(`请输入 ${min} 至 ${max} 的整数`);return n}
export function relation(a:string,b:string){const i=elements.indexOf(a),j=elements.indexOf(b);if(i<0||j<0)throw Error('未知五行');return i===j?'比和':mod(j-i,5)===1?'我生':mod(i-j,5)===1?'生我':mod(j-i,5)===2?'我克':'克我'}
export const sixPalaces=['大安','留连','速喜','赤口','小吉','空亡'];
export function smallLiuren(month:number,day:number,hour:number){integer(month,1,12);integer(day,1,30);integer(hour,1,12);const m=mod(month-1,6),d=mod(m+day-1,6),h=mod(d+hour-1,6);return [m,d,h].map(i=>sixPalaces[i])}
const guaOrder=['乾','兑','离','震','巽','坎','艮','坤'];
export function castResult(lines:number[]){if(lines.length!==6||lines.some(n=>![6,7,8,9].includes(n)))throw Error('六爻必须分别为6、7、8或9');const bits=lines.map(n=>n%2);const changed=lines.map(n=>n===6?1:n===9?0:n%2);const find=(b:number[])=>hexagramByTrigrams(byBits(b.slice(0,3) as Bits).name,byBits(b.slice(3,6) as Bits).name);return {bits,changed,base:find(bits),transformed:find(changed),mutual:find([bits[1],bits[2],bits[3],bits[2],bits[3],bits[4]]),moving:lines.flatMap((n,i)=>n===6||n===9?[i+1]:[])}}
export function plumBlossom(year:number,month:number,day:number,hour:number){integer(year,1,12);integer(month,1,12);integer(day,1,30);integer(hour,1,12);const sum=year+month+day,total=sum+hour;const upper=trigrams.find(t=>t.name===guaOrder[mod(sum-1,8)])!,lower=trigrams.find(t=>t.name===guaOrder[mod(total-1,8)])!;const moving=mod(total-1,6)+1;const lines=[...lower.bits,...upper.bits].map((n,i)=>i===moving-1?n===1?9:6:n===1?7:8);return {...castResult(lines),sum,total,movingLine:moving,body:moving<=3?upper.name:lower.name,use:moving<=3?lower.name:upper.name}}
const lodges=[2,4,5,7,5,7,8,10,11,1];
export function bigLiuren(dayIndex:number,general:number,hour:number){integer(dayIndex,0,59);integer(general,0,11);integer(hour,0,11);const shift=mod(general-hour,12);const above=(i:number)=>mod(i+shift,12);const lodge=lodges[dayIndex%10],day=dayIndex%12;const a=above(lodge),c=above(day);const lessons=[{below:stems[dayIndex%10],above:branches[a]},{below:branches[a],above:branches[above(a)]},{below:branches[day],above:branches[c]},{below:branches[c],above:branches[above(c)]}];const start=mod(day-dayIndex%10,12);return {shift,lodge:branches[lodge],sky:branches.map((_,i)=>branches[above(i)]),lessons,voids:[branches[mod(start+10,12)],branches[mod(start+11,12)]]}}
export const taiyiPalaces=[{number:1,gua:'乾',direction:'西北'},{number:2,gua:'离',direction:'南'},{number:3,gua:'艮',direction:'东北'},{number:4,gua:'震',direction:'东'},{number:6,gua:'兑',direction:'西'},{number:7,gua:'坤',direction:'西南'},{number:8,gua:'坎',direction:'北'},{number:9,gua:'巽',direction:'东南'}];
export function taiyiFoundation(count:number,start:number){integer(count,1,Number.MAX_SAFE_INTEGER);integer(start,0,7);const index=mod(count-1,72);const palace=taiyiPalaces[mod(start+Math.floor((count-1)/3)%8,8)];return {cycle:index+1,palace,phase:['治天','治地','治人'][mod(count-1,3)],step:Math.floor((count-1)/3)%8+1}}
export const traditionReferences=[
 {title:'《尚书·洪范》：五行',url:'https://zh.wikisource.org/wiki/尚書/洪範',note:'五行的经典表述；后世五行配属须与经文区分。'},
 {title:'香港天文台：天干和地支',url:'https://www.hko.gov.hk/sc/gts/time/stemsandbranches.htm',note:'十干、十二支与六十干支的基础历法资料。'},
 {title:'《梅花易数》卷一',url:'https://zh.wikisource.org/wiki/梅花易數/卷一',note:'年月日取上卦、加时取下卦，卦除八、爻除六。'},
 {title:'《六壬大全》卷一',url:'https://zh.wikisource.org/wiki/六壬大全/1',note:'十干寄宫与起例；四课之后的三传须另按九宗门求取。'},
 {title:'《太乙金镜式经》卷二',url:'https://zh.wikisource.org/wiki/太乙金鏡式經_(四庫全書本)/卷02',note:'太乙八宫配属、三年徙一宫、不游中五。'},
 {title:'小六壬所选顺数法的公开实现',url:'https://fatboy001.github.io/Divination/',note:'现代实现参照，非古籍出处；月、日、时的起点均计作一。'}
];

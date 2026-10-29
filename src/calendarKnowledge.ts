import data from './calendar-knowledge.json';
import {branches} from './tradition';

export const calendarKnowledge=data;
export const solarTerms=data.terms;
export function branchForClock(clock:string){
  if(!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(clock))throw new RangeError('请输入00:00至23:59的钟表时间');
  const hour=Number(clock.slice(0,2)),index=Math.floor((hour+1)/2)%12;
  return {index,branch:branches[index],half:hour%2===1?'前半':'后半'};
}
export const hours24=Array.from({length:24},(_,hour)=>{
  const clock=String(hour).padStart(2,'0')+':00';
  return {clock,end:hour===23?'次日00:00':String(hour+1).padStart(2,'0')+':00',...branchForClock(clock)};
});
export function isGregorianLeapYear(year:number){
  if(!Number.isSafeInteger(year)||year<1)throw new RangeError('请输入公元正整数年份');
  return year%400===0||(year%4===0&&year%100!==0);
}
export function currentBeijingYear(){return Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Shanghai',year:'numeric'}).format(new Date()))}
export type AnnualSolarTerm=(typeof solarTerms)[number]&{at:string};
const aliases:Record<string,string>={DA_XUE:'大雪',DONG_ZHI:'冬至',XIAO_HAN:'小寒',DA_HAN:'大寒',LI_CHUN:'立春',YU_SHUI:'雨水',JING_ZHE:'惊蛰'};
export async function annualSolarTerms(year:number):Promise<AnnualSolarTerm[]>{
  if(!Number.isSafeInteger(year)||year<1901||year>2100)throw new RangeError('请输入1901—2100年的整数年份');
  const {Solar}=await import('lunar-typescript');
  const table=Solar.fromYmd(year,7,1).getLunar().getJieQiTable();
  const times=new Map<string,string>();
  for(const [key,solar] of Object.entries(table)){
    if(solar.getYear()===year)times.set(aliases[key]??key,solar.toYmdHms());
  }
  return solarTerms.map(term=>{
    const at=times.get(term.name);if(!at)throw new Error(`未取得${year}年${term.name}时刻，请核对历表`);
    return {...term,at};
  });
}

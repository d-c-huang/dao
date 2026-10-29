import {branches,cycle} from './tradition';

export const timeConvention={
  timeZone:'Asia/Shanghai',
  label:'北京时间（UTC+8）',
  dayBoundary:'00:00 换日',
  yearBoundary:'农历正月初一换年',
  generalRule:'中气交接时刻换月将',
  version:'china-civil-time-v1',
} as const;

export interface CalendarSnapshot {
  capturedAt:string;
  convention:typeof timeConvention;
  solar:string;
  lunarLabel:string;
  lunarYear:number;
  month:number;
  day:number;
  leapMonth:boolean;
  yearBranch:number;
  hourBranch:number;
  dayIndex:number;
  dayGanZhi:string;
  general:number;
  previousQi:{name:string;solar:string};
  engine:'lunar-typescript@1.8.6';
}
// 雨水亥 → 春分戌 ... 冬至丑 → 大寒子。中气，而非节令换将。
const qiGenerals:Record<string,number>={雨水:11,春分:10,谷雨:9,小满:8,夏至:7,大暑:6,处暑:5,秋分:4,霜降:3,小雪:2,冬至:1,大寒:0};

export async function calendarAt(instant:Date=new Date()):Promise<CalendarSnapshot>{
  if(!Number.isFinite(instant.getTime()))throw new RangeError('无法读取有效时间，请检查设备时钟');
  const parts=new Intl.DateTimeFormat('en-GB',{timeZone:timeConvention.timeZone,calendar:'gregory',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(instant);
  const fields=Object.fromEntries(parts.filter(p=>p.type!=='literal').map(p=>[p.type,Number(p.value)]));
  if(fields.year<1901||fields.year>2100)throw new RangeError('当前时间换算支持1901—2100年，请检查设备时钟');
  // Load only when the button is used; no remote clock or calendar request.
  const {Solar}=await import('lunar-typescript');
  const solar=Solar.fromYmdHms(fields.year,fields.month,fields.day,fields.hour,fields.minute,fields.second),lunar=solar.getLunar();
  const previousQi=lunar.getPrevQi(false),general=qiGenerals[previousQi.getName()];
  const dayGanZhi=lunar.getDayInGanZhiExact2(),dayIndex=cycle.indexOf(dayGanZhi);
  if(general===undefined||dayIndex<0)throw new Error('历法换算结果无法识别，请手动核对');
  const leapMonth=lunar.getMonth()<0;
  return {
    capturedAt:instant.toISOString(),convention:timeConvention,solar:solar.toYmdHms(),
    lunarLabel:`${lunar.getYearInGanZhi()}年 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    lunarYear:lunar.getYear(),month:Math.abs(lunar.getMonth()),day:lunar.getDay(),leapMonth,
    yearBranch:lunar.getYearZhiIndex(),hourBranch:Math.floor((fields.hour+1)/2)%12,
    dayIndex,dayGanZhi,general,previousQi:{name:previousQi.getName(),solar:previousQi.getSolar().toYmdHms()},engine:'lunar-typescript@1.8.6',
  };
}

export function timeFieldsMatch(snapshot:CalendarSnapshot,tool:number,fields:{month:number;day:number;year:number;hour:number;dateIndex:number;general:number}){
  if(tool<2)return fields.month===snapshot.month&&fields.day===snapshot.day&&fields.hour===snapshot.hourBranch&&(tool===0||fields.year===snapshot.yearBranch);
  if(tool===3)return fields.hour===snapshot.hourBranch&&fields.dateIndex===snapshot.dayIndex&&fields.general===snapshot.general;
  return true; // 钱币法与手动太乙盘位仅记录时间，不从时间生成卦/盘位。
}
export function snapshotSummary(s:CalendarSnapshot){return `${s.lunarLabel} · ${s.dayGanZhi}日 · ${branches[s.hourBranch]}时`}

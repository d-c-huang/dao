import {Clock3,RefreshCw} from 'lucide-react';
import {branches} from './tradition';
import {snapshotSummary,type CalendarSnapshot} from './traditionTime';
import './current-time.css';

export function CurrentTimeControl({snapshot,loading,error,matches,tool,onNow}:{snapshot:CalendarSnapshot|null;loading:boolean;error:string;matches:boolean;tool:number;onNow:()=>void}){
  return <section className="current-time-control" aria-label="术数时间设置">
    <div className="current-time-heading"><div><span className="eyebrow">一键设置时间</span><h3>用此刻开始演算</h3></div><button type="button" className="current-time-button" disabled={loading} onClick={onNow}>{loading?<RefreshCw size={16}/>:<Clock3 size={16}/>} {loading?'正在换算…':'使用当前时间'}</button></div>
    <p className="time-convention">读取本机时钟，统一按北京时间（UTC+8）换算；00:00换日，年支按农历正月初一切换。</p>
    <div aria-live="polite" aria-atomic="true">{error?<p role="alert">{error}</p>:snapshot?<><div className="time-snapshot"><b>{snapshot.solar}</b><span>{snapshotSummary(snapshot)}</span></div><p className="time-application">{tool===2?'已记录起卦参考时间；保留当前六爻投币结果。':tool===4?'已记录参考时间；太乙宫、文昌、始击仍按核定盘位输入。':matches?'已填入当前工具的时间参数，可继续手动修改。':'时间参数已手动调整，当前按表单值演算。'}</p>{tool===3&&<p className="time-detail">中气换将：{snapshot.previousQi.name}（{snapshot.previousQi.solar}）后用{branches[snapshot.general]}将。{!matches?'此处保留取时时的换算依据。':''}</p>}{snapshot.leapMonth&&tool<2&&<p className="time-detail">当前为闰月，依本项目规则按同名月份计数。</p>}</>:<p className="time-application">{tool<2?'点击填入农历月、日、年支和时支。':tool===3?'点击填入日干支、时支，并按中气时刻设置月将。':'点击记录当前时间，作为本次演算的参考。'}</p>}</div>
  </section>;
}

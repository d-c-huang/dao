import {calendarKnowledge} from './calendarKnowledge';
import './calendar-knowledge.css';

export function UsagePrecautions({full=false,onLearn}:{full?:boolean;onLearn?:()=>void}){
  const content=<><p className="usage-intro">先确认问题、起卦方法与时间规则，再阅读解说。保留原始记录，方便之后核验。</p><div className="usage-grid">{calendarKnowledge.precautions.map((p,i)=><article key={p.title}><span>0{i+1}</span><h3>{p.title}</h3><p>{p.summary}</p><ul>{p.details.map(d=><li key={d}>{d}</li>)}</ul></article>)}</div>{onLearn&&<button className="text-btn" onClick={onLearn}>了解时辰、节气与历法规则 ↗</button>}</>;
  if(full)return <section className="panel usage-full"><span className="eyebrow">把输入、规则与结论分别核对</span><h2>使用术数工具的注意事项</h2>{content}</section>;
  return <details className="usage-precautions"><summary>使用前先看：问题、时间与解读注意事项</summary>{content}</details>;
}

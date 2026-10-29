import type {Interpretation} from './traditionInterpretation';
import {EmbeddedResourceReader} from './EmbeddedResourceReader';
import './interpretation.css';

export function InterpretationPanel({reading:r,question,onToolChange}:{reading:Interpretation;question:string;onToolChange?:(tool:number)=>void}){
  return <section className="interpretation" aria-labelledby="interpretation-title">
    <div className="interpretation-heading"><div><span className="eyebrow">读懂当前盘面</span><h3 id="interpretation-title">结果解说</h3></div><span className="method-badge">{r.topic} · 随盘更新</span></div>
    {question.trim()&&<p className="reading-question"><b>本次所问</b>{question.trim()}</p>}
    {r.routingNote&&<p className="reading-routing">{r.routingNote}</p>}
    {r.response&&<div className="reading-answer"><span>{r.response.label}</span><p>{r.response.text}</p>{r.response.action&&onToolChange&&<button className="text-btn" onClick={()=>onToolChange(r.response!.action!.tool)}>{r.response.action.label} ↗</button>}</div>}
    <div className="reading-overview"><h4>{r.headline}</h4><p>{r.summary}</p></div>
    <div className="reading-signals">{r.signals.map((s,i)=><article key={i}><span>{String(i+1).padStart(2,'0')} · {s.label}</span><h4>{s.value}</h4><p>{s.meaning}</p></article>)}</div>
    <div className="reading-next"><h4>可以怎样参考</h4><p className="reading-label">以下为项目提供的现实观察建议</p><ul>{r.suggestions.map(s=><li key={s}>{s}</li>)}</ul></div>
    <details className="reading-notes"><summary>解说依据与适用范围</summary><p>传统含义按所列文献和当前盘面整理；观察建议由项目编写。自动模式按关键词选择已有规则，手动主题优先；不等同于对任意问题的完整语义理解。</p><ul>{r.limits.map(s=><li key={s}>{s}</li>)}</ul><p>这份解说供文化学习与反思，不确定现实事件的成败或日期。</p>{r.sources.map(s=><div className="reading-source" key={s.url}><div><a href={s.url} target="_blank" rel="noreferrer">{s.title} · 原出处 ↗</a><small>{s.locator}</small></div>{s.localPath&&<EmbeddedResourceReader path={s.localPath} title={s.title}/>}</div>)}</details>
  </section>;
}

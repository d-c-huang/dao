export function Gua({bits,size=64}:{bits:number[],size?:number}) {
 return <svg width={size} height={size*bits.length/4} viewBox={`0 0 80 ${bits.length*20}`} role="img" aria-label={[...bits].reverse().map(v=>v?'阳爻':'阴爻').join('、')}><g fill="currentColor">{[...bits].reverse().map((v,i)=>v?<rect key={i} x="4" y={i*20+3} width="72" height="9" rx=".7"/>:<g key={i}><rect x="4" y={i*20+3} width="29" height="9" rx=".7"/><rect x="47" y={i*20+3} width="29" height="9" rx=".7"/></g>)}</g></svg>;
}

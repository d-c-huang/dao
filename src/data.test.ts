import { describe, it, expect } from 'vitest';
import { trigrams, early, later, byBits, flipLine, combine } from './data';
describe('八卦结构（爻序由下往上）',()=>{
 it('覆盖全部八种三爻组合',()=>{expect(new Set(trigrams.map(t=>t.bits.join(''))).size).toBe(8);for(let n=0;n<8;n++)expect(byBits([n&1,(n>>1)&1,(n>>2)&1])).toBeDefined()});
 it('乾初爻变为巽，上爻变为兑，重复变爻复原',()=>{expect(byBits(flipLine([1,1,1],0)).name).toBe('巽');expect(byBits(flipLine([1,1,1],2)).name).toBe('兑');for(const t of trigrams)for(let i=0;i<3;i++)expect(flipLine(flipLine(t.bits,i),i)).toEqual(t.bits)});
 it('上下卦生成六十四种唯一结构，并保留下卦在前的爻序',()=>{const all=trigrams.flatMap(l=>trigrams.map(u=>combine(l.bits,u.bits).join('')));expect(new Set(all).size).toBe(64);expect(combine([0,0,0],[1,1,1])).toEqual([0,0,0,1,1,1])});
 it('先后天图完整且采用南上北下方位',()=>{expect(new Set(early).size).toBe(8);expect(new Set(later).size).toBe(8);expect([early[0],early[4],early[6],early[2]]).toEqual(['乾','坤','离','坎']);expect([later[0],later[4],later[6],later[2]]).toEqual(['离','坎','震','兑'])});
});

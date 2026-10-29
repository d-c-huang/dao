import {describe,it,expect} from 'vitest';
import {hexagramReasoningCases,buildHexagramOutline} from './hexagramReasoning';
import {hexagrams} from './hexagrams';
import {pages,pageFromHash} from './navigation';
describe('六十四卦情境推理',()=>{
 it('64卦全部有独立情境、专问、核验行动与正确上下卦维度',()=>{expect(hexagramReasoningCases).toHaveLength(64);expect(new Set(hexagramReasoningCases.map(h=>h.question)).size).toBe(64);expect(new Set(hexagramReasoningCases.map(h=>h.situation)).size).toBe(64);for(const h of hexagramReasoningCases){expect(h.inner.trigram).toBe(h.lower);expect(h.outer.trigram).toBe(h.upper);expect(h.verification.length).toBeGreaterThan(15);expect(h.sourceUrl).toBe(hexagrams.find(g=>g.number===h.number)!.sourceUrl)}});
 it('按选卦生成并去重，保留情境专问和出处，不把经典当实际问题证据',()=>{const r=buildHexagramOutline({goal:'  核验交付  ',evidence:'待核验的笔记',hexagramNumbers:[64,63,63]});expect(r.goal).toBe('核验交付');expect(r.cases.map(h=>h.number)).toEqual([63,64]);expect(r.prompt).toContain('完成后维护');expect(r.prompt).toContain('未完成与衔接');expect(r.prompt).toContain('只有实际执行后，才能报告结果');expect(r.prompt).toContain('用户材料（待核验）');expect(r.prompt).toContain('不作为事实论证依据');expect(r.prompt).toContain(hexagrams[62].sourceUrl);expect(r.prompt).not.toContain('初创与困难')});
 it('可覆盖全部64情境，拒绝空任务、空选择、非法卦号',()=>{expect(buildHexagramOutline({goal:'比较',hexagramNumbers:hexagrams.map(h=>h.number)}).cases).toHaveLength(64);expect(()=>buildHexagramOutline({goal:' ',hexagramNumbers:[1]})).toThrow();expect(()=>buildHexagramOutline({goal:'比较',hexagramNumbers:[]})).toThrow();for(const n of [0,65,1.5,NaN])expect(()=>buildHexagramOutline({goal:'比较',hexagramNumbers:[n]})).toThrow()});
 it('导航、旧深链接都进入六十四卦与AI页面',()=>{expect(pages.some(p=>p.name==='六十四卦与AI推理')).toBe(true);expect(pageFromHash('#ai-reasoning')).toBe('六十四卦与AI推理')});
});

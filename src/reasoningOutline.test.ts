import { describe, expect, it } from 'vitest';
import { buildReasoningOutline, reasoningPerspectives } from './reasoningOutline';
import { trigrams } from './data';

describe('八视角离线提纲', () => {
  it('八个观察标签对应不同卦象，覆盖已有八卦', () => {
    expect(new Set(reasoningPerspectives.map(p => p.id)).size).toBe(8);
    expect(reasoningPerspectives.map(p => p.trigram).sort()).toEqual(trigrams.map(t => t.name).sort());
  });

  it('用户选择决定提纲内容，去重且保留统一的阅读顺序', () => {
    const outline = buildReasoningOutline({ goal: '  核对一条文化史说法  ', perspectiveIds: ['li', 'qian', 'li'] });
    expect(outline.goal).toBe('核对一条文化史说法');
    expect(outline.perspectives.map(p => p.id)).toEqual(['qian', 'li']);
    expect(outline.prompt).toContain('乾 · 目标与假设');
    expect(outline.prompt).toContain('离 · 证据与解释');
    expect(outline.prompt).not.toContain('震 · 最小实验');
    expect(outline.prompt.match(/离 · 证据与解释/g)).toHaveLength(1);
  });

  it('材料留在未核验状态，缺失材料不会凭空变成事实或来源', () => {
    const supplied = buildReasoningOutline({ goal: '比较两种解释', evidence: '  一段尚无出处的笔记  ', perspectiveIds: ['kan'] });
    expect(supplied.evidence).toBe('一段尚无出处的笔记');
    expect(supplied.prompt).toContain('# 用户提供的材料（尚未核验）\n一段尚无出处的笔记');
    expect(supplied.prompt).toContain('只有实际执行后，才能报告其结果');
    const empty = buildReasoningOutline({ goal: '研究卦序', evidence: ' ', perspectiveIds: ['li'] });
    expect(empty.evidence).toBe('');
    expect(empty.prompt).toContain('尚未提供材料');
    expect(empty.prompt).not.toContain('https://');
    expect(empty.prompt).toContain('不作为论证依据');
  });

  it('空任务、空视角和未知视角不能生成貌似完整的提纲', () => {
    expect(() => buildReasoningOutline({ goal: '\n ', perspectiveIds: ['qian'] })).toThrow('请先写下');
    expect(() => buildReasoningOutline({ goal: '验证', perspectiveIds: [] })).toThrow('至少选择');
    expect(() => buildReasoningOutline({ goal: '验证', perspectiveIds: ['unknown'] })).toThrow('未知');
  });
});

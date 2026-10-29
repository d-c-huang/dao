import { describe, expect, it } from 'vitest';
import { byBits, combine, trigrams, type Bits } from './data';
import { binaryLabel, complementBits, cubeEdges, encodeBits, hammingDistance, reverseBits } from './math';

describe('现代二进制编码（初爻权重为 1）', () => {
  it('全部八卦有明确的整数和高位在左的二进制标签', () => {
    const expected: [string, number, string][] = [
      ['坤', 0, '000'], ['震', 1, '001'], ['坎', 2, '010'], ['兑', 3, '011'],
      ['艮', 4, '100'], ['离', 5, '101'], ['巽', 6, '110'], ['乾', 7, '111'],
    ];
    for (const [name, value, label] of expected) {
      const bits = trigrams.find(trigram => trigram.name === name)!.bits;
      expect(encodeBits(bits)).toBe(value);
      expect(binaryLabel(bits)).toBe(label);
    }
  });

  it('六十四种上下卦保留下卦的低三位、上卦的高三位', () => {
    const values = new Set<number>();
    for (const lower of trigrams) for (const upper of trigrams) {
      const lines = combine(lower.bits, upper.bits);
      const value = encodeBits(lines);
      expect(value).toBe(encodeBits(lower.bits) + 8 * encodeBits(upper.bits));
      expect(binaryLabel(lines)).toBe(binaryLabel(upper.bits) + binaryLabel(lower.bits));
      values.add(value);
    }
    expect([...values].sort((a, b) => a - b)).toEqual(Array.from({ length: 64 }, (_, value) => value));
  });

  it('拒绝非二进制输入以及不能保证安全整数的长度', () => {
    for (const invalid of [[], [0, 2, 1], [1, NaN, 0], Array(3), Array(54).fill(1)]) {
      expect(() => encodeBits(invalid)).toThrow();
      expect(() => binaryLabel(invalid)).toThrow();
    }
    expect(encodeBits(Array(53).fill(1))).toBe(Number.MAX_SAFE_INTEGER);
  });
});

describe('互补与倒序是两种不同的变换', () => {
  it('得到不同的对应卦，且都不修改原数组', () => {
    const bits: Bits = [1, 0, 0];
    expect(byBits(complementBits(bits)).name).toBe('巽');
    expect(byBits(reverseBits(bits)).name).toBe('艮');
    expect(bits).toEqual([1, 0, 0]);
  });

  it('互补配对与倒序不动点符合三爻结构', () => {
    const complementPairs = [['乾', '坤'], ['兑', '艮'], ['离', '坎'], ['震', '巽']];
    for (const [name, complement] of complementPairs) {
      expect(byBits(complementBits(trigrams.find(trigram => trigram.name === name)!.bits)).name).toBe(complement);
    }
    expect(trigrams.filter(trigram => reverseBits(trigram.bits).every((bit, i) => bit === trigram.bits[i]))
      .map(trigram => trigram.name).sort()).toEqual(['乾', '坎', '坤', '离'].sort());
    for (const { bits } of trigrams) {
      expect(complementBits(complementBits(bits))).toEqual(bits);
      expect(reverseBits(reverseBits(bits))).toEqual(bits);
      expect(complementBits(reverseBits(bits))).toEqual(reverseBits(complementBits(bits)));
      expect(hammingDistance(bits, complementBits(bits))).toBe(3);
    }
  });
});

describe('八卦的立方体关系图', () => {
  it('十二条无重复无向边连接全部八个顶点，每个顶点有三个邻居', () => {
    expect(cubeEdges).toHaveLength(12);
    expect(new Set(cubeEdges.map(edge => [...edge].sort().join('/'))).size).toBe(12);
    for (const [a, b] of cubeEdges) {
      const first = trigrams.find(trigram => trigram.name === a)!;
      const second = trigrams.find(trigram => trigram.name === b)!;
      expect(hammingDistance(first.bits, second.bits)).toBe(1);
    }
    for (const trigram of trigrams) {
      expect(cubeEdges.filter(edge => edge.includes(trigram.name))).toHaveLength(3);
    }
  });

  it('任意两卦的最短单爻变化路径长度等于汉明距离', () => {
    for (const start of trigrams) {
      const distances = new Map<string, number>([[start.name, 0]]);
      const queue = [start.name];
      while (queue.length) {
        const name = queue.shift()!;
        for (const edge of cubeEdges.filter(edge => edge.includes(name))) {
          const next = edge[0] === name ? edge[1] : edge[0];
          if (!distances.has(next)) {
            distances.set(next, distances.get(name)! + 1);
            queue.push(next);
          }
        }
      }
      for (const end of trigrams) {
        const distance = hammingDistance(start.bits, end.bits);
        expect(distance).toBe(hammingDistance(end.bits, start.bits));
        expect(distances.get(end.name)).toBe(distance);
        expect(distance === 0).toBe(start.name === end.name);
      }
    }
  });
});

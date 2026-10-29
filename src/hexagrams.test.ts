import { describe, expect, it } from 'vitest';
import { trigrams } from './data';
import { hexagrams } from './hexagrams';
import { hexagramBits, hexagramByTrigrams } from './hexagramStructure';
import { encodeBits } from './math';

const canonicalNames = [
  '乾', '坤', '屯', '蒙', '需', '讼', '师', '比', '小畜', '履',
  '泰', '否', '同人', '大有', '谦', '豫', '随', '蛊', '临', '观',
  '噬嗑', '贲', '剥', '复', '无妄', '大畜', '颐', '大过', '坎', '离',
  '咸', '恒', '遁', '大壮', '晋', '明夷', '家人', '睽', '蹇', '解',
  '损', '益', '夬', '姤', '萃', '升', '困', '井', '革', '鼎',
  '震', '艮', '渐', '归妹', '丰', '旅', '巽', '兑', '涣', '节',
  '中孚', '小过', '既济', '未济',
];

// Independently checked against the source's glyph/name lookup, transposed so
// rows are UPPER and columns LOWER: https://zh.wikisource.org/zh-hans/周易
// Source rows are lower trigrams; this explicit fixture catches swapping them.
const matrixOrder = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤'];
const canonicalMatrix = [
  [1, 10, 13, 25, 44, 6, 33, 12],
  [43, 58, 49, 17, 28, 47, 31, 45],
  [14, 38, 30, 21, 50, 64, 56, 35],
  [34, 54, 55, 51, 32, 40, 62, 16],
  [9, 61, 37, 42, 57, 59, 53, 20],
  [5, 60, 63, 3, 48, 29, 39, 8],
  [26, 41, 22, 27, 18, 4, 52, 23],
  [11, 19, 36, 24, 46, 7, 15, 2],
];

describe('六十四卦的通行卦序与上下卦', () => {
  it('按通行卦序完整覆盖六十四个不同卦名', () => {
    expect(hexagrams).toHaveLength(64);
    expect(hexagrams.map(hexagram => hexagram.number)).toEqual(
      Array.from({ length: 64 }, (_, index) => index + 1),
    );
    expect(hexagrams.map(hexagram => hexagram.name)).toEqual(canonicalNames);
    expect(new Set(hexagrams.map(hexagram => hexagram.name)).size).toBe(64);
  });

  it('八乘八上下卦组合与独立核对的卦序矩阵逐项一致', () => {
    for (let row = 0; row < matrixOrder.length; row++) {
      for (let column = 0; column < matrixOrder.length; column++) {
        const matches = hexagrams.filter(hexagram =>
          hexagram.upper === matrixOrder[row] && hexagram.lower === matrixOrder[column],
        );
        expect(matches, `上${matrixOrder[row]}下${matrixOrder[column]}`).toHaveLength(1);
        expect(matches[0].number).toBe(canonicalMatrix[row][column]);
        expect(hexagramByTrigrams(matrixOrder[column], matrixOrder[row]).number)
          .toBe(canonicalMatrix[row][column]);
      }
    }
  });

  it('六爻结构穷尽全部六十四种二值组合，且不把编码当作卦序', () => {
    const values = hexagrams.map(hexagram => {
      const lower = trigrams.find(trigram => trigram.name === hexagram.lower);
      const upper = trigrams.find(trigram => trigram.name === hexagram.upper);
      expect(lower).toBeDefined();
      expect(upper).toBeDefined();
      const bits = hexagramBits(hexagram);
      expect(bits).toHaveLength(6);
      return encodeBits(bits);
    });
    expect([...values].sort((a, b) => a - b)).toEqual(
      Array.from({ length: 64 }, (_, value) => value),
    );
    // The first received hexagram, 乾, has binary code 63 rather than 1.
    expect(values[0]).toBe(63);
    expect(values[1]).toBe(0);
    expect(hexagramBits(hexagrams.find(hexagram => hexagram.number === 63)!))
      .toEqual([1, 0, 1, 0, 1, 0]);
    expect(hexagramBits(hexagrams.find(hexagram => hexagram.number === 64)!))
      .toEqual([0, 1, 0, 1, 0, 1]);
  });

  it('查卦拒绝不存在的卦名，避免默默返回错误卦象', () => {
    expect(() => hexagramByTrigrams('不存在', '乾')).toThrow(RangeError);
    expect(() => hexagramByTrigrams('乾', '不存在')).toThrow(RangeError);
    expect(() => hexagramBits({ ...hexagrams[0], lower: '不存在' })).toThrow(RangeError);
  });

  it('卦名的多音字采用核对过的读音', () => {
    // MOE 國語辭典簡編本: 觀 entry 17474; 解 entry 22186.
    const expected = [[3, 'zhūn'], [12, 'pǐ'], [20, 'guàn'], [22, 'bì'], [40, 'jiě']] as const;
    for (const [number, pronunciation] of expected) {
      expect(hexagrams.find(hexagram => hexagram.number === number)!.pinyin.toLowerCase())
        .toBe(pronunciation);
    }
  });

  it('易混的上下卦及既济未济方向与原文标记一致', () => {
    const expected = [
      [1, '乾', '乾', '乾'], [2, '坤', '坤', '坤'],
      [3, '屯', '震', '坎'], [4, '蒙', '坎', '艮'],
      [11, '泰', '乾', '坤'], [12, '否', '坤', '乾'],
      [63, '既济', '离', '坎'], [64, '未济', '坎', '离'],
    ] as const;
    for (const [number, name, lower, upper] of expected) {
      expect(hexagrams.find(hexagram => hexagram.number === number)).toMatchObject({
        name, lower, upper,
      });
    }
  });

  it('每卦均包含可离线阅读的经文、传文、解释及具体原文出处', () => {
    const sourcePaths = new Set<string>();
    for (const hexagram of hexagrams) {
      expect(hexagram.judgment.trim(), `${hexagram.name}缺少卦辞`).not.toBe('');
      expect(hexagram.imageText.trim(), `${hexagram.name}缺少大象传`).not.toBe('');
      expect(hexagram.summary.trim(), `${hexagram.name}缺少项目释义`).not.toBe('');
      expect(hexagram.traditionalName.trim()).not.toBe('');
      expect(hexagram.pinyin.trim()).not.toBe('');
      expect(hexagram.title).toContain(hexagram.name);
      expect(hexagram.keywords.length).toBeGreaterThan(0);
      const url = new URL(hexagram.sourceUrl);
      expect(url.protocol).toBe('https:');
      expect(url.hostname).toBe('zh.wikisource.org');
      expect(decodeURIComponent(url.pathname)).toMatch(/\/周易\/.+/);
      sourcePaths.add(url.pathname);
    }
    // Source links locate individual hexagrams, rather than repeating one index.
    expect(sourcePaths.size).toBe(64);
  });
});

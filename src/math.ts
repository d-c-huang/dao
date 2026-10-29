import { trigrams, type Bits } from './data';

function validateBits(bits: number[], length?: number): void {
  if (!Array.isArray(bits) || bits.length < 1 || bits.length > 53 || (length !== undefined && bits.length !== length)) {
    throw new RangeError(length === undefined ? 'Expected 1–53 binary lines' : `Expected ${length} binary lines`);
  }
  for (const bit of bits) {
    if (bit !== 0 && bit !== 1) throw new TypeError('Each line must be 0 (yin) or 1 (yang)');
  }
}

/**
 * Modern positional encoding, not a traditional trigram or hexagram number.
 * Arrays run bottom-to-top: the first (lowest) line has weight 1, then 2, 4, ….
 * At most 53 lines keep every encoded value within JavaScript's safe integers.
 */
export function encodeBits(bits: number[]): number {
  validateBits(bits);
  return bits.reduce((value, bit, index) => value + bit * 2 ** index, 0);
}

/** Standard binary notation reads highest weight first, opposite to the stored line order. */
export function binaryLabel(bits: number[]): string {
  validateBits(bits);
  return [...bits].reverse().join('');
}

/** Exchange yin and yang at each position without changing bottom-to-top order. */
export function complementBits(bits: Bits): Bits {
  validateBits(bits, 3);
  return bits.map(bit => 1 - bit) as Bits;
}

/** Exchange the first and third lines; keep the middle line in place. */
export function reverseBits(bits: Bits): Bits {
  validateBits(bits, 3);
  return [bits[2], bits[1], bits[0]];
}

/** Number of corresponding lines that differ, equal to the minimum single-line changes. */
export function hammingDistance(a: Bits, b: Bits): number {
  validateBits(a, 3);
  validateBits(b, 3);
  return a.reduce((distance, bit, index) => distance + Number(bit !== b[index]), 0);
}

/** Each unordered edge joins exactly two trigrams differing at one line: the 3-cube graph. */
export const cubeEdges: [string, string][] = trigrams.flatMap((trigram, index) =>
  trigrams.slice(index + 1)
    .filter(other => hammingDistance(trigram.bits, other.bits) === 1)
    .map(other => [trigram.name, other.name] as [string, string]),
);

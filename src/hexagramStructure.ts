import { combine, trigrams } from './data';
import { hexagrams, type Hexagram } from './hexagrams';

/** Names identify an ordered pair: lower lines come first in the stored array. */
export function hexagramByTrigrams(lower: string, upper: string): Hexagram {
 const hexagram = hexagrams.find(h => h.lower === lower && h.upper === upper);
 if (!hexagram) throw new RangeError(`Unknown trigram pair: ${lower}/${upper}`);
 return hexagram;
}

/** Six lines in bottom-to-top order, consistent with data.ts and the SVG renderer. */
export function hexagramBits(hexagram: Hexagram): number[] {
 const lower = trigrams.find(t => t.name === hexagram.lower);
 const upper = trigrams.find(t => t.name === hexagram.upper);
 if (!lower || !upper) throw new RangeError('Unknown component trigram');
 return combine(lower.bits, upper.bits);
}

import { SCORING } from '../constants/config';
import type { Level } from './levels';

export type Tile = {
  /** Stable identity so the tray can be shuffled without React losing track. */
  id: string;
  letter: string;
  points: number;
  tilt: string;
};

/** Scrabble-ish value, purely decorative on the crate corner. */
const POINTS: Record<string, number> = {
  A: 1, E: 1, I: 1, O: 1, U: 1, L: 1, N: 1, S: 1, R: 1, T: 1,
  D: 2, G: 2,
  B: 3, C: 3, M: 3, P: 3,
  F: 4, H: 4, V: 4, W: 4, Y: 4,
  K: 5,
  J: 8, X: 8,
  Q: 10, Z: 10,
};

export function letterPoints(letter: string): number {
  return POINTS[letter] ?? 1;
}

const TILTS = ['-1deg', '0deg', '1deg', '0deg'];

export function buildTiles(letters: string): Tile[] {
  return letters.split('').map((letter, i) => ({
    id: `${letter}-${i}`,
    letter,
    points: letterPoints(letter),
    tilt: TILTS[i % TILTS.length],
  }));
}

/** Fisher-Yates - returns a new array, never mutates the input. */
export function shuffleTiles(tiles: Tile[]): Tile[] {
  const out = tiles.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}

export type SubmitResult =
  | { kind: 'accepted'; word: string; slotIndex: number; gained: number; bonus: boolean }
  | { kind: 'duplicate'; word: string }
  | { kind: 'no-slot'; word: string }
  | { kind: 'rejected'; word: string };

export function emptySlotIndexFor(
  plan: number[],
  found: Record<number, string>,
  length: number,
): number {
  for (let i = 0; i < plan.length; i++) {
    if (plan[i] === length && !found[i]) {
      return i;
    }
  }
  return -1;
}

export function evaluateWord(
  level: Level,
  found: Record<number, string>,
  word: string,
): SubmitResult {
  if (word.length < 3) {
    return { kind: 'rejected', word };
  }
  if (!level.solutions.includes(word)) {
    return { kind: 'rejected', word };
  }
  const alreadyFound = Object.keys(found).some(k => found[Number(k)] === word);
  if (alreadyFound) {
    return { kind: 'duplicate', word };
  }
  const slot = emptySlotIndexFor(level.plan, found, word.length);
  if (slot < 0) {
    return { kind: 'no-slot', word };
  }
  const bonus = word.length === level.letters.length;
  const gained = word.length + (bonus ? SCORING.bonusDeparture : 0);
  return { kind: 'accepted', word, slotIndex: slot, gained, bonus };
}

export function longestWord(words: string[]): string {
  return words.reduce((best, w) => (w.length > best.length ? w : best), '');
}

export function isComplete(plan: number[], found: Record<number, string>): boolean {
  return plan.every((_, i) => !!found[i]);
}

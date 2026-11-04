import { useCallback, useMemo, useRef, useState } from 'react';
import { Vibration } from 'react-native';
import { HAPTIC_MS, SCORING } from '../constants/config';
import type { Level } from '../game/levels';
import {
  buildTiles,
  evaluateWord,
  isComplete,
  shuffleTiles,
  type SubmitResult,
  type Tile,
} from '../game/wordLogic';

export type StripState = 'idle' | 'building' | 'rejected' | 'duplicate';

export type WordGame = {
  tiles: Tile[];
  /** ids of the tiles currently sitting in the word strip, in tap order */
  picked: string[];
  word: string;
  found: Record<number, string>;
  foundWords: string[];
  crates: number;
  bonus: boolean;
  complete: boolean;
  stripState: StripState;
  lastResult: SubmitResult | null;
  tapTile: (id: string) => void;
  undo: () => void;
  clear: () => void;
  shuffle: () => void;
  submit: () => SubmitResult | null;
  reset: (level: Level) => void;
};

/**
 * All gameplay state for one level. Mutable animation data lives in the callers'
 * refs - this hook only owns the ground truth (rule: state = ground truth).
 */
export function useWordGame(level: Level, startingCrates: number): WordGame {
  const [tiles, setTiles] = useState<Tile[]>(() => buildTiles(level.letters));
  const [picked, setPicked] = useState<string[]>([]);
  const [found, setFound] = useState<Record<number, string>>({});
  const [crates, setCrates] = useState(startingCrates);
  const [bonus, setBonus] = useState(false);
  const [stripState, setStripState] = useState<StripState>('idle');
  const [lastResult, setLastResult] = useState<SubmitResult | null>(null);

  const levelRef = useRef(level);
  levelRef.current = level;

  const tileById = useMemo(() => {
    const map: Record<string, Tile> = {};
    for (const t of tiles) {
      map[t.id] = t;
    }
    return map;
  }, [tiles]);

  const word = useMemo(
    () => picked.map(id => tileById[id]?.letter ?? '').join(''),
    [picked, tileById],
  );

  const foundWords = useMemo(
    () => Object.keys(found)
      .map(Number)
      .sort((a, b) => a - b)
      .map(i => found[i]),
    [found],
  );

  const complete = useMemo(
    () => isComplete(level.plan, found),
    [level.plan, found],
  );

  const tapTile = useCallback((id: string) => {
    setPicked(prev => (prev.includes(id) ? prev : prev.concat(id)));
    setStripState('building');
  }, []);

  const undo = useCallback(() => {
    setPicked(prev => prev.slice(0, -1));
    setStripState(prev => (prev === 'rejected' || prev === 'duplicate' ? 'building' : prev));
  }, []);

  const clear = useCallback(() => {
    setPicked([]);
    setStripState('idle');
  }, []);

  const shuffle = useCallback(() => {
    setTiles(prev => shuffleTiles(prev));
  }, []);

  const submit = useCallback((): SubmitResult | null => {
    const current = levelRef.current;
    const letters = picked.map(id => tileById[id]?.letter ?? '').join('');
    if (!letters) {
      return null;
    }
    const result = evaluateWord(current, found, letters);
    setLastResult(result);

    if (result.kind === 'accepted') {
      const nextFound = { ...found, [result.slotIndex]: result.word };
      const finished = isComplete(current.plan, nextFound);
      setFound(nextFound);
      setCrates(c => c + result.gained + (finished ? SCORING.levelComplete : 0));
      if (result.bonus) {
        setBonus(true);
      }
      setPicked([]);
      setStripState('idle');
      Vibration.vibrate(HAPTIC_MS);
    } else if (result.kind === 'duplicate' || result.kind === 'no-slot') {
      setStripState('duplicate');
    } else {
      setStripState('rejected');
    }
    return result;
  }, [picked, tileById, found]);

  const reset = useCallback((next: Level) => {
    levelRef.current = next;
    setTiles(buildTiles(next.letters));
    setPicked([]);
    setFound({});
    setBonus(false);
    setStripState('idle');
    setLastResult(null);
  }, []);

  return {
    tiles,
    picked,
    word,
    found,
    foundWords,
    crates,
    bonus,
    complete,
    stripState,
    lastResult,
    tapTile,
    undo,
    clear,
    shuffle,
    submit,
    reset,
  };
}

export default useWordGame;

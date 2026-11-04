import { Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export { SCREEN_W, SCREEN_H };

/** Splash duration - EXACTLY 8000ms (rule #13). */
export const LOADER_DURATION_MS = 8000;

/** Screen chrome */
export const STATUS_PAD = 44;
export const HEADER_BODY_H = 56;
export const HEADER_H = STATUS_PAD + HEADER_BODY_H; // 100
export const STAT_STRIP_H = 42;

/** Board geometry - frame-aware (rule #4/#5) */
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const BOARD_PAD = 10;
export const BOARD_BORDER = 2;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER; // 12
export const SLOT_GAP = 6;
export const SLOT_ROW_GAP = SCREEN_H < 720 ? 4 : 8;
export const SLOT_COLS = 8; // longest word
export const MAX_SLOT_ROWS = 5;

/** Letter tray geometry */
export const TRAY_COLS = 4;
export const TILE_GAP = 8;
export const TRAY_PAD = 10;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export const TILE = clamp(
  Math.min(
    56,
    Math.floor((BOARD_MAX_W - 2 * TRAY_PAD - (TRAY_COLS - 1) * TILE_GAP) / TRAY_COLS),
    Math.floor(SCREEN_H * 0.072),
  ),
  40,
  56,
);

export const TRAY_W = TILE * TRAY_COLS + (TRAY_COLS - 1) * TILE_GAP + 2 * TRAY_PAD;

export const ACTION_ROW_H = 56;
export const CONTROLS_H =
  12 + TILE * 2 + TILE_GAP + 12 + ACTION_ROW_H + 16; // paddingTop + tray + gap + actionRow + paddingBottom

export const SHIP_DECK_H = clamp(Math.floor(SCREEN_H * 0.125), 76, 112);
export const WORD_STRIP_H = clamp(Math.floor(SCREEN_H * 0.058), 38, 46);

/** Height left for the slot board after every fixed block is reserved. */
const BOARD_SPACE =
  SCREEN_H - HEADER_H - STAT_STRIP_H - CONTROLS_H - SHIP_DECK_H - WORD_STRIP_H - 36;

export const SLOT = clamp(
  Math.min(
    36,
    Math.floor((BOARD_MAX_W - 2 * BOARD_FRAME - (SLOT_COLS - 1) * SLOT_GAP) / SLOT_COLS),
    Math.floor((BOARD_SPACE - 2 * BOARD_FRAME) / MAX_SLOT_ROWS) - SLOT_ROW_GAP,
  ),
  18,
  36,
);

export const BOARD_W = SLOT * SLOT_COLS + (SLOT_COLS - 1) * SLOT_GAP + 2 * BOARD_FRAME;

/** Timings (ms) */
export const TIMING = {
  fade: 300,
  screenFade: 320,
  tileLift: 100,
  tileSnap: 150,
  slotFill: 220,
  crateHop: 300,
  wobble: 160,
  wave: 6000,
  bob: 2600,
  depart: 1200,
  bonusGlow: 600,
  counterPulse: 260,
};

/** Scoring - "crates" are cosmetic progress only. No money, no ads, no purchases. */
export const SCORING = {
  bonusDeparture: 50,
  levelComplete: 25,
};

export const HAPTIC_MS = 12;

/** Docks = difficulty (letters / slots) */
export type DockId = 'north' | 'pier' | 'deep';

export const DOCKS: { id: DockId; label: string; blurb: string }[] = [
  { id: 'north', label: 'NORTH DOCK', blurb: '6 LETTERS' },
  { id: 'pier', label: 'OLD PIER', blurb: '7 LETTERS' },
  { id: 'deep', label: 'DEEP WATER', blurb: '8 LETTERS' },
];

export const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

import type { DockId } from '../constants/config';

export type Level = {
  id: string;
  dock: DockId;
  /** The letter crates handed to the player. */
  letters: string;
  /** Slot lengths on the board - always distinct, longest last. */
  plan: number[];
  /** Every accepted word. Must cover each plan length at least once. */
  solutions: string[];
  /** One-line dock note shown in the Captain's Log. */
  note: string;
};

export const LEVELS: Level[] = [
  {
    id: 'north-1',
    dock: 'north',
    letters: 'ANCHOR',
    plan: [3, 4, 5, 6],
    solutions: [
      'CAN', 'CAR', 'ARC', 'OAR', 'RAN', 'NOR', 'CON', 'HOC',
      'CHAR', 'HORN', 'ARCH', 'CORN', 'ROAN', 'NACHO',
      'RANCH', 'ANCHO', 'ANCHOR',
    ],
    note: 'Held fast off the north quay.',
  },
  {
    id: 'north-2',
    dock: 'north',
    letters: 'SAILOR',
    plan: [3, 4, 5, 6],
    solutions: [
      'AIR', 'OIL', 'SIR', 'OAR', 'ORS', 'RIA',
      'RAIL', 'SAIL', 'OILS', 'ORAL', 'SOIL', 'LAIR', 'LIAR', 'ALSO',
      'SOLAR', 'ORALS', 'SAILOR',
    ],
    note: 'Signed on for the morning tide.',
  },
  {
    id: 'north-3',
    dock: 'north',
    letters: 'HARBOR',
    plan: [3, 4, 5, 6],
    solutions: [
      'BAR', 'OAR', 'ROB', 'ORB', 'BRA', 'HOB', 'RAH',
      'BOAR', 'ROAR', 'ABHOR', 'ARBOR', 'HARBOR',
    ],
    note: 'Safe water behind the sea wall.',
  },
  {
    id: 'pier-1',
    dock: 'pier',
    letters: 'CAPTAIN',
    plan: [3, 4, 5, 6, 7],
    solutions: [
      'CAN', 'CAP', 'ANT', 'TAN', 'TIP', 'PIT', 'PAN', 'NAP', 'APT', 'TIC', 'NIP', 'ACT',
      'PACT', 'ANTI', 'PAIN', 'PINT', 'PANT', 'TAPA',
      'PAINT', 'INAPT', 'ANTIC', 'PANIC',
      'CATNIP', 'CAPTAIN',
    ],
    note: 'Keeps the ledger and the keys.',
  },
  {
    id: 'pier-2',
    dock: 'pier',
    letters: 'SEAPORT',
    plan: [3, 4, 5, 6, 7],
    solutions: [
      'SEA', 'EAT', 'OAR', 'APE', 'PRO', 'TOP', 'POT', 'TAR', 'RAT', 'ORE', 'ERA', 'SAP',
      'PEAR', 'PEAT', 'ROSE', 'STAR', 'RATE', 'TEAR', 'PORE', 'ROPE', 'SPAT',
      'SPORE', 'PASTE', 'OPERA', 'PEARS', 'TAPES',
      'POSTER', 'PRESTO', 'SEAPORT',
    ],
    note: 'Where the long-haul freight ties up.',
  },
  {
    id: 'pier-3',
    dock: 'pier',
    letters: 'PELICAN',
    plan: [3, 4, 5, 6, 7],
    solutions: [
      'ICE', 'PEN', 'PAL', 'CAP', 'CAN', 'NAP', 'LIE', 'PIE', 'PIN', 'NIL', 'ACE', 'APE', 'LAP', 'PAN',
      'PACE', 'LACE', 'LANE', 'PLAN', 'PILE', 'PINE', 'NICE', 'PANE', 'CLIP', 'PAIL', 'PAIN', 'LIEN', 'CANE',
      'PLACE', 'PANIC', 'PENAL', 'PLAIN', 'CLEAN', 'PLANE',
      'PENCIL', 'PELICAN',
    ],
    note: 'Perched on the old pier bollard.',
  },
  {
    id: 'deep-1',
    dock: 'deep',
    letters: 'MOORINGS',
    plan: [3, 4, 5, 7, 8],
    solutions: [
      'SIN', 'RIM', 'GIN', 'ION', 'SON', 'RIG', 'GOO', 'NOR', 'ORS', 'MOO',
      'IRON', 'GRIM', 'SIGN', 'RING', 'ROOM', 'MOON', 'SOON', 'GRIN', 'MOOR', 'GOON',
      'MINOR', 'GROIN', 'ROOMS', 'MOORS', 'ROSIN',
      'MOORING', 'MOORINGS',
    ],
    note: 'Deep-water berths, four fathoms.',
  },
  {
    id: 'deep-2',
    dock: 'deep',
    letters: 'NAVIGATE',
    plan: [3, 4, 5, 6, 8],
    solutions: [
      'ATE', 'EAT', 'TAN', 'TEA', 'AGE', 'VAN', 'NET', 'TIE', 'AIT', 'VIA', 'GIN', 'TIN', 'ANT', 'VAT',
      'GATE', 'GAIN', 'VINE', 'VAIN', 'ANTE', 'NEAT', 'GAVE', 'VENT', 'TINA',
      'GIANT', 'AGENT', 'VEGAN', 'GIVEN',
      'NATIVE', 'VINTAGE', 'NAVIGATE',
    ],
    note: 'Chart, compass, and a steady hand.',
  },
  {
    id: 'deep-3',
    dock: 'deep',
    letters: 'SHIPYARD',
    plan: [3, 4, 5, 6, 8],
    solutions: [
      'AIR', 'DRY', 'SIR', 'SHY', 'HIP', 'RIP', 'DIP', 'SIP', 'PAY', 'DAY', 'RAY', 'SAD', 'HAS', 'HID',
      'YARD', 'RAID', 'HAIR', 'PAIR', 'HARP', 'SHIP', 'DISH', 'DRIP', 'SPAR', 'DAIS',
      'DAIRY', 'RAPID', 'HARPS', 'DIARY', 'PRAYS',
      'RAPIDS', 'SHIPYARD',
    ],
    note: 'Sparks and sawdust all day long.',
  },
];

/** Harbor Master - the daily 8-letter puzzle, one single slot, one answer. */
export const DAILY: Level[] = [
  {
    id: 'daily-lighthouse',
    dock: 'deep',
    letters: 'SEASHORE',
    plan: [8],
    solutions: ['SEASHORE'],
    note: 'Harbor Master daily puzzle.',
  },
  {
    id: 'daily-mariners',
    dock: 'deep',
    letters: 'MARINERS',
    plan: [8],
    solutions: ['MARINERS'],
    note: 'Harbor Master daily puzzle.',
  },
  {
    id: 'daily-driftwood',
    dock: 'deep',
    letters: 'SAILBOAT',
    plan: [8],
    solutions: ['SAILBOAT'],
    note: 'Harbor Master daily puzzle.',
  },
  {
    id: 'daily-starfish',
    dock: 'deep',
    letters: 'STARFISH',
    plan: [8],
    solutions: ['STARFISH'],
    note: 'Harbor Master daily puzzle.',
  },
];

export function levelsForDock(dock: DockId): Level[] {
  return LEVELS.filter(l => l.dock === dock);
}

export function dailyLevel(date: Date = new Date()): Level {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86400000);
  return DAILY[dayOfYear % DAILY.length];
}

/**
 * OCEAN_FRESH preset - copy of design-system/presets (name MUST stay 'ocean-fresh').
 * Only the two accent hexes are overridden to the brief's harbor-blue / buoy-yellow.
 */
export const theme = {
  name: 'ocean-fresh',
  colors: {
    bg: {
      primary: '#E8F1F5',
      secondary: '#D1E7EE',
      tertiary: '#B8DBE5',
      deep: '#0A3454',
    },
    ocean: {
      deep: '#0A3454',
      wave: '#9DCEDB',
      foam: '#BFD7E3',
      seafoam: '#2E8B7A',
      coral: '#D96A5A',
      sun: '#FFD173',
    },
    surface: {
      card: '#FFFFFF',
      alt: '#EEF5F8',
      border: '#D8E7EE',
      glass: 'rgba(255,255,255,0.78)',
      glassSoft: 'rgba(255,255,255,0.66)',
    },
    crate: {
      face: '#F3E0C2',
      edge: '#D9BE92',
      caption: '#A98A5C',
    },
    text: {
      primary: '#17323F',
      secondary: '#5B7C8C',
      muted: '#8FA9B6',
      onDark: '#F4FAFC',
      onDarkSoft: '#BFD7E3',
    },
    // accents overridden for AnagramHarbor
    accent: {
      primary: '#1B6CA8',
      primaryLight: '#2E86C8',
      secondary: '#F2B134',
      secondaryDeep: '#E09A1E',
      success: '#2E8B7A',
      error: '#D96A5A',
    },
  },
  gradients: {
    primary: ['#2E86C8', '#1B6CA8'] as const,
    reward: ['#F2B134', '#E09A1E'] as const,
    rewardSoft: ['#F2B134', '#FFD173'] as const,
    water: ['#9DCEDB', '#BFD7E3'] as const,
    loader: ['rgba(10,52,84,0.92)', 'rgba(27,108,168,0.86)', 'rgba(10,52,84,0.94)'] as const,
    menu: ['rgba(232,241,245,0.18)', 'rgba(232,241,245,0.55)', 'rgba(232,241,245,0.96)'] as const,
    game: ['rgba(232,241,245,0.30)', 'rgba(232,241,245,0.88)'] as const,
    result: ['rgba(27,108,168,0.30)', 'rgba(232,241,245,0.92)'] as const,
  },
  typography: {
    hero: { fontSize: 34, fontWeight: '800' as const, letterSpacing: 3 },
    title: { fontSize: 28, fontWeight: '800' as const, letterSpacing: 1.5 },
    section: { fontSize: 18, fontWeight: '700' as const, letterSpacing: 0.4 },
    body: { fontSize: 15, fontWeight: '600' as const, letterSpacing: 0.2 },
    caption: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 1.2 },
  },
  radius: { sm: 8, md: 14, lg: 20, xl: 26, panel: 32, full: 999 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
  shadow: {
    soft: {
      shadowColor: '#0A3454',
      shadowOpacity: 0.1,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },
    card: {
      shadowColor: '#0A3454',
      shadowOpacity: 0.08,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    primary: {
      shadowColor: '#1B6CA8',
      shadowOpacity: 0.34,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 10,
    },
    accent: {
      shadowColor: '#F2B134',
      shadowOpacity: 0.38,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 9,
    },
  },
  animation: {
    press: { tension: 42, friction: 7 },
    entry: { tension: 36, friction: 9 },
    fade: 300,
  },
};

export type Theme = typeof theme;
export default theme;

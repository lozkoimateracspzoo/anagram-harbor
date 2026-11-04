import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Play, Compass, BookOpen } from 'lucide-react-native';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader, { NavButton } from '../components/ScreenHeader';
import BalanceBadge from '../components/BalanceBadge';
import DockChip from '../components/DockChip';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { StatRow, type StatItem } from '../components/StatCard';
import assets from '../assets';
import theme from '../constants/theme';
import { DOCKS, TIMING, type DockId } from '../constants/config';
import useWaveLoop from '../hooks/useWaveLoop';

type Props = {
  crates: number;
  bestWord: string;
  levelsDone: number;
  dock: DockId;
  onSelectDock: (dock: DockId) => void;
  onPlay: () => void;
  onDaily: () => void;
  onLog: () => void;
};

export function MenuScreen({
  crates,
  bestWord,
  levelsDone,
  dock,
  onSelectDock,
  onPlay,
  onDaily,
  onLog,
}: Props) {
  const wave = useWaveLoop();
  const sheetShift = useRef(new Animated.Value(60)).current;
  const sheetOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(sheetShift, {
        toValue: 0,
        tension: theme.animation.entry.tension,
        friction: theme.animation.entry.friction,
        useNativeDriver: true,
      }),
      Animated.timing(sheetOpacity, {
        toValue: 1,
        duration: TIMING.fade,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [sheetShift, sheetOpacity]);

  const shipSway = wave.interpolate({ inputRange: [0, 1], outputRange: ['-1.2deg', '1.2deg'] });
  const buoyBob = wave.interpolate({ inputRange: [0, 1], outputRange: [0, -7] });

  const stats = useMemo<StatItem[]>(() => {
    const items: StatItem[] = [];
    if (crates > 0) {
      items.push({ key: 'crates', value: String(crates), label: 'CRATES', valueColor: theme.colors.accent.primary });
    }
    if (bestWord.length > 0) {
      items.push({ key: 'best', value: String(bestWord.length), label: 'BEST WORD', valueColor: theme.colors.accent.secondary });
    }
    if (levelsDone > 0) {
      items.push({ key: 'done', value: String(levelsDone), label: 'SHIPS SAILED', valueColor: theme.colors.accent.success });
    }
    return items;
  }, [crates, bestWord, levelsDone]);

  const handleHome = useCallback(() => onSelectDock(DOCKS[0].id), [onSelectDock]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ScreenBackground variant="menu">
        <ScreenHeader
          tone="clear"
          leftSlot={<NavButton icon={assets.iconHome} onPress={handleHome} label="Harbor front" />}
          rightSlot={<BalanceBadge crates={crates} />}
        />

        <View style={styles.art}>
          <Image source={assets.logo} style={styles.logo} />

          <Animated.View
            pointerEvents="none"
            style={[styles.shipWrap, { transform: [{ rotate: shipSway }] }]}
          >
            <Image source={assets.ship} style={styles.ship} />
          </Animated.View>

          <Image source={assets.crateStack} style={styles.crates} />

          <Animated.View
            pointerEvents="none"
            style={[styles.buoyWrap, { transform: [{ translateY: buoyBob }] }]}
          >
            <Image source={assets.buoy} style={styles.buoy} />
          </Animated.View>
        </View>

        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.sheet,
            { opacity: sheetOpacity, transform: [{ translateY: sheetShift }] },
          ]}
        >
          <View style={styles.handle} />

          <Text style={styles.title}>ANAGRAM HARBOR</Text>
          <Text style={styles.tagline}>UNSCRAMBLE THE CRATES - LOAD THE SHIP</Text>

          <View style={styles.chipRow}>
            {DOCKS.map(item => (
              <DockChip
                key={item.id}
                label={item.label}
                blurb={item.blurb}
                active={item.id === dock}
                onPress={() => onSelectDock(item.id)}
              />
            ))}
          </View>

          {stats.length >= 2 ? (
            <View style={styles.statWrap}>
              <StatRow items={stats} />
            </View>
          ) : null}

          <Text style={styles.hint}>TAP LETTERS - BUILD WORDS - NO TIMER</Text>

          <PrimaryButton label="PLAY NOW" Icon={Play} onPress={onPlay} />

          <View style={styles.secondaryRow}>
            <View style={styles.secondarySlot}>
              <SecondaryButton label="HARBOR MASTER" Icon={Compass} onPress={onDaily} />
            </View>
            <View style={styles.secondarySlot}>
              <SecondaryButton label="CAPTAINS LOG" Icon={BookOpen} onPress={onLog} />
            </View>
          </View>
        </Animated.View>
      </ScreenBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.primary },
  art: { flex: 1, minHeight: 150 },
  logo: {
    position: 'absolute',
    top: 8,
    alignSelf: 'center',
    width: 104,
    height: 104,
    resizeMode: 'contain',
  },
  shipWrap: { position: 'absolute', right: 14, bottom: 30 },
  ship: { width: 176, height: 118, resizeMode: 'contain' },
  crates: {
    position: 'absolute',
    left: 20,
    bottom: 18,
    width: 86,
    height: 86,
    resizeMode: 'contain',
  },
  buoyWrap: { position: 'absolute', left: 120, bottom: 54 },
  buoy: { width: 52, height: 52, resizeMode: 'contain' },
  sheet: {
    borderTopLeftRadius: theme.radius.panel,
    borderTopRightRadius: theme.radius.panel,
    backgroundColor: theme.colors.surface.card,
    borderTopWidth: 1,
    borderTopColor: 'rgba(27,108,168,0.10)',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 26,
    shadowColor: '#0A3454',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -6 },
    elevation: 14,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    backgroundColor: theme.colors.ocean.foam,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1.5,
    lineHeight: 33,
    color: theme.colors.text.primary,
  },
  tagline: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.2,
    lineHeight: 16,
    color: theme.colors.text.secondary,
  },
  chipRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  statWrap: { marginTop: 14 },
  hint: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    lineHeight: 14,
    color: theme.colors.text.muted,
  },
  secondaryRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  secondarySlot: { flex: 1 },
});

export default MenuScreen;

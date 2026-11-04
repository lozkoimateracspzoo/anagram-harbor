import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
  type ListRenderItemInfo,
} from 'react-native';
import { RefreshCw, Star } from 'lucide-react-native';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader, { NavButton } from '../components/ScreenHeader';
import BalanceBadge from '../components/BalanceBadge';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { StatRow, type StatItem } from '../components/StatCard';
import assets from '../assets';
import theme from '../constants/theme';
import { SCORING, TIMING } from '../constants/config';
import useWaveLoop from '../hooks/useWaveLoop';
import type { GameResult } from './GameScreen';

type Props = {
  result: GameResult;
  onPlayAgain: () => void;
  onMenu: () => void;
};

function WordRow({ word }: { word: string }) {
  return (
    <View style={styles.wordRow}>
      <Text style={styles.word}>{word}</Text>
      <View style={styles.lenBadge}>
        <Text style={styles.lenText}>{String(word.length)}</Text>
      </View>
    </View>
  );
}

export function GameOverScreen({ result, onPlayAgain, onMenu }: Props) {
  const wave = useWaveLoop();
  const sail = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(sail, {
      toValue: 1,
      duration: TIMING.depart,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [sail]);

  const shipShift = sail.interpolate({ inputRange: [0, 1], outputRange: [-30, 40] });
  const shipSway = wave.interpolate({ inputRange: [0, 1], outputRange: ['-1deg', '1deg'] });
  const gullBob = wave.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });

  const stats = useMemo<StatItem[]>(() => {
    const items: StatItem[] = [];
    if (result.words.length > 0) {
      items.push({
        key: 'words',
        value: String(result.words.length),
        label: 'WORDS',
        valueColor: theme.colors.accent.primary,
      });
    }
    if (result.bestWord.length > 0) {
      items.push({
        key: 'best',
        value: String(result.bestWord.length),
        label: 'BEST',
        valueColor: theme.colors.accent.secondary,
      });
    }
    if (result.crates > 0) {
      items.push({
        key: 'crates',
        value: String(result.crates),
        label: 'CRATES',
        valueColor: theme.colors.accent.success,
      });
    }
    return items;
  }, [result]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<string>) => <WordRow word={item} />,
    [],
  );
  const keyExtractor = useCallback((item: string) => item, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ScreenBackground variant="result">
        <ScreenHeader
          tone="clear"
          leftSlot={<NavButton icon={assets.iconHome} onPress={onMenu} label="Harbor front" />}
          rightSlot={<BalanceBadge crates={result.crates} />}
        />

        <View style={styles.hero}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.shipWrap,
              { transform: [{ translateX: shipShift }, { rotate: shipSway }] },
            ]}
          >
            <Image source={assets.ship} style={styles.ship} />
          </Animated.View>

          <Image source={assets.buoy} style={styles.buoy} />

          <Animated.View
            pointerEvents="none"
            style={[styles.gullWrap, { transform: [{ translateY: gullBob }] }]}
          >
            <Image source={assets.gull} style={styles.gull} />
          </Animated.View>
        </View>

        <View style={styles.headlineBlock}>
          <Text style={styles.headline}>SHIP DEPARTS!</Text>
          <Text style={styles.subhead}>{result.title}</Text>
        </View>

        {result.bonus ? (
          <View style={styles.bonusBanner}>
            <Star size={22} color={theme.colors.accent.secondary} strokeWidth={2.4} />
            <Text style={styles.bonusText}>
              {'BONUS DEPARTURE +' + SCORING.bonusDeparture}
            </Text>
          </View>
        ) : null}

        <View style={styles.listCard}>
          <Text style={styles.listTitle}>CARGO MANIFEST</Text>
          <FlatList
            data={result.words}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            style={styles.list}
          />
        </View>

        {stats.length >= 2 ? (
          <View style={styles.statWrap}>
            <StatRow items={stats} />
          </View>
        ) : null}

        <View style={styles.footer}>
          <PrimaryButton label="PLAY AGAIN" Icon={RefreshCw} onPress={onPlayAgain} />
          <View style={styles.footerSecondary}>
            <SecondaryButton label="HARBOR FRONT" onPress={onMenu} />
          </View>
        </View>
      </ScreenBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.primary },
  hero: { height: 150 },
  shipWrap: { position: 'absolute', alignSelf: 'center', top: 8 },
  ship: { width: 220, height: 134, resizeMode: 'contain' },
  buoy: {
    position: 'absolute',
    left: 18,
    bottom: 6,
    width: 54,
    height: 54,
    resizeMode: 'contain',
  },
  gullWrap: { position: 'absolute', right: 18, top: 0 },
  gull: { width: 62, height: 62, resizeMode: 'contain' },
  headlineBlock: { paddingHorizontal: 24, alignItems: 'center' },
  headline: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 2,
    lineHeight: 38,
    textAlign: 'center',
    color: theme.colors.text.primary,
  },
  subhead: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    lineHeight: 16,
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
  bonusBanner: {
    marginTop: 14,
    marginHorizontal: 20,
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: 'rgba(242,177,52,0.16)',
    borderWidth: 1.5,
    borderColor: theme.colors.accent.secondary,
  },
  bonusText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.8,
    lineHeight: 22,
    color: theme.colors.text.primary,
  },
  listCard: {
    flex: 1,
    marginTop: 14,
    marginHorizontal: 20,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface.card,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    shadowColor: '#0A3454',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  listTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    lineHeight: 14,
    color: theme.colors.text.secondary,
    marginBottom: 6,
  },
  list: { flex: 1 },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(27,108,168,0.08)',
  },
  word: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1.6,
    lineHeight: 20,
    color: theme.colors.text.primary,
  },
  lenBadge: {
    minWidth: 30,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(27,108,168,0.08)',
  },
  lenText: {
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 15,
    color: theme.colors.accent.primary,
  },
  statWrap: { marginTop: 14, marginHorizontal: 20 },
  footer: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 24 },
  footerSecondary: { marginTop: 10 },
});

export default GameOverScreen;

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StatusBar, StyleSheet, Text, View } from 'react-native';
import { RefreshCw, Delete, CheckCircle2, Play } from 'lucide-react-native';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader, { NavButton } from '../components/ScreenHeader';
import BalanceBadge from '../components/BalanceBadge';
import ShipDeck from '../components/ShipDeck';
import SlotBoard from '../components/SlotBoard';
import CurrentWordStrip from '../components/CurrentWordStrip';
import LetterTray from '../components/LetterTray';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import assets from '../assets';
import theme from '../constants/theme';
import { STAT_STRIP_H, TIMING } from '../constants/config';
import type { Level } from '../game/levels';
import { longestWord } from '../game/wordLogic';
import useWordGame from '../hooks/useWordGame';

export type GameResult = {
  words: string[];
  bestWord: string;
  bonus: boolean;
  crates: number;
  title: string;
};

type Props = {
  level: Level;
  title: string;
  startingCrates: number;
  onExit: () => void;
  onGameOver: (result: GameResult) => void;
};

export function GameScreen({ level, title, startingCrates, onExit, onGameOver }: Props) {
  const game = useWordGame(level, startingCrates);
  const [paused, setPaused] = useState(false);
  const [departing, setDeparting] = useState(false);

  const glow = useRef(new Animated.Value(0)).current;
  const boardScale = useRef(new Animated.Value(0.96)).current;
  const firedRef = useRef(false);

  const { complete, bonus, foundWords, crates, word, picked, tiles, found, stripState } = game;
  const { tapTile, clear, shuffle, submit } = game;

  useEffect(() => {
    Animated.spring(boardScale, {
      toValue: 1,
      tension: theme.animation.entry.tension,
      friction: theme.animation.entry.friction,
      useNativeDriver: true,
    }).start();
  }, [boardScale]);

  useEffect(() => {
    if (!bonus) {
      return;
    }
    Animated.sequence([
      Animated.timing(glow, { toValue: 1, duration: TIMING.bonusGlow / 2, useNativeDriver: true }),
      Animated.timing(glow, { toValue: 0, duration: TIMING.bonusGlow / 2, useNativeDriver: true }),
    ]).start();
  }, [bonus, glow]);

  const resultRef = useRef<GameResult | null>(null);
  resultRef.current = {
    words: foundWords,
    bestWord: longestWord(foundWords),
    bonus,
    crates,
    title,
  };
  const gameOverRef = useRef(onGameOver);
  gameOverRef.current = onGameOver;

  useEffect(() => {
    if (!complete || firedRef.current) {
      return;
    }
    firedRef.current = true;
    setDeparting(true);
    const timer = setTimeout(() => {
      const payload = resultRef.current;
      if (payload) {
        gameOverRef.current(payload);
      }
    }, TIMING.depart + 240);
    return () => clearTimeout(timer);
  }, [complete]);

  const handleSubmit = useCallback(() => {
    if (paused || departing) {
      return;
    }
    submit();
  }, [paused, departing, submit]);

  const handleTap = useCallback(
    (id: string) => {
      if (paused || departing) {
        return;
      }
      tapTile(id);
    },
    [paused, departing, tapTile],
  );

  const togglePause = useCallback(() => setPaused(p => !p), []);
  const resume = useCallback(() => setPaused(false), []);

  const loaded = foundWords.length;
  const total = level.plan.length;
  const best = longestWord(foundWords);
  const glowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0, 0.55] });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ScreenBackground variant="game">
        <ScreenHeader
          title={title}
          leftSlot={
            <View style={styles.navRow}>
              <NavButton icon={assets.iconHome} onPress={onExit} label="Back to harbor" />
              <NavButton icon={assets.iconPause} onPress={togglePause} label="Pause" />
            </View>
          }
          rightSlot={<BalanceBadge crates={crates} />}
        />

        <View style={styles.area}>
          <ShipDeck loaded={loaded} total={total} departing={departing} />

          <Animated.View
            pointerEvents="none"
            style={[styles.boardWrap, { transform: [{ scale: boardScale }] }]}
          >
            <SlotBoard plan={level.plan} found={found} />
          </Animated.View>

          <CurrentWordStrip word={word} state={stripState} />
        </View>

        <View style={styles.statStrip}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>WORDS</Text>
            <Text style={styles.statValue}>{loaded + '/' + total}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>BEST</Text>
            <Text style={styles.statValue}>{best ? String(best.length) : '0'}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>BONUS</Text>
            <Text style={[styles.statValue, bonus ? styles.statValueOn : null]}>
              {bonus ? 'ON' : 'OFF'}
            </Text>
          </View>
        </View>

        <View style={styles.controls}>
          <LetterTray tiles={tiles} picked={picked} onTapTile={handleTap} />

          <View style={styles.actionRow}>
            <View style={styles.actionSmall}>
              <SecondaryButton label="SHUFFLE" Icon={RefreshCw} onPress={shuffle} height={52} />
            </View>
            <View style={styles.actionSmall}>
              <SecondaryButton
                label="CLEAR"
                Icon={Delete}
                tint={theme.colors.text.secondary}
                onPress={clear}
                height={52}
              />
            </View>
            <View style={styles.actionLarge}>
              <PrimaryButton
                label="LOAD CRATE"
                Icon={CheckCircle2}
                colors={theme.gradients.reward as unknown as string[]}
                shadow="accent"
                height={56}
                onPress={handleSubmit}
                disabled={word.length === 0}
              />
            </View>
          </View>
        </View>

        <Animated.View pointerEvents="none" style={[styles.glow, { opacity: glowOpacity }]} />

        {paused ? (
          <View style={styles.pauseOverlay}>
            <View style={styles.pauseCard}>
              <Text style={styles.pauseTitle}>HARBOR PAUSED</Text>
              <Text style={styles.pauseBody}>No timer here. Take your time.</Text>
              <View style={styles.pauseActions}>
                <PrimaryButton label="RESUME" Icon={Play} onPress={resume} />
                <View style={styles.pauseSecondary}>
                  <SecondaryButton label="HARBOR FRONT" onPress={onExit} />
                </View>
              </View>
            </View>
          </View>
        ) : null}
      </ScreenBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.primary },
  navRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  area: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    justifyContent: 'space-between',
  },
  boardWrap: { marginVertical: 8 },
  statStrip: {
    height: STAT_STRIP_H,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.70)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(27,108,168,0.10)',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  statDivider: { width: 1, height: 18, backgroundColor: 'rgba(27,108,168,0.14)' },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    lineHeight: 14,
    color: theme.colors.text.secondary,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 17,
    color: theme.colors.text.primary,
  },
  statValueOn: { color: theme.colors.accent.secondaryDeep },
  controls: {
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface.card,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    shadowColor: '#0A3454',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -6 },
    elevation: 14,
  },
  actionRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionSmall: { flex: 1 },
  actionLarge: { flex: 1.5 },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(242,177,52,0.45)',
  },
  pauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10,52,84,0.62)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  pauseCard: {
    width: '100%',
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface.card,
    padding: 22,
    alignItems: 'center',
  },
  pauseTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1.4,
    lineHeight: 27,
    color: theme.colors.text.primary,
  },
  pauseBody: {
    marginTop: 6,
    marginBottom: 18,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
  pauseActions: { width: '100%' },
  pauseSecondary: { marginTop: 10 },
});

export default GameScreen;

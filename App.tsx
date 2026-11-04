/**
 * AnagramHarbor - state machine only. All gameplay lives in src/.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen, { type GameResult } from './src/screens/GameScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import CaptainsLogScreen, { type LogEntry } from './src/screens/CaptainsLogScreen';
import { DOCKS, type DockId } from './src/constants/config';
import { dailyLevel, levelsForDock, type Level } from './src/game/levels';
import theme from './src/constants/theme';

type Screen = 'loader' | 'menu' | 'game' | 'gameover' | 'log';

export default function App() {
  const [screen, setScreen] = useState<Screen>('loader');
  const [dock, setDock] = useState<DockId>('north');
  const [levelStep, setLevelStep] = useState(0);
  const [level, setLevel] = useState<Level>(() => levelsForDock('north')[0]);
  const [crates, setCrates] = useState(0);
  const [bestWord, setBestWord] = useState('');
  const [levelsDone, setLevelsDone] = useState(0);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [result, setResult] = useState<GameResult | null>(null);

  // A fresh key on every start remounts GameScreen so the round state resets.
  const runRef = useRef(0);
  const [runId, setRunId] = useState(0);

  const dockLabel = useMemo(
    () => DOCKS.find(d => d.id === dock)?.label ?? DOCKS[0].label,
    [dock],
  );

  const startLevel = useCallback((next: Level) => {
    runRef.current += 1;
    setRunId(runRef.current);
    setLevel(next);
    setScreen('game');
  }, []);

  const handlePlay = useCallback(() => {
    const pool = levelsForDock(dock);
    startLevel(pool[levelStep % pool.length]);
  }, [dock, levelStep, startLevel]);

  const handleDaily = useCallback(() => {
    startLevel(dailyLevel());
  }, [startLevel]);

  const handleGameOver = useCallback((payload: GameResult) => {
    setResult(payload);
    setCrates(payload.crates);
    setBestWord(prev => (payload.bestWord.length > prev.length ? payload.bestWord : prev));
    setLevelsDone(n => n + 1);
    setLevelStep(n => n + 1);
    setLog(prev => {
      const seen = new Set(prev.map(e => e.word));
      const additions = payload.words
        .filter(w => !seen.has(w))
        .map(w => ({ word: w, note: payload.title }));
      return additions.length > 0 ? prev.concat(additions) : prev;
    });
    setScreen('gameover');
  }, []);

  const handlePlayAgain = useCallback(() => {
    const pool = levelsForDock(dock);
    startLevel(pool[levelStep % pool.length]);
  }, [dock, levelStep, startLevel]);

  const handleMenu = useCallback(() => setScreen('menu'), []);
  const handleLog = useCallback(() => setScreen('log'), []);
  const handleLoaderDone = useCallback(() => setScreen('menu'), []);

  // Android hardware back: never leave the player stranded mid-round.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen === 'game' || screen === 'gameover' || screen === 'log') {
        setScreen('menu');
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [screen]);

  const levelNumber = (levelStep % Math.max(1, levelsForDock(dock).length)) + 1;
  const gameTitle = level.plan.length === 1 ? 'HARBOR MASTER' : dockLabel + ' - LEVEL ' + levelNumber;

  return (
    <View style={styles.root}>
      {screen === 'loader' ? <LoaderScreen onDone={handleLoaderDone} /> : null}

      {screen === 'menu' ? (
        <MenuScreen
          crates={crates}
          bestWord={bestWord}
          levelsDone={levelsDone}
          dock={dock}
          onSelectDock={setDock}
          onPlay={handlePlay}
          onDaily={handleDaily}
          onLog={handleLog}
        />
      ) : null}

      {screen === 'game' ? (
        <GameScreen
          key={'run-' + runId}
          level={level}
          title={gameTitle}
          startingCrates={crates}
          onExit={handleMenu}
          onGameOver={handleGameOver}
        />
      ) : null}

      {screen === 'gameover' && result ? (
        <GameOverScreen result={result} onPlayAgain={handlePlayAgain} onMenu={handleMenu} />
      ) : null}

      {screen === 'log' ? <CaptainsLogScreen entries={log} onBack={handleMenu} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.primary },
});

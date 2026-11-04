import React, { memo, useCallback, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { HIT_SLOP, TILE, TIMING } from '../constants/config';

type Props = {
  id: string;
  letter: string;
  points: number;
  tilt: string;
  used: boolean;
  onPress: (id: string) => void;
};

/**
 * One wooden letter crate. Pressable is the parent, the Animated.View lives
 * inside it - the inverse order drops taps on Android release builds.
 */
function CrateTileBase({ id, letter, points, tilt, used, onPress }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.timing(scale, {
      toValue: 1.08,
      duration: TIMING.tileLift,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.timing(scale, {
      toValue: 1,
      duration: TIMING.tileSnap,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePress = useCallback(() => onPress(id), [onPress, id]);

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={used}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={`Letter ${letter}`}
      style={styles.press}
    >
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.tile,
          used ? styles.tileUsed : null,
          { transform: [{ scale }, { rotate: tilt }] },
        ]}
      >
        <View pointerEvents="none" style={styles.highlight} />
        <Text style={[styles.letter, used ? styles.letterUsed : null]}>{letter}</Text>
        <Text style={styles.points}>{String(points)}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: TILE, height: TILE },
  tile: {
    width: TILE,
    height: TILE,
    borderRadius: 12,
    backgroundColor: theme.colors.crate.face,
    borderWidth: 2,
    borderColor: theme.colors.crate.edge,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0A3454',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  tileUsed: {
    backgroundColor: 'rgba(243,224,194,0.34)',
    borderColor: 'rgba(217,190,146,0.45)',
    shadowOpacity: 0,
    elevation: 0,
  },
  highlight: {
    position: 'absolute',
    top: 3,
    left: 6,
    right: 6,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  letter: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 28,
    color: theme.colors.text.primary,
  },
  letterUsed: { color: 'rgba(23,50,63,0.26)' },
  points: {
    position: 'absolute',
    right: 6,
    bottom: 4,
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 12,
    color: theme.colors.crate.caption,
  },
});

export const CrateTile = memo(CrateTileBase);
export default CrateTile;

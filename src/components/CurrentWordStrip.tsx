import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import theme from '../constants/theme';
import { TIMING, WORD_STRIP_H } from '../constants/config';

type Props = {
  word: string;
  state: 'idle' | 'building' | 'rejected' | 'duplicate';
};

function CurrentWordStripBase({ word, state }: Props) {
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (state !== 'rejected' && state !== 'duplicate') {
      return;
    }
    const step = TIMING.wobble / 4;
    Animated.sequence([
      Animated.timing(shake, { toValue: -8, duration: step, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 8, duration: step, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -5, duration: step, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: step, useNativeDriver: true }),
    ]).start();
  }, [state, word, shake]);

  const borderColor =
    state === 'rejected'
      ? theme.colors.accent.error
      : state === 'duplicate'
      ? theme.colors.ocean.foam
      : 'rgba(27,108,168,0.16)';

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.strip, { borderColor, transform: [{ translateX: shake }] }]}
    >
      {word ? (
        <Text style={styles.word} numberOfLines={1}>
          {word}
        </Text>
      ) : (
        <Text style={styles.hint}>TAP THE CRATES</Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  strip: {
    height: WORD_STRIP_H,
    alignSelf: 'center',
    minWidth: 200,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.90)',
  },
  word: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 4,
    lineHeight: 24,
    color: theme.colors.accent.primary,
  },
  hint: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    lineHeight: 16,
    color: theme.colors.text.muted,
  },
});

export const CurrentWordStrip = memo(CurrentWordStripBase);
export default CurrentWordStrip;

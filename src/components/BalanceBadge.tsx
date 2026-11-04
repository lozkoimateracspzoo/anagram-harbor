import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { Package } from 'lucide-react-native';
import theme from '../constants/theme';

type Props = { crates: number };

/** Crate counter pill - pulses whenever the number changes. */
function BalanceBadgeBase({ crates }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const previous = useRef(crates);

  useEffect(() => {
    if (previous.current === crates) {
      return;
    }
    previous.current = crates;
    scale.setValue(1.18);
    Animated.spring(scale, {
      toValue: 1,
      tension: 60,
      friction: 6,
      useNativeDriver: true,
    }).start();
  }, [crates, scale]);

  return (
    <Animated.View pointerEvents="none" style={[styles.badge, { transform: [{ scale }] }]}>
      <Package size={18} color={theme.colors.accent.primary} strokeWidth={2.2} />
      <Text style={styles.value}>{String(crates)}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    height: 40,
    minWidth: 76,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.90)',
    borderWidth: 1,
    borderColor: 'rgba(27,108,168,0.16)',
  },
  value: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 18,
    color: theme.colors.text.primary,
  },
});

export const BalanceBadge = memo(BalanceBadgeBase);
export default BalanceBadge;

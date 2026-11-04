import React, { memo, useCallback, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import theme from '../constants/theme';
import { HIT_SLOP } from '../constants/config';

const ICON = 20;

type Props = {
  label: string;
  onPress: () => void;
  Icon?: React.ComponentType<any>;
  tint?: string;
  height?: number;
  style?: StyleProp<ViewStyle>;
};

function SecondaryButtonBase({
  label,
  onPress,
  Icon,
  tint = theme.colors.accent.primary,
  height = 48,
  style,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.96,
      tension: theme.animation.press.tension,
      friction: theme.animation.press.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: theme.animation.press.tension,
      friction: theme.animation.press.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.press, { height }, style]}
    >
      <Animated.View
        pointerEvents="box-none"
        style={[styles.fill, { transform: [{ scale }] }]}
      >
        <View style={styles.row}>
          {Icon ? <Icon size={ICON} color={tint} strokeWidth={2.2} /> : null}
          <Text style={[styles.label, { color: tint }]}>{label}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    borderRadius: 14,
    backgroundColor: theme.colors.surface.alt,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
    overflow: 'hidden',
  },
  fill: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    lineHeight: ICON,
  },
});

export const SecondaryButton = memo(SecondaryButtonBase);
export default SecondaryButton;

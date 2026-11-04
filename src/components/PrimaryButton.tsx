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
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import { HIT_SLOP } from '../constants/config';

const ICON = 24;

type Props = {
  label: string;
  onPress: () => void;
  Icon?: React.ComponentType<any>;
  colors?: string[];
  shadow?: 'primary' | 'accent';
  height?: number;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

/**
 * Pressable is the PARENT, the Animated.View is its CHILD (rule #8) - an
 * Animated wrapper on the outside swallows onPress on Android release builds.
 */
function PrimaryButtonBase({
  label,
  onPress,
  Icon,
  colors,
  shadow = 'primary',
  height = 60,
  style,
  disabled = false,
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

  const palette = colors ?? (theme.gradients.primary as unknown as string[]);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        styles.press,
        { height },
        shadow === 'accent' ? theme.shadow.accent : theme.shadow.primary,
        disabled ? styles.disabled : null,
        style,
      ]}
    >
      <Animated.View
        pointerEvents="box-none"
        style={[styles.fill, { transform: [{ scale }] }]}
      >
        <LinearGradient
          colors={palette}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fill}
        >
          <View style={styles.row}>
            {Icon ? <Icon size={ICON} color="#FFFFFF" strokeWidth={2.4} /> : null}
            <Text style={styles.label}>{label}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
  },
  disabled: { opacity: 0.45 },
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
  },
  label: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.4,
    lineHeight: ICON,
    color: '#FFFFFF',
  },
});

export const PrimaryButton = memo(PrimaryButtonBase);
export default PrimaryButton;

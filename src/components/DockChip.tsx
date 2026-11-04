import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { HIT_SLOP } from '../constants/config';

type Props = {
  label: string;
  blurb: string;
  active: boolean;
  onPress: () => void;
};

function DockChipBase({ label, blurb, active, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      style={[styles.chip, active ? styles.chipActive : styles.chipIdle]}
    >
      <View style={styles.inner}>
        <Text style={[styles.label, active ? styles.labelActive : styles.labelIdle]} numberOfLines={1}>
          {label}
        </Text>
        <Text style={[styles.blurb, active ? styles.blurbActive : styles.blurbIdle]} numberOfLines={1}>
          {blurb}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    height: 52,
    borderRadius: theme.radius.md,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: 'rgba(27,108,168,0.10)',
    borderWidth: 1.5,
    borderColor: theme.colors.accent.primary,
  },
  chipIdle: {
    backgroundColor: theme.colors.surface.alt,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  inner: { alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 12, fontWeight: '700', letterSpacing: 0.6, lineHeight: 15 },
  labelActive: { color: theme.colors.accent.primary },
  labelIdle: { color: theme.colors.text.secondary },
  blurb: { marginTop: 2, fontSize: 9, fontWeight: '700', letterSpacing: 1, lineHeight: 12 },
  blurbActive: { color: theme.colors.accent.primary, opacity: 0.8 },
  blurbIdle: { color: theme.colors.text.muted },
});

export const DockChip = memo(DockChipBase);
export default DockChip;

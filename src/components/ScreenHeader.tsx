import React, { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { HEADER_BODY_H, HIT_SLOP, STATUS_PAD } from '../constants/config';

type NavButtonProps = {
  icon: number;
  onPress: () => void;
  label: string;
};

/** 44x44 soft tile holding one 24x24 PNG glyph. */
function NavButtonBase({ icon, onPress, label }: NavButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.navButton}
    >
      <Image source={icon} style={styles.navIcon} />
    </Pressable>
  );
}

export const NavButton = memo(NavButtonBase);

type Props = {
  title?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  tone?: 'solid' | 'clear';
};

/**
 * ONE header for every screen (Menu / Game / GameOver / Log) - only the slots
 * change. Keeps padding, height and typography from drifting screen to screen.
 */
function ScreenHeaderBase({ title, leftSlot, rightSlot, tone = 'solid' }: Props) {
  return (
    <View style={[styles.header, tone === 'solid' ? styles.headerSolid : styles.headerClear]}>
      <View style={styles.side}>{leftSlot ?? null}</View>
      {title ? (
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      ) : (
        <View style={styles.titleSpacer} />
      )}
      <View style={[styles.side, styles.sideRight]}>{rightSlot ?? null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: STATUS_PAD,
    height: STATUS_PAD + HEADER_BODY_H,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerSolid: {
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(27,108,168,0.12)',
  },
  headerClear: {
    backgroundColor: 'transparent',
  },
  side: {
    width: 108,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sideRight: {
    justifyContent: 'flex-end',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    lineHeight: 18,
    color: theme.colors.text.primary,
  },
  titleSpacer: { flex: 1 },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(27,108,168,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(27,108,168,0.16)',
  },
  navIcon: { width: 24, height: 24, resizeMode: 'contain' },
});

export const ScreenHeader = memo(ScreenHeaderBase);
export default ScreenHeader;

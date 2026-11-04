import React, { memo } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../assets';
import theme from '../constants/theme';

export type BgVariant = 'loader' | 'menu' | 'game' | 'result';

type Props = {
  variant: BgVariant;
  children: React.ReactNode;
};

const GRADIENTS: Record<BgVariant, string[]> = {
  loader: theme.gradients.loader as unknown as string[],
  menu: theme.gradients.menu as unknown as string[],
  game: theme.gradients.game as unknown as string[],
  result: theme.gradients.result as unknown as string[],
};

const DIRECTION: Record<BgVariant, { start: { x: number; y: number }; end: { x: number; y: number } }> = {
  loader: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  menu: { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
  game: { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
  result: { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
};

/**
 * The single place the four screens diverge visually: one shared bg_game image
 * plus a per-variant overlay (rule #14 - Loader must not look like Menu).
 */
function ScreenBackgroundBase({ variant, children }: Props) {
  const isLoader = variant === 'loader';
  const blobColor = isLoader ? 'rgba(191,215,227,0.10)' : 'rgba(255,255,255,0.34)';

  return (
    <ImageBackground source={assets.bgGame} style={styles.fill} resizeMode="cover">
      <LinearGradient
        colors={GRADIENTS[variant]}
        start={DIRECTION[variant].start}
        end={DIRECTION[variant].end}
        style={StyleSheet.absoluteFill}
      />
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={[styles.blob, styles.blobA, { backgroundColor: blobColor }]} />
        <View style={[styles.blob, styles.blobB, { backgroundColor: blobColor }]} />
        <View style={[styles.blob, styles.blobC, { backgroundColor: blobColor }]} />
      </View>
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: theme.colors.bg.primary },
  blob: { position: 'absolute', width: 220, height: 220, borderRadius: 110 },
  blobA: { top: -40, left: -60 },
  blobB: { top: 260, right: -70 },
  blobC: { bottom: -40, left: -50 },
});

export const ScreenBackground = memo(ScreenBackgroundBase);
export default ScreenBackground;

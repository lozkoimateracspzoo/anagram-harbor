import React, { memo, useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../assets';
import theme from '../constants/theme';
import { SCREEN_W, SHIP_DECK_H, TIMING } from '../constants/config';
import useWaveLoop from '../hooks/useWaveLoop';

type Props = {
  loaded: number;
  total: number;
  departing: boolean;
};

function ShipDeckBase({ loaded, total, departing }: Props) {
  const wave = useWaveLoop();
  const sail = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!departing) {
      return;
    }
    Animated.timing(sail, {
      toValue: 1,
      duration: TIMING.depart,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [departing, sail]);

  const waveShift = wave.interpolate({ inputRange: [0, 1], outputRange: [-14, 14] });
  const sailShift = sail.interpolate({ inputRange: [0, 1], outputRange: [0, SCREEN_W] });
  const shipSway = wave.interpolate({ inputRange: [0, 1], outputRange: ['-1.2deg', '1.2deg'] });

  // One crate thumbnail per slot: solid once loaded, ghosted while still ashore.
  const thumbs = [];
  for (let i = 0; i < total; i++) {
    thumbs.push(
      <Image
        key={i}
        source={assets.crate}
        style={[styles.thumb, i < loaded ? null : styles.thumbPending]}
      />,
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.caption}>CARGO DECK</Text>
      <Text style={styles.count}>{`${loaded} / ${total}`}</Text>

      <View style={styles.thumbRow}>{thumbs}</View>

      <Animated.View
        pointerEvents="none"
        style={[styles.shipWrap, { transform: [{ translateX: sailShift }, { rotate: shipSway }] }]}
      >
        <Image source={assets.ship} style={styles.ship} />
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[styles.waterWrap, { transform: [{ translateX: waveShift }] }]}
      >
        <LinearGradient
          colors={theme.gradients.water as unknown as string[]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.water}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: SHIP_DECK_H,
    borderRadius: theme.radius.lg,
    backgroundColor: 'rgba(255,255,255,0.74)',
    borderWidth: 1,
    borderColor: 'rgba(27,108,168,0.10)',
    paddingTop: 10,
    paddingHorizontal: 14,
    overflow: 'hidden',
  },
  caption: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    lineHeight: 13,
    color: theme.colors.text.secondary,
  },
  count: {
    marginTop: 2,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 24,
    color: theme.colors.text.primary,
  },
  thumbRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  thumb: { width: 20, height: 20, resizeMode: 'contain' },
  thumbPending: { opacity: 0.25 },
  shipWrap: {
    position: 'absolute',
    right: 10,
    bottom: 14,
  },
  ship: { width: 136, height: 84, resizeMode: 'contain' },
  waterWrap: {
    position: 'absolute',
    left: -20,
    right: -20,
    bottom: 0,
    height: 10,
  },
  water: { width: '100%', height: '100%' },
});

export const ShipDeck = memo(ShipDeckBase);
export default ShipDeck;

import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { TIMING } from '../constants/config';

/**
 * Shared 0 -> 1 -> 0 loop used for the slow harbour swell.
 * transform only, so useNativeDriver stays true.
 */
export function useWaveLoop(duration: number = TIMING.wave) {
  const value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1,
          duration: duration / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0,
          duration: duration / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [value, duration]);

  return value;
}

export default useWaveLoop;

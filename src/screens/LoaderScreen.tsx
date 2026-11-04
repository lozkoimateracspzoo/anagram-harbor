import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ScreenBackground from '../components/ScreenBackground';
import assets from '../assets';
import theme from '../constants/theme';
import { LOADER_DURATION_MS, TIMING } from '../constants/config';

const BAR_W = 220;

type Props = { onDone: () => void };

export function LoaderScreen({ onDone }: Props) {
  const cardScale = useRef(new Animated.Value(0.82)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleShift = useRef(new Animated.Value(14)).current;
  const bob = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(cardScale, {
        toValue: 1,
        tension: 34,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.delay(400),
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.timing(titleShift, { toValue: 0, duration: 420, useNativeDriver: true }),
      ]),
    ]).start();

    const bobLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: 1,
          duration: TIMING.bob / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: TIMING.bob / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    bobLoop.start();

    // width animation -> JS driver only (never useNativeDriver on width)
    Animated.timing(progress, {
      toValue: 1,
      duration: LOADER_DURATION_MS,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: TIMING.screenFade,
        useNativeDriver: true,
      }).start(() => doneRef.current());
    }, LOADER_DURATION_MS);

    return () => {
      clearTimeout(timer);
      bobLoop.stop();
    };
  }, [cardScale, cardOpacity, titleOpacity, titleShift, bob, progress, screenOpacity]);

  const bobShift = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });
  const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: [0, BAR_W] });

  return (
    <Animated.View pointerEvents="box-none" style={[styles.root, { opacity: screenOpacity }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0A3454" />
      <ScreenBackground variant="loader">
        <View style={styles.body}>
          <Image source={assets.gull} style={styles.gull} />

          <Animated.View
            pointerEvents="none"
            style={[
              styles.brandCard,
              { opacity: cardOpacity, transform: [{ scale: cardScale }] },
            ]}
          >
            <Animated.Image
              source={assets.logo}
              style={[styles.logo, { transform: [{ translateY: bobShift }] }]}
            />
          </Animated.View>

          <Animated.Text
            style={[
              styles.title,
              { opacity: titleOpacity, transform: [{ translateY: titleShift }] },
            ]}
          >
            ANAGRAM HARBOR
          </Animated.Text>
          <Text style={styles.subtitle}>LOAD THE CRATES, SAIL THE WORDS</Text>

          <View style={styles.barTrack}>
            <Animated.View pointerEvents="none" style={[styles.barFill, { width: barWidth }]}>
              <LinearGradient
                colors={theme.gradients.rewardSoft as unknown as string[]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.barGradient}
              />
            </Animated.View>
          </View>
          <Text style={styles.loading}>LOADING...</Text>
        </View>
      </ScreenBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A3454' },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  gull: {
    position: 'absolute',
    top: 96,
    right: 28,
    width: 76,
    height: 76,
    resizeMode: 'contain',
    opacity: 0.85,
  },
  brandCard: {
    width: 196,
    height: 196,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(232,241,245,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(232,241,245,0.22)',
    shadowColor: '#0A3454',
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  logo: { width: 148, height: 148, resizeMode: 'contain' },
  title: {
    marginTop: 34,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 3,
    lineHeight: 40,
    textAlign: 'center',
    color: theme.colors.text.onDark,
    textShadowColor: 'rgba(10,52,84,0.6)',
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 3 },
  },
  subtitle: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    lineHeight: 16,
    textAlign: 'center',
    color: theme.colors.text.onDarkSoft,
    opacity: 0.9,
  },
  barTrack: {
    marginTop: 40,
    width: BAR_W,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: 'rgba(232,241,245,0.16)',
  },
  barFill: { height: 6, borderRadius: 3, overflow: 'hidden' },
  barGradient: { width: '100%', height: '100%' },
  loading: {
    marginTop: 14,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    lineHeight: 14,
    color: '#9DCEDB',
  },
});

export default LoaderScreen;

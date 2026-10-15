import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { Logo } from '@/components/onda';
import { radius, useOnda } from '@/theme/onda';

// Sequência da seção "01 · Splash" no Figma (quadros em 390×844):
//   t=0 nativa (símbolo 190 no centro) → t=1 a onda sobe (símbolo 278)
//   → t=2 cobre a tela → t=3 a onda recua → t=4 sai pelo topo.
// Ao cobrir a tela, o fundo e o símbolo somem: quando a onda recua, quem
// aparece já é a tela de Boas-vindas, que está por baixo.

const BASE_W = 390;
const BASE_H = 844;
const BARS = [
  { x: 0, w: 80, rise: 626, cover: -268, retreatBottom: 197 },
  { x: 78, w: 79, rise: 680, cover: -56, retreatBottom: 333 },
  { x: 155, w: 80, rise: 571, cover: -487, retreatBottom: 220 },
  { x: 235, w: 79, rise: 645, cover: -195, retreatBottom: 285 },
  { x: 310, w: 80, rise: 536, cover: -624, retreatBottom: 220 },
];
const LOGO_START = 190;
const LOGO_PEAK = 278;
export const SPLASH_DURATION = 300 + 450 + 350 + 150 + 450 + 300;

function Bar({ t, bar, sx, sy, h, color }: { t: SharedValue<number>; bar: (typeof BARS)[number]; sx: number; sy: number; h: number; color: string }) {
  const barH = h * 2;
  const style = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          t.value,
          [0, 1, 2, 3, 4],
          [h + 10, bar.rise * sy, bar.cover * sy, bar.retreatBottom * sy - barH, -barH - 10],
        ),
      },
    ],
  }));
  return (
    <Animated.View
      style={[
        styles.bar,
        { left: bar.x * sx, width: bar.w * sx + 1, height: barH, backgroundColor: color, borderRadius: radius.full },
        style,
      ]}
    />
  );
}

export function AnimatedSplash({ onFinish }: { onFinish: () => void }) {
  const { color } = useOnda();
  const { width, height } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const t = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      onFinish();
      return;
    }
    t.value = withSequence(
      withDelay(300, withTiming(1, { duration: 450, easing: Easing.out(Easing.cubic) })),
      withTiming(2, { duration: 350, easing: Easing.in(Easing.cubic) }),
      withDelay(150, withTiming(3, { duration: 450, easing: Easing.inOut(Easing.cubic) })),
      withTiming(4, { duration: 300, easing: Easing.in(Easing.cubic) }),
    );
    const timer = setTimeout(onFinish, SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, [onFinish, reduceMotion, t]);

  const backdrop = useAnimatedStyle(() => ({
    opacity: interpolate(t.value, [1.98, 2], [1, 0], 'clamp'),
  }));
  const logo = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(t.value, [0, 1], [LOGO_START / LOGO_PEAK, 1], 'clamp') }],
  }));

  if (reduceMotion) return null;

  const sx = width / BASE_W;
  const sy = height / BASE_H;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Animated.View style={[StyleSheet.absoluteFill, styles.center, { backgroundColor: color.bg.canvas }, backdrop]}>
        <Animated.View style={logo}>
          <Logo variant="mark" width={LOGO_PEAK} />
        </Animated.View>
      </Animated.View>
      {BARS.map((bar, i) => (
        <Bar key={i} t={t} bar={bar} sx={sx} sy={sy} h={height} color={color.bg.brand} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: {
    position: 'absolute',
    top: 0,
  },
});

import { StyleSheet, View } from 'react-native';

import { radius, useOnda } from '@/theme/onda';

/** ProgressBar do Onda: trilho bg/subtle, preenchimento bg/accent. `value` de 0 a 1. */
export function ProgressBar({ value, accessibilityLabel }: { value: number; accessibilityLabel?: string }) {
  const { color } = useOnda();
  const pct = Math.max(0, Math.min(1, value));

  return (
    <View
      style={[styles.track, { backgroundColor: color.bg.subtle }]}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct * 100) }}>
      {pct > 0 && <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: color.bg.accent }]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    minWidth: 8,
    borderRadius: radius.full,
  },
});

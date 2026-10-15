import { StyleSheet, View } from 'react-native';

import { radius, useOnda } from '@/theme/onda';

type ProgressBarProps = {
  /** De 0 a 1 (acima de 1 fica cheia). */
  value: number;
  /** accent = normal (laranja); warning e danger = alertas do orçamento (tela 12). */
  tone?: 'accent' | 'warning' | 'danger';
  accessibilityLabel?: string;
};

/** ProgressBar do Onda: trilho bg/subtle, preenchimento bg/accent (ou bg/warning, bg/danger). */
export function ProgressBar({ value, tone = 'accent', accessibilityLabel }: ProgressBarProps) {
  const { color } = useOnda();
  const pct = Math.max(0, Math.min(1, value));
  const fill = { accent: color.bg.accent, warning: color.bg.warning, danger: color.bg.danger }[tone];

  return (
    <View
      style={[styles.track, { backgroundColor: color.bg.subtle }]}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct * 100) }}>
      {pct > 0 && <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: fill }]} />}
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

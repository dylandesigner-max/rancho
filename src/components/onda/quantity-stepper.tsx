import Minus from 'lucide-react-native/icons/minus';
import Plus from 'lucide-react-native/icons/plus';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { radius, space, text, useOnda } from '@/theme/onda';

import { noWebFocusOutline } from './web-styles';

type QuantityStepperProps = {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

/** QuantityStepper do Onda: − e + em laranja (icon/accent sobre bg/accent-subtle); tocar no número permite digitar. */
export function QuantityStepper({ label = 'Quantidade', value, onChange, min = 1, max = 999 }: QuantityStepperProps) {
  const { color } = useOnda();
  const [draft, setDraft] = useState<string | null>(null);
  const clamp = (n: number) => Math.max(min, Math.min(max, n));
  const canDecrease = value > min;
  const canIncrease = value < max;

  const step = (disabled: boolean, onPress: () => void, Icon: typeof Plus, a11y: string) => (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={a11y}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.step,
        { backgroundColor: color.bg.accentSubtle, opacity: disabled ? 0.4 : pressed ? 0.7 : 1 },
      ]}>
      <Icon color={color.icon.accent} size={20} />
    </Pressable>
  );

  return (
    <View style={styles.root}>
      <Text style={[text.label.medium, { color: color.text.primary }]}>{label}</Text>
      <View style={[styles.box, { backgroundColor: color.bg.subtle }]}>
        {step(!canDecrease, () => onChange(clamp(value - 1)), Minus, 'Diminuir quantidade')}
        <TextInput
          value={draft ?? String(value)}
          onChangeText={(t) => setDraft(t.replace(/\D/g, '').slice(0, 3))}
          onBlur={() => {
            if (draft !== null) onChange(clamp(parseInt(draft, 10) || min));
            setDraft(null);
          }}
          keyboardType="number-pad"
          inputMode="numeric"
          selectTextOnFocus
          accessibilityLabel={label}
          selectionColor={color.border.focus}
          style={[styles.value, { color: color.text.primary }, noWebFocusOutline]}
        />
        {step(!canIncrease, () => onChange(clamp(value + 1)), Plus, 'Aumentar quantidade')}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: space.xs,
  },
  box: {
    height: 52,
    borderRadius: radius.md,
    padding: space['2xs'],
    flexDirection: 'row',
    alignItems: 'center',
  },
  step: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    flex: 1,
    // Na web o campo tem largura própria (atributo size) e empurraria o botão +.
    flexBasis: 0,
    minWidth: 0,
    height: '100%',
    textAlign: 'center',
    fontFamily: text.label.large.fontFamily,
    fontSize: text.label.large.fontSize,
    fontVariant: ['tabular-nums'],
    paddingVertical: Platform.OS === 'android' ? 0 : undefined,
  },
});

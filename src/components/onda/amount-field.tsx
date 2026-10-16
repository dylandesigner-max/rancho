import { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';

import { digitsToCents, formatAmount } from '@/lib/money';
import { radius, space, text, useOnda } from '@/theme/onda';

import { noWebFocusOutline } from './web-styles';

type AmountFieldProps = {
  label: string;
  /** Valor em centavos; 0 = vazio (mostra o placeholder "0,00"). */
  valueCents: number;
  onChangeCents: (cents: number) => void;
  helper?: string;
  autoFocus?: boolean;
};

/**
 * AmountField do Onda: mesmas medidas e fundos do TextField, com "R$" fixo. Os dígitos
 * preenchem a partir dos centavos (9 → 0,09; 90000 → 900,00).
 */
export function AmountField({ label, valueCents, onChangeCents, helper, autoFocus }: AmountFieldProps) {
  const { color } = useOnda();
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.root}>
      <Text style={[text.label.medium, { color: color.text.primary }]}>{label}</Text>
      <View
        style={[
          styles.box,
          {
            backgroundColor: focused ? color.bg.brandSubtle : color.bg.subtle,
          },
        ]}>
        <Text style={[styles.font, { color: color.text.secondary }]}>R$</Text>
        <TextInput
          value={valueCents > 0 ? formatAmount(valueCents) : ''}
          onChangeText={(t) => onChangeCents(digitsToCents(t))}
          placeholder="0,00"
          placeholderTextColor={color.text.tertiary}
          keyboardType="number-pad"
          inputMode="numeric"
          autoFocus={autoFocus}
          accessibilityLabel={`${label}, em reais`}
          selectionColor={color.border.focus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[styles.font, styles.input, { color: color.text.primary }, noWebFocusOutline]}
        />
      </View>
      {helper ? <Text style={[text.caption, { color: color.text.secondary }]}>{helper}</Text> : null}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    paddingHorizontal: space.md,
  },
  font: {
    fontFamily: text.body.medium.fontFamily,
    fontSize: text.body.medium.fontSize,
    fontVariant: ['tabular-nums'],
  },
  input: {
    flex: 1,
    // Na web o campo tem largura própria (atributo size); assim ele cabe na coluna.
    flexBasis: 0,
    minWidth: 0,
    height: '100%',
    paddingVertical: Platform.OS === 'android' ? 0 : undefined,
  },
});

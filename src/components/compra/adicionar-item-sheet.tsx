import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AmountField, BottomSheet, Button, QuantityStepper, TextField } from '@/components/onda';
import { formatBRL, subtotal } from '@/lib/money';
import { radius, space, text, useOnda } from '@/theme/onda';

// Tela 9 · Adicionar item (Figma: Prototype → 09 · Adicionar item).

type AdicionarItemSheetProps = {
  visible: boolean;
  onClose: () => void;
  onAdd: (item: { name: string; quantity: number; unitPriceCents: number | null }) => void;
};

export function AdicionarItemSheet({ visible, onClose, onAdd }: AdicionarItemSheetProps) {
  const { color } = useOnda();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [priceCents, setPriceCents] = useState(0);

  const reset = () => {
    setName('');
    setQuantity(1);
    setPriceCents(0);
  };
  const close = () => {
    reset();
    onClose();
  };
  const add = () => {
    onAdd({ name: name.trim(), quantity, unitPriceCents: priceCents > 0 ? priceCents : null });
    reset();
  };

  return (
    <BottomSheet
      visible={visible}
      title="Adicionar item"
      onClose={close}
      footer={<Button label="Adicionar à lista" disabled={name.trim().length === 0} onPress={add} />}>
      <TextField
        label="Nome do item"
        placeholder="Ex.: Molho de tomate"
        value={name}
        onChangeText={setName}
        autoFocus
        autoCapitalize="sentences"
        returnKeyType="next"
      />
      <View style={styles.row}>
        <View style={styles.col}>
          <QuantityStepper value={quantity} onChange={setQuantity} />
        </View>
        <View style={styles.col}>
          <AmountField label="Preço (opcional)" valueCents={priceCents} onChangeCents={setPriceCents} />
        </View>
      </View>
      {priceCents > 0 && (
        <View style={[styles.subtotal, { backgroundColor: color.bg.accentSubtle }]}>
          <View style={styles.calc}>
            <Text style={[text.caption, { color: color.text.secondary }]}>Subtotal</Text>
            <Text style={[text.body.small, { color: color.text.primary }]}>
              {quantity} × {formatBRL(priceCents)}
            </Text>
          </View>
          <Text style={[text.amount.medium, { color: color.text.accent }]}>
            {formatBRL(subtotal(quantity, priceCents))}
          </Text>
        </View>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: space.md,
  },
  col: {
    flex: 1,
  },
  subtotal: {
    borderRadius: radius.md,
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calc: {
    gap: space['3xs'],
  },
});

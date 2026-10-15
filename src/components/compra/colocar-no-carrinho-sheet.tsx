import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AmountField, BottomSheet, Button, QuantityStepper } from '@/components/onda';
import { formatBRL, subtotal } from '@/lib/money';
import type { Item } from '@/lib/store';
import { radius, space, text, useOnda } from '@/theme/onda';

// Tela 11 · Colocar no carrinho (Figma: Prototype → 11 · Colocar no carrinho).

type ColocarNoCarrinhoSheetProps = {
  /** Item tocado na lista; null = folha fechada. */
  item: Item | null;
  budgetCents: number;
  spentCents: number;
  onClose: () => void;
  onConfirm: (quantity: number, unitPriceCents: number) => void;
  /** Só para item do carrinho. */
  onReturnToPending: () => void;
};

export function ColocarNoCarrinhoSheet({
  item,
  budgetCents,
  spentCents,
  onClose,
  onConfirm,
  onReturnToPending,
}: ColocarNoCarrinhoSheetProps) {
  const { color } = useOnda();
  const [itemId, setItemId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [priceCents, setPriceCents] = useState(0);

  // Abriu outro item: começa com a quantidade e o preço planejados dele.
  if (item && item.id !== itemId) {
    setItemId(item.id);
    setQuantity(item.quantity);
    setPriceCents(item.unitPriceCents ?? 0);
  }

  const inCart = !!item?.inCart;
  const newSubtotal = subtotal(quantity, priceCents);
  // No carrinho, o subtotal antigo sai do gasto antes de entrar o novo.
  const previous = item?.inCart && item.unitPriceCents != null ? subtotal(item.quantity, item.unitPriceCents) : 0;
  const newSpent = spentCents - previous + newSubtotal;
  const newBalance = budgetCents - newSpent;
  const over = newBalance < 0;

  const close = () => {
    setItemId(null);
    onClose();
  };

  return (
    <BottomSheet
      visible={!!item}
      title={item?.name ?? ''}
      onClose={close}
      footer={
        <View style={styles.footer}>
          <Button
            label={inCart ? 'Salvar alterações' : 'Colocar no carrinho'}
            disabled={priceCents <= 0}
            onPress={() => {
              setItemId(null);
              onConfirm(quantity, priceCents);
            }}
          />
          {inCart ? (
            <Button
              variant="ghost"
              label="Devolver para pendentes"
              onPress={() => {
                setItemId(null);
                onReturnToPending();
              }}
            />
          ) : null}
        </View>
      }>
      <View style={styles.row}>
        <View style={styles.col}>
          <QuantityStepper value={quantity} onChange={setQuantity} />
        </View>
        <View style={styles.col}>
          <AmountField
            label="Preço"
            valueCents={priceCents}
            onChangeCents={setPriceCents}
            autoFocus={item?.unitPriceCents == null}
          />
        </View>
      </View>
      {priceCents > 0 && (
        <>
          <View style={[styles.subtotal, { backgroundColor: color.bg.accentSubtle }]}>
            <View style={styles.calc}>
              <Text style={[text.caption, { color: color.text.secondary }]}>Subtotal</Text>
              <Text style={[text.body.small, { color: color.text.primary }]}>
                {quantity} × {formatBRL(priceCents)}
              </Text>
            </View>
            <Text style={[text.amount.medium, { color: color.text.accent }]}>{formatBRL(newSubtotal)}</Text>
          </View>
          <View style={styles.preview}>
            <View style={styles.calc}>
              <Text style={[text.caption, { color: color.text.secondary }]}>Novo gasto</Text>
              <Text style={[text.amount.small, { color: color.text.primary }]}>{formatBRL(newSpent)}</Text>
            </View>
            <View style={[styles.calc, styles.end]}>
              <Text style={[text.caption, { color: over ? color.text.danger : color.text.secondary }]}>
                {over ? 'Acima do orçamento' : 'Novo saldo'}
              </Text>
              <Text style={[text.amount.small, { color: over ? color.text.danger : color.text.primary }]}>
                {formatBRL(Math.abs(newBalance))}
              </Text>
            </View>
          </View>
        </>
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
  end: {
    alignItems: 'flex-end',
  },
  preview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: space.md,
  },
  footer: {
    gap: space.xs,
  },
});

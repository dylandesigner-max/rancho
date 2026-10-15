import { StyleSheet, Text, View } from 'react-native';

import { BottomSheet, Button } from '@/components/onda';
import { formatBRL } from '@/lib/money';
import { pendingItems, spentCents, type Purchase } from '@/lib/store';
import { radius, space, text, useOnda } from '@/theme/onda';

// Tela 13 · Concluir compra (Figma: Prototype → 13 · Concluir compra).
// Sem histórico no MVP: concluir apaga a compra (decisão de 16/10).

type ConcluirCompraSheetProps = {
  visible: boolean;
  purchase: Purchase;
  onClose: () => void;
  onConclude: () => void;
};

export function ConcluirCompraSheet({ visible, purchase, onClose, onConclude }: ConcluirCompraSheetProps) {
  const { color } = useOnda();
  const spent = spentCents(purchase);
  const diff = purchase.budgetCents - spent;
  const over = diff < 0;
  const left = pendingItems(purchase);

  return (
    <BottomSheet
      visible={visible}
      title="Concluir compra"
      onClose={onClose}
      footer={
        <View style={styles.footer}>
          <Button label="Concluir compra" onPress={onConclude} />
          <Button variant="ghost" label="Voltar para a compra" onPress={onClose} />
        </View>
      }>
      <View
        style={[
          styles.result,
          over
            ? { backgroundColor: color.bg.dangerSubtle }
            : { backgroundColor: color.bg.brandSubtle, borderColor: color.border.brandSubtle, borderWidth: 1 },
        ]}>
        <Text style={[text.caption, { color: color.text.secondary }]}>Gasto final</Text>
        <Text style={[text.amount.large, { color: color.text.primary }]}>{formatBRL(spent)}</Text>
        <Text style={[text.body.small, { color: over ? color.text.danger : color.text.brand }]}>
          de {formatBRL(purchase.budgetCents)} · {over ? `passou ${formatBRL(-diff)}` : `sobrou ${formatBRL(diff)}`}
        </Text>
      </View>
      <View style={styles.left}>
        <Text style={[text.label.medium, { color: color.text.primary }]}>
          {left.length > 0 ? `Ficaram de fora (${left.length})` : 'Nada ficou de fora'}
        </Text>
        <Text style={[text.body.small, { color: color.text.secondary }]}>
          {left.length > 0 ? left.map((i) => i.name).join(', ') : 'Todos os itens foram para o carrinho.'}
        </Text>
      </View>
      <Text style={[text.caption, { color: color.text.tertiary }]}>
        Ao concluir, a compra sai deste aparelho e o Início fica pronto para a próxima. O histórico de compras fica
        para uma próxima versão.
      </Text>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  result: {
    borderRadius: radius.md,
    padding: space.md,
    gap: space['3xs'],
  },
  left: {
    gap: space['3xs'],
  },
  footer: {
    gap: space.xs,
  },
});

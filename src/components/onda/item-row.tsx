import Check from 'lucide-react-native/icons/check';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { radius, space, text, useOnda } from '@/theme/onda';

type ItemRowProps = {
  name: string;
  /** Pendente: "12 un. · R$ 5,99 cada" ou "3 un. · sem preço". No carrinho: "12 × R$ 5,99". */
  detail: string;
  /** Valor à direita (estimado ou subtotal). Sem valor, some. */
  amount?: string;
  status: 'pending' | 'inCart';
  onPress: () => void;
};

/**
 * ItemRow do Onda: linha de item da compra (mín. 64), toda tocável. Pendente: círculo bg/control
 * e valor estimado em text/secondary. No carrinho: check em bg/brand e subtotal em text/accent.
 */
export function ItemRow({ name, detail, amount, status, onPress }: ItemRowProps) {
  const { color } = useOnda();
  const inCart = status === 'inCart';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${detail}${amount ? `, ${amount}` : ''}${inCart ? ', no carrinho' : ''}`}
      style={({ pressed }) => [
        styles.root,
        {
          backgroundColor: pressed ? color.bg.subtle : color.bg.surface,
        },
      ]}>
      <View
        style={[
          styles.check,
          { backgroundColor: inCart ? color.bg.brand : color.bg.control },
        ]}>
        {inCart && <Check color={color.icon.onBrand} size={16} strokeWidth={3} />}
      </View>
      <View style={styles.texts}>
        <Text style={[text.body.medium, { color: color.text.primary }]}>{name}</Text>
        <Text style={[text.caption, { color: color.text.secondary }]}>{detail}</Text>
      </View>
      {amount ? (
        <Text style={[text.amount.small, { color: inCart ? color.text.accent : color.text.secondary }]}>{amount}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    minHeight: 64,
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flex: 1,
    gap: space['3xs'],
  },
});

import { StyleSheet, View } from 'react-native';

import { space, useOnda } from '@/theme/onda';

type DividerProps = {
  /** true = recua 16 dos lados (itens dentro de um cartão); false = largura toda. */
  inset?: boolean;
};

/** Divider do Onda: linha de 1 px em border/default que separa itens. Substitui o contorno dos containers. */
export function Divider({ inset = false }: DividerProps) {
  const { color } = useOnda();
  return (
    <View style={inset && styles.inset} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={[styles.line, { backgroundColor: color.border.default }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  inset: {
    paddingHorizontal: space.md,
  },
  line: {
    height: 1,
  },
});

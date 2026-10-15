import { Pressable, StyleSheet, Text, View } from 'react-native';

import { radius, space, text, useOnda } from '@/theme/onda';

type RadioItemProps = {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  last?: boolean;
};

/**
 * RadioItem do Onda: opção de escolha única (mín. 52), rádio à direita. Selecionado:
 * anel border/brand com ponto bg/brand; não selecionado: anel border/strong.
 */
export function RadioItem({ label, description, selected, onPress, last = false }: RadioItemProps) {
  const { color } = useOnda();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={description ? `${label}. ${description}` : label}
      style={({ pressed }) => [
        styles.root,
        {
          backgroundColor: pressed ? color.bg.subtle : color.bg.surface,
          borderBottomColor: color.border.default,
          borderBottomWidth: last ? 0 : 1,
        },
      ]}>
      <View style={styles.texts}>
        <Text style={[text.body.medium, { color: color.text.primary }]}>{label}</Text>
        {description ? <Text style={[text.caption, { color: color.text.secondary }]}>{description}</Text> : null}
      </View>
      <View style={[styles.ring, { borderColor: selected ? color.border.brand : color.border.strong }]}>
        {selected && <View style={[styles.dot, { backgroundColor: color.bg.brand }]} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    minHeight: 52,
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  texts: {
    flex: 1,
    gap: space['3xs'],
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: radius.full,
  },
});

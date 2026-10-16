import { Pressable, StyleSheet, Text, View } from 'react-native';

import { radius, space, text, useOnda } from '@/theme/onda';

type RadioItemProps = {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
};

/**
 * RadioItem do Onda: opção de escolha única (mín. 52), rádio à direita. Selecionado:
 * círculo bg/brand com ponto icon/on-brand; não selecionado: círculo bg/control.
 */
export function RadioItem({ label, description, selected, onPress }: RadioItemProps) {
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
        },
      ]}>
      <View style={styles.texts}>
        <Text style={[text.body.medium, { color: color.text.primary }]}>{label}</Text>
        {description ? <Text style={[text.caption, { color: color.text.secondary }]}>{description}</Text> : null}
      </View>
      <View style={[styles.ring, { backgroundColor: selected ? color.bg.brand : color.bg.control }]}>
        {selected && <View style={[styles.dot, { backgroundColor: color.icon.onBrand }]} />}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
  },
});

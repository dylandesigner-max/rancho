import ChevronRight from 'lucide-react-native/icons/chevron-right';
import { Pressable, StyleSheet, Text } from 'react-native';

import { space, text, useOnda } from '@/theme/onda';

type ListItemProps = {
  label: string;
  /** Valor à direita (ex.: opção atual). */
  value?: string;
  /** Chevron indica que a linha leva a outra tela. */
  chevron?: boolean;
  tone?: 'default' | 'danger';
  onPress?: () => void;
};

/** ListItem do Onda: linha de menu (mín. 52) para agrupar num Card. Danger para ações destrutivas. */
export function ListItem({ label, value, chevron = false, tone = 'default', onPress }: ListItemProps) {
  const { color } = useOnda();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={value ? `${label}, ${value}` : label}
      style={({ pressed }) => [
        styles.root,
        {
          backgroundColor: pressed ? color.bg.subtle : color.bg.surface,
        },
      ]}>
      <Text style={[text.body.medium, styles.label, { color: tone === 'danger' ? color.text.danger : color.text.primary }]}>
        {label}
      </Text>
      {value ? <Text style={[text.body.small, { color: color.text.secondary }]}>{value}</Text> : null}
      {chevron ? <ChevronRight color={color.icon.secondary} size={24} /> : null}
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
    gap: space.xs,
  },
  label: {
    flex: 1,
  },
});

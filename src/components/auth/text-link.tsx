import { Pressable, StyleSheet, Text } from 'react-native';

import { font, space, text, useOnda } from '@/theme/onda';

type TextLinkProps = {
  /** Texto neutro antes do link (ex.: "Não tem conta?"). */
  prefix?: string;
  action: string;
  onPress: () => void;
  align?: 'center' | 'end';
};

/** Link de texto com área de toque de 44 (ex.: "Não tem conta? Criar conta", "Esqueci a senha"). */
export function TextLink({ prefix, action, onPress, align = 'center' }: TextLinkProps) {
  const { color } = useOnda();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={prefix ? `${prefix} ${action}` : action}
      hitSlop={4}
      style={[styles.root, { alignSelf: align === 'end' ? 'flex-end' : 'center' }]}>
      <Text style={[prefix ? text.body.medium : text.label.medium, { color: color.text.secondary }]}>
        {prefix ? `${prefix} ` : null}
        <Text style={{ fontFamily: font.bold, color: color.text.brand }}>{action}</Text>
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    minHeight: 44,
    justifyContent: 'center',
    paddingVertical: space.sm,
  },
});

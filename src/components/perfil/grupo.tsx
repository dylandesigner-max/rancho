import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { radius, space, text, useOnda } from '@/theme/onda';

/**
 * Grupo de linhas do perfil (Figma: título em Caption + "Cartão" bg/surface, raio lg).
 * As linhas (ListItem, RadioItem) recebem `last` para tirar a última divisória.
 */
export function Grupo({ title, children }: { title?: string; children: ReactNode }) {
  const { color } = useOnda();
  return (
    <View style={styles.root}>
      {title ? <Text style={[text.caption, { color: color.text.secondary }]}>{title}</Text> : null}
      <View style={[styles.card, { backgroundColor: color.bg.surface, borderColor: color.border.default }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: space.xs,
  },
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
});

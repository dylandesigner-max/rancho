import { Children, Fragment, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Divider } from '@/components/onda';
import { radius, space, text, useOnda } from '@/theme/onda';

/**
 * Grupo de linhas do perfil (Figma: título em Caption + "Cartão" bg/surface, raio lg).
 * Sem contorno: entre as linhas (ListItem, RadioItem) entra um Divider recuado.
 */
export function Grupo({ title, children }: { title?: string; children: ReactNode }) {
  const { color } = useOnda();
  return (
    <View style={styles.root}>
      {title ? <Text style={[text.caption, { color: color.text.secondary }]}>{title}</Text> : null}
      <View style={[styles.card, { backgroundColor: color.bg.surface }]}>
        {Children.toArray(children).map((child, index) => (
          <Fragment key={index}>
            {index > 0 && <Divider inset />}
            {child}
          </Fragment>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: space.xs,
  },
  card: {
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
});

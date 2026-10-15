import { StyleSheet, Text, View } from 'react-native';

import { space, text, useOnda } from '@/theme/onda';

/** Título (Display/Medium) + subtítulo das telas de entrada. */
export function AuthHeader({ title, subtitle }: { title: string; subtitle: string }) {
  const { color } = useOnda();
  return (
    <View style={styles.root}>
      <Text style={[text.display.medium, { color: color.text.primary }]} accessibilityRole="header">
        {title}
      </Text>
      <Text style={[text.body.medium, { color: color.text.secondary }]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: space.xs,
  },
});

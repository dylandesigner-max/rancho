import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { radius, space, text, useOnda } from '@/theme/onda';

// Placeholder até a primeira tela ser aprovada no Figma.
export default function Home() {
  const { color } = useOnda();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: color.bg.canvas }]}>
      <View style={styles.content}>
        <Text style={[text.display.large, { color: color.text.brand }]}>Rancho</Text>
        <Text style={[text.body.large, styles.slogan, { color: color.text.primary }]}>
          O controle da sua compra na palma da sua mão.
        </Text>
      </View>

      <View style={[styles.badge, { backgroundColor: color.bg.accent }]}>
        <Text style={[text.label.medium, { color: color.text.onAccent }]}>Em construção</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: space.xl,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: space.xs,
  },
  slogan: {
    maxWidth: 300,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
    borderRadius: radius.full,
  },
});

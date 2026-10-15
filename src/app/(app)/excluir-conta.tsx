import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, TopBar } from '@/components/onda';
import { goToWelcome } from '@/lib/session';
import { actions } from '@/lib/store';
import { space, text, useOnda } from '@/theme/onda';

// Tela 16 · Excluir conta (Figma: Prototype → 16 · Excluir conta).

export default function ExcluirConta() {
  const { color } = useOnda();

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.root, { backgroundColor: color.bg.canvas }]}>
      <TopBar title="Excluir conta" />
      <View style={styles.content}>
        <Text style={[text.heading.medium, { color: color.text.primary }]} accessibilityRole="header">
          Excluir sua conta?
        </Text>
        <Text style={[text.body.medium, { color: color.text.secondary }]}>
          Sua conta e a compra guardada neste aparelho serão apagadas. Não dá para desfazer.
        </Text>
        <Text style={[text.body.medium, { color: color.text.secondary }]}>
          Se quiser só parar de usar por um tempo, é melhor sair da conta.
        </Text>
      </View>
      <View style={styles.footer}>
        <Button
          variant="danger"
          label="Excluir conta"
          onPress={() => {
            actions.deleteAccount();
            goToWelcome();
          }}
        />
        <Button variant="ghost" label="Cancelar" onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: space.xl,
    paddingTop: space.xl,
    gap: space.sm,
  },
  footer: {
    paddingHorizontal: space.xl,
    paddingBottom: space.xs,
    gap: space.xs,
  },
});

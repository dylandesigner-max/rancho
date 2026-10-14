import { router } from 'expo-router';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TextLink } from '@/components/auth/text-link';
import { Button, Logo, SocialButton } from '@/components/onda';
import { font, space, text, useOnda } from '@/theme/onda';

// Tela 2 · Boas-vindas (Figma: Prototype → 02 · Boas-vindas).

const soon = (what: string) =>
  Alert.alert('Em breve', `${what} vai funcionar quando conectarmos o serviço de contas.`);

export default function BoasVindas() {
  const { color } = useOnda();

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.root, { backgroundColor: color.bg.canvas }]}>
      <View style={styles.hero}>
        <Logo variant="full" width={226} />
        <Text style={[text.body.large, styles.slogan, { color: color.text.primary }]}>
          O controle das{' '}
          <Text style={{ fontFamily: font.extrabold, color: color.text.brand }}>suas compras</Text> na ponta dos
          seus dedos.
        </Text>
      </View>

      <View style={styles.actions}>
        {/* Login com Apple só existe no iOS. */}
        {Platform.OS === 'ios' && <SocialButton provider="apple" onPress={() => soon('O login com a Apple')} />}
        <SocialButton provider="google" onPress={() => soon('O login com o Google')} />
        <Button label="Entrar com e-mail" onPress={() => router.push('/entrar')} />
        <TextLink prefix="Não tenho conta ainda?" action="Criar conta" onPress={() => router.push('/criar-conta')} />
      </View>

      <Text style={[text.caption, styles.terms, { color: color.text.tertiary }]}>
        Ao continuar, você concorda com os{' '}
        <Text style={[styles.underline, { color: color.text.secondary }]} onPress={() => soon('A página de Termos de Uso')}>
          Termos de Uso
        </Text>{' '}
        e a{' '}
        <Text style={[styles.underline, { color: color.text.secondary }]} onPress={() => soon('A Política de Privacidade')}>
          Política de Privacidade
        </Text>
        .
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: space.xl,
    paddingTop: space.md,
    paddingBottom: space.xs,
    gap: space.xl,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xl,
  },
  slogan: {
    textAlign: 'center',
    maxWidth: 260,
  },
  actions: {
    gap: space.sm,
  },
  terms: {
    textAlign: 'center',
  },
  underline: {
    textDecorationLine: 'underline',
  },
});

import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar, ListItem, TopBar } from '@/components/onda';
import { Grupo } from '@/components/perfil/grupo';
import { signOut } from '@/lib/auth';
import { showNotice } from '@/lib/notice';
import { goToWelcome } from '@/lib/session';
import { useStore, type Appearance } from '@/lib/store';
import { space, text, useOnda } from '@/theme/onda';

// Tela 14 · Meu perfil (Figma: Prototype → 14 · Meu perfil).

const appearanceLabel: Record<Appearance, string> = {
  system: 'Automático',
  light: 'Claro',
  dark: 'Escuro',
};

// PROVISÓRIO: os textos de Termos e Privacidade ainda não existem.
const soon = (what: string) => showNotice('Em breve', `${what} vai ser publicada junto com o serviço de contas.`);

export default function Perfil() {
  const { color } = useOnda();
  const userName = useStore((s) => s.userName) ?? '';
  const userEmail = useStore((s) => s.userEmail);
  const photoUri = useStore((s) => s.photoUri);
  const appearance = useStore((s) => s.appearance);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.root, { backgroundColor: color.bg.canvas }]}>
      <TopBar title="Meu perfil" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.head}>
          <Avatar name={userName} photoUri={photoUri} onPress={() => router.push('/foto-de-perfil')} accessibilityLabel="Foto de perfil" />
          <View style={styles.who}>
            <Text style={[text.heading.small, { color: color.text.primary }]}>{userName}</Text>
            {userEmail ? <Text style={[text.body.small, { color: color.text.secondary }]}>{userEmail}</Text> : null}
          </View>
        </View>

        <Grupo title="Conta">
          <ListItem label="Foto de perfil" chevron onPress={() => router.push('/foto-de-perfil')} />
          <ListItem label="Editar nome" chevron onPress={() => router.push('/editar-perfil')} />
          <ListItem label="Forma de entrada" value="E-mail" />
        </Grupo>

        <Grupo title="Preferências">
          <ListItem label="Aparência" value={appearanceLabel[appearance]} chevron onPress={() => router.push('/aparencia')} />
        </Grupo>

        <Grupo title="Sobre o Rancho">
          <ListItem label="Termos de Uso" chevron onPress={() => soon('Os Termos de Uso')} />
          <ListItem label="Política de Privacidade" chevron onPress={() => soon('A Política de Privacidade')} />
        </Grupo>

        <Grupo>
          <ListItem
            label="Sair"
            onPress={async () => {
              await signOut();
              goToWelcome();
            }}
          />
          <ListItem label="Excluir conta" tone="danger" chevron onPress={() => router.push('/excluir-conta')} />
        </Grupo>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: space.xl,
    paddingTop: space.xl,
    paddingBottom: space.xl,
    gap: space.xl,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  who: {
    flex: 1,
    gap: space['3xs'],
  },
});

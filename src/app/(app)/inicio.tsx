import { router } from 'expo-router';
import ShoppingBasket from 'lucide-react-native/icons/shopping-basket';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NovaCompraSheet } from '@/components/compra/nova-compra-sheet';
import { Avatar, Button, EmptyState } from '@/components/onda';
import { showNotice } from '@/lib/notice';
import { actions, firstName, useStore } from '@/lib/store';
import { space, text, useOnda } from '@/theme/onda';

// Tela 6 · Início (Figma: Prototype → 06 · Início).

export default function Inicio() {
  const { color } = useOnda();
  const userName = useStore((s) => s.userName);
  const purchase = useStore((s) => s.purchase);
  const [creating, setCreating] = useState(false);
  const name = firstName(userName) || 'você';

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.root, { backgroundColor: color.bg.canvas }]}>
      <View style={styles.header}>
        <View style={styles.greeting}>
          <Text style={[text.display.medium, { color: color.text.primary }]} accessibilityRole="header">
            Oi, {name}
          </Text>
          <Text style={[text.body.medium, { color: color.text.secondary }]}>Vamos planejar o rancho do mês?</Text>
        </View>
        <Avatar
          name={userName || name}
          onPress={() => showNotice('Em breve', 'O Meu perfil (tela 14) ainda vai ser desenhado.')}
        />
      </View>

      <View style={styles.content}>
        {purchase ? (
          // PROVISÓRIO: o Início com uma compra em andamento ainda não foi desenhado.
          <Text style={[text.body.medium, styles.center, { color: color.text.secondary }]}>
            Compra em andamento: {purchase.name}
          </Text>
        ) : (
          <EmptyState
            icon={ShoppingBasket}
            title="Nenhuma compra ainda"
            description="Crie uma compra com o seu orçamento e monte a lista antes de sair de casa."
          />
        )}
      </View>

      <View style={styles.footer}>
        {purchase ? (
          <Button label="Abrir compra" onPress={() => router.push('/compra')} />
        ) : (
          <Button label="Nova compra" onPress={() => setCreating(true)} />
        )}
      </View>

      <NovaCompraSheet
        visible={creating}
        onClose={() => setCreating(false)}
        onCreate={(purchaseName, budgetCents) => {
          actions.createPurchase(purchaseName, budgetCents);
          setCreating(false);
          router.push('/compra');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.xl,
    paddingTop: space.xs,
  },
  greeting: {
    flex: 1,
    gap: space['3xs'],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: space.xl,
  },
  center: {
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: space.xl,
    paddingBottom: space.xs,
  },
});

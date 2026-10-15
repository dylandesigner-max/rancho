import { Redirect, router } from 'expo-router';
import ShoppingBasket from 'lucide-react-native/icons/shopping-basket';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConcluirCompraSheet } from '@/components/compra/concluir-compra-sheet';
import { NovaCompraSheet } from '@/components/compra/nova-compra-sheet';
import { Avatar, BudgetSummary, Button, EmptyState } from '@/components/onda';
import { actions, cartItems, firstName, spentCents, useStore } from '@/lib/store';
import { space, text, useOnda } from '@/theme/onda';

// Tela 6 · Início (vazio) e 06b · Início com compra em andamento
// (Figma: Prototype → 06 · Início e 06b · Início com compra em andamento).

export default function Inicio() {
  const { color } = useOnda();
  const userName = useStore((s) => s.userName);
  const photoUri = useStore((s) => s.photoUri);
  const purchase = useStore((s) => s.purchase);
  const [creating, setCreating] = useState(false);
  const [concluding, setConcluding] = useState(false);
  const name = firstName(userName) || 'você';

  const inCart = purchase ? cartItems(purchase).length : 0;
  const total = purchase?.items.length ?? 0;

  // Sessão encerrada (ex.: saiu em outro lugar): volta para Boas-vindas.
  if (!userName) return <Redirect href="/" />;

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
          photoUri={photoUri}
          onPress={() => router.push('/perfil')}
          accessibilityLabel="Meu perfil"
        />
      </View>

      {purchase ? (
        <ScrollView style={styles.flex} contentContainerStyle={styles.purchase}>
          <View style={styles.purchaseHead}>
            <Text style={[text.caption, { color: color.text.secondary }]}>Compra em andamento</Text>
            <Text style={[text.heading.large, { color: color.text.primary }]}>{purchase.name}</Text>
            <Text style={[text.body.small, { color: color.text.secondary }]}>
              {total === 0 ? 'Nenhum item na lista ainda' : `${inCart} de ${total} itens no carrinho`}
            </Text>
          </View>
          <Pressable onPress={() => router.push('/compra')} accessibilityRole="button" accessibilityLabel="Abrir a compra">
            <BudgetSummary budgetCents={purchase.budgetCents} spentCents={spentCents(purchase)} />
          </Pressable>
        </ScrollView>
      ) : (
        <View style={styles.empty}>
          <EmptyState
            icon={ShoppingBasket}
            title="Nenhuma compra ainda"
            description="Crie uma compra com o seu orçamento e monte a lista antes de sair de casa."
          />
        </View>
      )}

      <View style={styles.footer}>
        {purchase ? (
          <>
            <Button label="Continuar compra" onPress={() => router.push('/compra')} />
            <Button variant="ghost" label="Concluir compra" onPress={() => setConcluding(true)} />
          </>
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
      {purchase ? (
        <ConcluirCompraSheet
          visible={concluding}
          purchase={purchase}
          onClose={() => setConcluding(false)}
          onConclude={() => {
            setConcluding(false);
            actions.concludePurchase();
          }}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
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
  empty: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: space.xl,
  },
  purchase: {
    paddingHorizontal: space.xl,
    paddingTop: space['2xl'],
    paddingBottom: space.md,
    gap: space.md,
  },
  purchaseHead: {
    gap: space['3xs'],
  },
  footer: {
    paddingHorizontal: space.xl,
    paddingBottom: space.xs,
    gap: space.xs,
  },
});

import { Redirect, router } from 'expo-router';
import ClipboardList from 'lucide-react-native/icons/clipboard-list';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AdicionarItemSheet } from '@/components/compra/adicionar-item-sheet';
import { BudgetSummary, Button, EmptyState, TopBar } from '@/components/onda';
import { formatBRL, subtotal } from '@/lib/money';
import { actions, spentCents, useStore } from '@/lib/store';
import { space, text, useOnda } from '@/theme/onda';

// Tela 8 · Compra (Figma: Prototype → 08 · Compra). Com itens, a lista é a tela 10.

export default function Compra() {
  const { color } = useOnda();
  const purchase = useStore((s) => s.purchase);
  const [adding, setAdding] = useState(false);

  if (!purchase) return <Redirect href="/inicio" />;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.root, { backgroundColor: color.bg.canvas }]}>
      <TopBar title={purchase.name} onBack={() => (router.canGoBack() ? router.back() : router.replace('/inicio'))} />
      <View style={styles.summary}>
        <BudgetSummary budgetCents={purchase.budgetCents} spentCents={spentCents(purchase)} />
      </View>

      {purchase.items.length === 0 ? (
        <View style={styles.empty}>
          <EmptyState
            icon={ClipboardList}
            title="Sua lista está vazia"
            description="Adicione o que precisa comprar. O preço pode ficar para a hora do mercado."
          />
        </View>
      ) : (
        // PROVISÓRIO: lista simples até a tela 10 (compra em andamento) ser desenhada.
        <ScrollView contentContainerStyle={styles.list}>
          {purchase.items.map((item) => (
            <View key={item.id} style={styles.provisionalRow}>
              <Text style={[text.body.medium, styles.flex, { color: color.text.primary }]}>
                {item.quantity} × {item.name}
              </Text>
              <Text style={[text.amount.small, { color: color.text.secondary }]}>
                {item.unitPriceCents != null ? formatBRL(subtotal(item.quantity, item.unitPriceCents)) : 'sem preço'}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.footer}>
        <Button label="Adicionar item" onPress={() => setAdding(true)} />
      </View>

      <AdicionarItemSheet
        visible={adding}
        onClose={() => setAdding(false)}
        onAdd={(item) => {
          actions.addItem(item);
          setAdding(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  summary: {
    paddingHorizontal: space.xl,
    paddingTop: space.md,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: space.xl,
  },
  list: {
    paddingHorizontal: space.xl,
    paddingVertical: space.xl,
    gap: space.sm,
  },
  provisionalRow: {
    flexDirection: 'row',
    gap: space.md,
  },
  flex: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: space.xl,
    paddingBottom: space.xs,
  },
});

import { Redirect, router } from 'expo-router';
import ClipboardList from 'lucide-react-native/icons/clipboard-list';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AdicionarItemSheet } from '@/components/compra/adicionar-item-sheet';
import { ColocarNoCarrinhoSheet } from '@/components/compra/colocar-no-carrinho-sheet';
import { BudgetSummary, Button, EmptyState, ItemRow, Tabs, TopBar } from '@/components/onda';
import { formatBRL, subtotal } from '@/lib/money';
import { actions, cartItems, pendingItems, spentCents, useStore, type Item } from '@/lib/store';
import { radius, space, text, useOnda } from '@/theme/onda';

// Tela 8 · Compra (lista vazia) e tela 10 · Compra em andamento
// (Figma: Prototype → 08 · Compra e 10 · Compra em andamento).

type Aba = 'pendentes' | 'carrinho';

const pendingDetail = (i: Item) =>
  `${i.quantity} un. · ${i.unitPriceCents != null ? `${formatBRL(i.unitPriceCents)} cada` : 'sem preço'}`;
const cartDetail = (i: Item) => `${i.quantity} × ${formatBRL(i.unitPriceCents ?? 0)}`;
const itemTotal = (i: Item) => (i.unitPriceCents != null ? formatBRL(subtotal(i.quantity, i.unitPriceCents)) : undefined);

export default function Compra() {
  const { color } = useOnda();
  const purchase = useStore((s) => s.purchase);
  const [adding, setAdding] = useState(false);
  const [aba, setAba] = useState<Aba>('pendentes');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!purchase) return <Redirect href="/inicio" />;

  const spent = spentCents(purchase);
  const pending = pendingItems(purchase);
  const cart = cartItems(purchase);
  const list = aba === 'pendentes' ? pending : cart;
  const selected = purchase.items.find((i) => i.id === selectedId) ?? null;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.root, { backgroundColor: color.bg.canvas }]}>
      <TopBar title={purchase.name} onBack={() => (router.canGoBack() ? router.back() : router.replace('/inicio'))} />
      <View style={styles.summary}>
        <BudgetSummary budgetCents={purchase.budgetCents} spentCents={spent} />
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
        <>
          <View style={styles.tabs}>
            <Tabs
              value={aba}
              onChange={setAba}
              tabs={[
                { key: 'pendentes', label: 'Pendentes', count: pending.length },
                { key: 'carrinho', label: 'No carrinho', count: cart.length },
              ]}
            />
          </View>
          <ScrollView style={styles.flex} contentContainerStyle={styles.listContent}>
            {list.length > 0 ? (
              <View style={[styles.card, { backgroundColor: color.bg.surface, borderColor: color.border.default }]}>
                {list.map((item, index) => (
                  <ItemRow
                    key={item.id}
                    name={item.name}
                    status={item.inCart ? 'inCart' : 'pending'}
                    detail={item.inCart ? cartDetail(item) : pendingDetail(item)}
                    amount={itemTotal(item)}
                    onPress={() => setSelectedId(item.id)}
                    last={index === list.length - 1}
                  />
                ))}
              </View>
            ) : (
              // PROVISÓRIO: estado vazio de cada aba ainda não foi desenhado no Figma.
              <Text style={[text.body.medium, styles.tabEmpty, { color: color.text.secondary }]}>
                {aba === 'pendentes'
                  ? 'Tudo no carrinho!'
                  : 'Nada no carrinho ainda. Toque num item pendente para colocar.'}
              </Text>
            )}
          </ScrollView>
        </>
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
          setAba('pendentes');
        }}
      />
      <ColocarNoCarrinhoSheet
        item={selected}
        budgetCents={purchase.budgetCents}
        spentCents={spent}
        onClose={() => setSelectedId(null)}
        onConfirm={(quantity, unitPriceCents) => {
          if (!selected) return;
          if (selected.inCart) actions.updateCartItem(selected.id, quantity, unitPriceCents);
          else actions.putInCart(selected.id, quantity, unitPriceCents);
          setSelectedId(null);
        }}
        onReturnToPending={() => {
          if (selected) actions.returnToPending(selected.id);
          setSelectedId(null);
        }}
      />
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
  summary: {
    paddingHorizontal: space.xl,
    paddingTop: space.md,
  },
  tabs: {
    paddingHorizontal: space.xl,
    paddingTop: space.md,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: space.xl,
  },
  listContent: {
    paddingHorizontal: space.xl,
    paddingVertical: space.md,
  },
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  tabEmpty: {
    textAlign: 'center',
    paddingVertical: space['2xl'],
  },
  footer: {
    paddingHorizontal: space.xl,
    paddingBottom: space.xs,
  },
});

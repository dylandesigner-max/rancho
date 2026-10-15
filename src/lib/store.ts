import { useSyncExternalStore } from 'react';

import { subtotal } from './money';

// Estado do app na memória, até escolhermos onde guardar os dados (serviço de
// contas + armazenamento local). Fechar o app apaga tudo por enquanto.

export type Item = {
  id: string;
  name: string;
  quantity: number;
  /** Preço unitário em centavos; null = ainda sem preço (planejamento). */
  unitPriceCents: number | null;
  inCart: boolean;
};

export type Purchase = {
  id: string;
  name: string;
  budgetCents: number;
  items: Item[];
};

type State = {
  userName: string | null;
  purchase: Purchase | null;
};

let state: State = { userName: null, purchase: null };
const listeners = new Set<() => void>();

const setState = (next: Partial<State>) => {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** Lê um pedaço do estado. O seletor deve devolver algo estável (primitivo ou referência do estado). */
export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(subscribe, () => selector(state), () => selector(state));
}

const newId = () => Math.random().toString(36).slice(2, 10);

export const actions = {
  setUserName(name: string) {
    setState({ userName: name });
  },
  createPurchase(name: string, budgetCents: number) {
    setState({ purchase: { id: newId(), name, budgetCents, items: [] } });
  },
  addItem(item: Omit<Item, 'id' | 'inCart'>) {
    if (!state.purchase) return;
    const next: Item = { ...item, id: newId(), inCart: false };
    setState({ purchase: { ...state.purchase, items: [...state.purchase.items, next] } });
  },
};

/** Gasto = soma dos itens no carrinho que têm preço. */
export function spentCents(purchase: Purchase): number {
  return purchase.items.reduce(
    (sum, i) => (i.inCart && i.unitPriceCents != null ? sum + subtotal(i.quantity, i.unitPriceCents) : sum),
    0,
  );
}

/** Primeiro nome para a saudação ("Dylan Xavier" → "Dylan"). */
export function firstName(name: string | null): string {
  return (name ?? '').trim().split(/\s+/)[0] ?? '';
}

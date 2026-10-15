import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

import { subtotal } from './money';

// Estado do app guardado no aparelho (AsyncStorage; no navegador/PWA vira
// localStorage), para a compra sobreviver a fechar o app e funcionar offline
// no mercado. Ainda sem conta real nem sincronização: isso vem com o Supabase.

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

const STORAGE_KEY = 'rancho/estado/v1';

let state: State = { userName: null, purchase: null };
let hydrated = false;
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((l) => l());

const persist = () => {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {
    // Sem espaço ou armazenamento bloqueado (ex.: navegação privada): segue só na memória.
  });
};

const setState = (next: Partial<State>) => {
  state = { ...state, ...next };
  // Antes de carregar o que está salvo, gravar apagaria os dados guardados.
  if (hydrated) persist();
  notify();
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** Lê um pedaço do estado. O seletor deve devolver algo estável (primitivo ou referência do estado). */
export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(subscribe, () => selector(state), () => selector(state));
}

/** Carrega o estado salvo no aparelho. Chamado uma vez ao abrir o app. */
export async function hydrateStore(): Promise<void> {
  if (hydrated) return;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...state, ...parseSaved(raw) };
  } catch {
    // Dado ilegível ou armazenamento indisponível: começa vazio.
  }
  hydrated = true;
  notify();
}

/** true depois que o estado salvo foi carregado. */
export function useStoreHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => hydrated, () => hydrated);
}

function parseSaved(raw: string): Partial<State> {
  const saved = JSON.parse(raw) as Partial<State> | null;
  if (!saved || typeof saved !== 'object') return {};
  const next: Partial<State> = {};
  if (typeof saved.userName === 'string') next.userName = saved.userName;
  const p = saved.purchase;
  if (p && typeof p.name === 'string' && Number.isInteger(p.budgetCents) && Array.isArray(p.items)) {
    next.purchase = p;
  }
  return next;
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

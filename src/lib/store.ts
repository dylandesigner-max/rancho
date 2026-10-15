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
  /** Quando foi para o carrinho (ms). O último colocado aparece no topo. */
  cartAt?: number;
};

export type Purchase = {
  id: string;
  name: string;
  budgetCents: number;
  items: Item[];
};

/** Aparência escolhida em Meu perfil (tela 14c). "system" segue o aparelho. */
export type Appearance = 'system' | 'light' | 'dark';

type State = {
  userName: string | null;
  userEmail: string | null;
  /** Foto de perfil como data URI (JPEG reduzido). null = usa a inicial do nome. */
  photoUri: string | null;
  appearance: Appearance;
  purchase: Purchase | null;
};

const STORAGE_KEY = 'rancho/estado/v1';
const INITIAL: State = { userName: null, userEmail: null, photoUri: null, appearance: 'system', purchase: null };

let state: State = INITIAL;
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
  if (typeof saved.userEmail === 'string') next.userEmail = saved.userEmail;
  if (typeof saved.photoUri === 'string') next.photoUri = saved.photoUri;
  if (saved.appearance === 'light' || saved.appearance === 'dark') next.appearance = saved.appearance;
  const p = saved.purchase;
  if (p && typeof p.name === 'string' && Number.isInteger(p.budgetCents) && Array.isArray(p.items)) {
    next.purchase = p;
  }
  return next;
}

const newId = () => Math.random().toString(36).slice(2, 10);

const updateItem = (id: string, change: (item: Item) => Item) => {
  if (!state.purchase) return;
  setState({ purchase: { ...state.purchase, items: state.purchase.items.map((i) => (i.id === id ? change(i) : i)) } });
};

export const actions = {
  /** Entrou ou criou conta (serviço simulado em auth.ts). */
  signIn(name: string, email: string) {
    setState({ userName: name, userEmail: email });
  },
  setUserName(name: string) {
    setState({ userName: name });
  },
  setPhoto(uri: string | null) {
    setState({ photoUri: uri });
  },
  setAppearance(appearance: Appearance) {
    setState({ appearance });
  },
  /** Sai da conta. A aparência é do aparelho e fica. */
  signOut() {
    setState({ ...INITIAL, appearance: state.appearance });
  },
  /** Exclui a conta: apaga tudo o que está guardado no aparelho. */
  deleteAccount() {
    setState(INITIAL);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  },
  createPurchase(name: string, budgetCents: number) {
    setState({ purchase: { id: newId(), name, budgetCents, items: [] } });
  },
  addItem(item: Omit<Item, 'id' | 'inCart'>) {
    if (!state.purchase) return;
    const next: Item = { ...item, id: newId(), inCart: false };
    setState({ purchase: { ...state.purchase, items: [...state.purchase.items, next] } });
  },
  /** Tela 11: confirma quantidade e preço e põe no carrinho (vai para o topo). */
  putInCart(id: string, quantity: number, unitPriceCents: number) {
    updateItem(id, (i) => ({ ...i, quantity, unitPriceCents, inCart: true, cartAt: Date.now() }));
  },
  /** Tela 11, item do carrinho: corrige quantidade e preço sem mudar a ordem. */
  updateCartItem(id: string, quantity: number, unitPriceCents: number) {
    updateItem(id, (i) => ({ ...i, quantity, unitPriceCents }));
  },
  returnToPending(id: string) {
    updateItem(id, (i) => ({ ...i, inCart: false, cartAt: undefined }));
  },
  /** Tela 13: sem histórico no MVP, concluir apaga a compra. */
  concludePurchase() {
    setState({ purchase: null });
  },
};

/** Gasto = soma dos itens no carrinho que têm preço. */
export function spentCents(purchase: Purchase): number {
  return purchase.items.reduce(
    (sum, i) => (i.inCart && i.unitPriceCents != null ? sum + subtotal(i.quantity, i.unitPriceCents) : sum),
    0,
  );
}

/** Pendentes na ordem em que foram adicionados. */
export function pendingItems(purchase: Purchase): Item[] {
  return purchase.items.filter((i) => !i.inCart);
}

/** No carrinho, o último colocado primeiro. */
export function cartItems(purchase: Purchase): Item[] {
  return purchase.items.filter((i) => i.inCart).sort((a, b) => (b.cartAt ?? 0) - (a.cartAt ?? 0));
}

/** Primeiro nome para a saudação ("Dylan Xavier" → "Dylan"). */
export function firstName(name: string | null): string {
  return (name ?? '').trim().split(/\s+/)[0] ?? '';
}

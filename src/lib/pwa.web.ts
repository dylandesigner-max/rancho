import { useSyncExternalStore } from 'react';

// PWA: service worker (abrir offline), aviso de versão nova e cor da barra.

let waiting: ServiceWorker | null = null;
let updateRequested = false;
const listeners = new Set<() => void>();
const setWaiting = (worker: ServiceWorker | null) => {
  waiting = worker;
  listeners.forEach((l) => l());
};

/**
 * Registra o service worker (`/sw.js`, gerado por `scripts/build-pwa.mjs` no
 * `npm run build:web`) para o app abrir sem internet no mercado. Fica de fora no
 * modo de desenvolvimento, onde o cache atrapalharia o recarregamento.
 */
export function registerServiceWorker(): void {
  if (__DEV__ || typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  const sw = navigator.serviceWorker;
  sw.register('/sw.js')
    .then((registration) => {
      // Versão nova já baixada e esperando (só conta se já existe uma versão rodando).
      if (registration.waiting && sw.controller) setWaiting(registration.waiting);
      registration.addEventListener('updatefound', () => {
        const next = registration.installing;
        next?.addEventListener('statechange', () => {
          if (next.state === 'installed' && sw.controller) setWaiting(next);
        });
      });
      // No iPhone o PWA quase não recarrega: procura versão nova sempre que volta para a tela.
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') registration.update().catch(() => {});
      });
    })
    .catch(() => {
      // Sem service worker o app funciona igual, só não abre offline.
    });
  // Quando a versão nova assume (depois de "Atualizar"), recarrega uma vez já com ela.
  sw.addEventListener('controllerchange', () => {
    if (!updateRequested) return;
    updateRequested = false;
    window.location.reload();
  });
  // Pede ao navegador para não apagar os dados guardados quando faltar espaço.
  navigator.storage?.persist?.().catch(() => {});
}

/** true quando há uma versão nova do app pronta para assumir. */
export function useUpdateReady(): boolean {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => waiting !== null,
    () => false,
  );
}

/** "Atualizar": a versão nova assume e o app recarrega nela. */
export function applyUpdate(): void {
  if (!waiting) return;
  updateRequested = true;
  waiting.postMessage('SKIP_WAITING');
}

/**
 * Cor da barra do navegador/PWA e fundo da página. O HTML gerado traz uma cor por
 * modo do aparelho (media query); com Aparência fixa em Claro ou Escuro, a cor
 * passa a ser a do app, sem media query.
 */
export function applyThemeColor(color: string): void {
  if (typeof document === 'undefined') return;
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.setAttribute('content', color);
    meta.removeAttribute('media');
  });
  document.body.style.backgroundColor = color;
}

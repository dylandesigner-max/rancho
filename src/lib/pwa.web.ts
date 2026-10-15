/**
 * Registra o service worker (`/sw.js`, gerado por `scripts/build-pwa.mjs` no
 * `npm run build:web`) para o app abrir sem internet no mercado. Fica de fora no
 * modo de desenvolvimento, onde o cache atrapalharia o recarregamento.
 */
export function registerServiceWorker(): void {
  if (__DEV__ || typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('/sw.js').catch(() => {
    // Sem service worker o app funciona igual, só não abre offline.
  });
  // Pede ao navegador para não apagar os dados guardados quando faltar espaço.
  navigator.storage?.persist?.().catch(() => {});
}

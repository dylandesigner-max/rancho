// No app nativo não há service worker nem barra do navegador. Ver `pwa.web.ts`.

export function registerServiceWorker(): void {}

/** Atualizações do app nativo vêm pela loja ou pelo EAS Update, não por este aviso. */
export function useUpdateReady(): boolean {
  return false;
}

export function applyUpdate(): void {}

export function applyThemeColor(_color: string): void {}

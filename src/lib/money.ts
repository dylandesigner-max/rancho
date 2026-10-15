// Dinheiro sempre em centavos inteiros: nada de float nas contas.
// Ex.: 12 × R$ 5,99 = 12 × 599 = 7188 centavos = R$ 71,88.

/** 7188 → "71,88"; 90000 → "900,00"; 123456 → "1.234,56". */
export function formatAmount(cents: number): string {
  const negative = cents < 0;
  const abs = Math.abs(Math.round(cents));
  const reais = Math.floor(abs / 100);
  const centavos = String(abs % 100).padStart(2, '0');
  const withDots = String(reais).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${negative ? '−' : ''}${withDots},${centavos}`;
}

/** 7188 → "R$ 71,88". Valores negativos (saldo estourado) → "−R$ 12,30". */
export function formatBRL(cents: number): string {
  const text = formatAmount(Math.abs(cents));
  return cents < 0 ? `−R$ ${text}` : `R$ ${text}`;
}

/**
 * Campo de valor estilo app de banco: só dígitos, preenchendo a partir dos centavos.
 * "9" → 9; "90000" → 90000; "R$ 5,99" → 599.
 */
export function digitsToCents(text: string): number {
  const digits = text.replace(/\D/g, '').slice(0, 10);
  return digits ? parseInt(digits, 10) : 0;
}

/** Subtotal de um item: quantidade × preço unitário, exato em centavos. */
export function subtotal(quantity: number, unitPriceCents: number): number {
  return quantity * unitPriceCents;
}

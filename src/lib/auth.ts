// Serviço de contas SIMULADO, até escolhermos o real (Supabase, Firebase…).
// Só imita a rede para dar para navegar pelos estados das telas.
//
// Para ver os estados de erro no app: use um e-mail que contenha "erro"
// (ex.: erro@rancho.app).

import { actions } from './store';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const simulatesError = (email: string) => email.toLowerCase().includes('erro');

/** Sem servidor, o "nome da conta" no login vem da parte do e-mail antes do @ (dylan@… → Dylan). */
const nameFromEmail = (email: string) => {
  const local = email.split('@')[0]?.split(/[._-]/)[0] ?? '';
  return local.charAt(0).toUpperCase() + local.slice(1);
};

export type SignInResult = { ok: true } | { ok: false; reason: 'invalid-credentials' };
export type SignUpResult = { ok: true } | { ok: false; reason: 'email-in-use' };

export async function signIn(email: string, _password: string): Promise<SignInResult> {
  await wait(1200);
  if (simulatesError(email)) return { ok: false, reason: 'invalid-credentials' };
  actions.signIn(nameFromEmail(email), email.trim());
  return { ok: true };
}

export async function signUp(name: string, email: string, _password: string): Promise<SignUpResult> {
  await wait(1200);
  if (simulatesError(email)) return { ok: false, reason: 'email-in-use' };
  actions.signIn(name, email.trim());
  return { ok: true };
}

/** Sempre "dá certo": a tela nunca revela se o e-mail tem conta. */
export async function sendPasswordReset(_email: string): Promise<void> {
  await wait(1200);
}

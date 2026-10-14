// Serviço de contas SIMULADO, até escolhermos o real (Supabase, Firebase…).
// Só imita a rede para dar para navegar pelos estados das telas.
//
// Para ver os estados de erro no app: use um e-mail que contenha "erro"
// (ex.: erro@rancho.app).

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const simulatesError = (email: string) => email.toLowerCase().includes('erro');

export type SignInResult = { ok: true } | { ok: false; reason: 'invalid-credentials' };
export type SignUpResult = { ok: true } | { ok: false; reason: 'email-in-use' };

export async function signIn(email: string, _password: string): Promise<SignInResult> {
  await wait(1200);
  return simulatesError(email) ? { ok: false, reason: 'invalid-credentials' } : { ok: true };
}

export async function signUp(_name: string, email: string, _password: string): Promise<SignUpResult> {
  await wait(1200);
  return simulatesError(email) ? { ok: false, reason: 'email-in-use' } : { ok: true };
}

/** Sempre "dá certo": a tela nunca revela se o e-mail tem conta. */
export async function sendPasswordReset(_email: string): Promise<void> {
  await wait(1200);
}

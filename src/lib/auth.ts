import { isAuthApiError, isAuthRetryableFetchError } from '@supabase/supabase-js';
import { router } from 'expo-router';
import { Platform } from 'react-native';

import { fetchProfile, removeAvatar, syncProfile } from './profile';
import { actions, getState } from './store';
import { supabase } from './supabase';

// Contas. Com as chaves do Supabase configuradas (src/lib/supabase.ts), tudo é real:
// entrar, criar conta, trocar senha por e-mail, sair e excluir conta.
//
// Sem as chaves, cai no modo SIMULADO (só imita a rede), para o app continuar
// navegável no desenvolvimento. Nesse modo, e-mails com "erro" simulam falha
// (ex.: erro@rancho.app).

export type AuthFailure = 'invalid-credentials' | 'email-in-use' | 'network' | 'expired-link' | 'unknown';
export type AuthResult = { ok: true } | { ok: false; reason: AuthFailure };

const simulated = !supabase;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const simulatesError = (email: string) => email.toLowerCase().includes('erro');

/** Sem servidor, o "nome da conta" no login vem da parte do e-mail antes do @ (dylan@… → Dylan). */
const nameFromEmail = (email: string) => {
  const local = email.split('@')[0]?.split(/[._-]/)[0] ?? '';
  return local.charAt(0).toUpperCase() + local.slice(1);
};

function failure(error: unknown, fallback: AuthFailure = 'unknown'): AuthResult {
  if (isAuthRetryableFetchError(error)) return { ok: false, reason: 'network' };
  if (isAuthApiError(error)) {
    if (error.code === 'invalid_credentials') return { ok: false, reason: 'invalid-credentials' };
    if (error.code === 'user_already_exists' || error.code === 'email_exists') return { ok: false, reason: 'email-in-use' };
  }
  if (error instanceof TypeError) return { ok: false, reason: 'network' };
  return { ok: false, reason: fallback };
}

/** Guarda no aparelho o nome, o e-mail e a foto da conta que acabou de entrar. */
async function rememberUser(userId: string, email: string, fallbackName: string) {
  const profile = await fetchProfile(userId).catch(() => ({ name: '', photoUri: null }));
  actions.signIn(profile.name || fallbackName, email, profile.photoUri);
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  if (simulated) {
    await wait(1200);
    if (simulatesError(email)) return { ok: false, reason: 'invalid-credentials' };
    actions.signIn(nameFromEmail(email), email.trim());
    return { ok: true };
  }
  try {
    const { data, error } = await supabase!.auth.signInWithPassword({ email, password });
    if (error) return failure(error, 'invalid-credentials');
    await rememberUser(data.user.id, data.user.email ?? email, nameFromEmail(email));
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

export async function signUp(name: string, email: string, password: string): Promise<AuthResult> {
  if (simulated) {
    await wait(1200);
    if (simulatesError(email)) return { ok: false, reason: 'email-in-use' };
    actions.signIn(name, email.trim());
    return { ok: true };
  }
  try {
    // Sem confirmação de e-mail (decisão de 16/10): a conta já nasce com sessão.
    const { data, error } = await supabase!.auth.signUp({ email, password, options: { data: { name } } });
    if (error) return failure(error);
    // Com o e-mail já cadastrado, o Supabase responde sem sessão e sem dizer por quê.
    if (!data.session || !data.user || data.user.identities?.length === 0) return { ok: false, reason: 'email-in-use' };
    actions.signIn(name, data.user.email ?? email);
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

/** Sempre "dá certo" para a tela: ela nunca revela se o e-mail tem conta. */
export async function sendPasswordReset(email: string): Promise<void> {
  if (simulated) {
    await wait(1200);
    return;
  }
  // O link do e-mail abre a tela 05b · Nova senha. Precisa estar na lista de
  // "Redirect URLs" do Supabase (ver docs/supabase.md).
  const redirectTo = Platform.OS === 'web' && typeof window !== 'undefined' ? `${window.location.origin}/nova-senha` : undefined;
  await supabase!.auth.resetPasswordForEmail(email, { redirectTo }).catch(() => {});
}

/** Tela 05b: true se o link do e-mail abriu uma sessão válida para trocar a senha. */
export async function hasRecoverySession(): Promise<boolean> {
  if (simulated) return true;
  const { data } = await supabase!.auth.getSession();
  return !!data.session;
}

/** Tela 05b: troca a senha e entra no app. */
export async function updatePassword(password: string): Promise<AuthResult> {
  if (simulated) {
    await wait(1200);
    return { ok: true };
  }
  try {
    const { data, error } = await supabase!.auth.updateUser({ password });
    if (error) return failure(error, 'expired-link');
    const email = data.user.email ?? '';
    await rememberUser(data.user.id, email, nameFromEmail(email));
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

/** Sai da conta (tela 14). Funciona mesmo sem internet. */
export async function signOut(): Promise<void> {
  actions.signOut();
  if (!simulated) await supabase!.auth.signOut({ scope: 'local' }).catch(() => {});
}

/** Exclui a conta de verdade (tela 16): foto, perfil e login. Precisa de internet. */
export async function deleteAccount(): Promise<AuthResult> {
  if (!simulated) {
    try {
      const { data } = await supabase!.auth.getUser();
      if (data.user) await removeAvatar(data.user.id);
      const { error } = await supabase!.rpc('delete_account');
      if (error) return failure(error);
      await supabase!.auth.signOut({ scope: 'local' }).catch(() => {});
    } catch (error) {
      return failure(error);
    }
  }
  actions.deleteAccount();
  return { ok: true };
}

/**
 * Ao abrir o app: confere a sessão salva, envia mudanças pendentes do perfil e
 * leva o link de troca de senha para a tela 05b.
 */
export async function initAuth(): Promise<void> {
  if (simulated) return;
  supabase!.auth.onAuthStateChange((event) => {
    if (event === 'PASSWORD_RECOVERY') router.replace('/nova-senha');
  });
  const { data } = await supabase!.auth.getSession();
  if (!data.session) {
    // Sem sessão (ou dado do modo simulado antigo): pede login de novo. A compra fica.
    if (getState().userName) actions.signOut();
    return;
  }
  const user = data.session.user;
  if (!getState().userName) {
    const email = user.email ?? '';
    await rememberUser(user.id, email, nameFromEmail(email));
  }
  await syncProfile();
}

/** Texto do erro para mostrar no campo, por motivo. */
export function authMessage(reason: AuthFailure): string {
  switch (reason) {
    case 'invalid-credentials':
      return 'E-mail ou senha incorretos. Confira e tente de novo.';
    case 'email-in-use':
      return 'Este e-mail já tem uma conta. Tente entrar.';
    case 'network':
      return 'Sem conexão. Confira a internet e tente de novo.';
    case 'expired-link':
      return 'Este link expirou. Peça um novo em "Esqueci a senha".';
    default:
      return 'Algo deu errado. Tente de novo em instantes.';
  }
}

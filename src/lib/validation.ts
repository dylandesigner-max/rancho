export const MIN_PASSWORD_LENGTH = 8;

/** Validação de formato só para pegar erros de digitação; quem confirma o e-mail é o serviço de contas. */
export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

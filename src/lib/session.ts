import { router } from 'expo-router';

/** Depois de sair ou excluir a conta: limpa a pilha de telas e volta para Boas-vindas. */
export function goToWelcome() {
  if (router.canDismiss()) router.dismissAll();
  router.replace('/');
}

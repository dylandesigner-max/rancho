// E-mail digitado na tela de Entrar, para pré-preencher "Esqueci a senha".
// Fica só na memória: passar por parâmetro de rota colocaria o e-mail na URL
// (e no histórico do navegador) na versão web.

let draft = '';

export const emailDraft = {
  get: () => draft,
  set: (email: string) => {
    draft = email;
  },
};

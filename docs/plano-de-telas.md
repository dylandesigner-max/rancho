# Plano de telas: MVP (v2)

> **Status:** aprovado em 14 de outubro de 2026.
> **Processo:** cada tela é desenhada no [Figma](https://www.figma.com/design/imkUw2bVyRrBlHJt9v9Wsp/Rancho), aprovada e só então implementada. Componentes do Onda nascem conforme as telas pedem.

## Decisões

- **Login obrigatório.** Formas de entrar: Apple, Google e e-mail com senha. Com Apple/Google, a mesma ação serve para entrar e para criar conta.
- **Uma tela só para planejar e comprar.** O preço é opcional ao planejar e pedido ao colocar o item no carrinho.
- **Fora do MVP:** histórico, lista compartilhada, inventário da casa, categorias.

## A. Entrada

| # | Tela | Conteúdo |
|---|------|----------|
| 1 | Splash | Logo sobre o fundo da marca enquanto o app carrega fontes e sessão. |
| 2 | Boas-vindas | Slogan; "Continuar com Apple", "Continuar com Google", "Entrar com e-mail". |
| 3 | Entrar com e-mail | E-mail, senha, "Esqueci a senha", link para criar conta. |
| 4 | Criar conta | Nome, e-mail, senha, aceite de Termos e Privacidade. |
| 5 | Esqueci a senha | E-mail e confirmação "Enviamos um link". |

## B. Compra

| # | Tela | Conteúdo |
|---|------|----------|
| 6 | Início (vazio) | Saudação, avatar (leva ao perfil), estado vazio e "Nova compra". |
| 7 | Nova compra | Nome da compra (sugestão "Rancho de outubro") e orçamento em R$. |
| 8 | Compra: lista vazia | Cabeçalho da compra e resumo do orçamento; começar a lista. |
| 9 | Adicionar item | Nome, quantidade (+/−), preço opcional. |
| 10 | Compra em andamento | Abas Pendentes / No carrinho; orçamento, total e saldo sempre visíveis. |
| 11 | Colocar no carrinho | Preço × quantidade gera o subtotal na hora, com prévia do novo total e saldo. |
| 12 | Alertas de orçamento | Estados do resumo: perto do limite (âmbar) e estourou (vermelho). |
| 13 | Concluir compra *(opcional)* | Gasto contra orçamento e itens que ficaram de fora. |

## C. Conta

| # | Tela | Conteúdo |
|---|------|----------|
| 14 | Meu perfil | Avatar com iniciais, nome, e-mail, forma de login, Termos, Privacidade, Sair, Excluir conta. |
| 15 | Editar perfil | Nome. |
| 16 | Excluir conta | Confirmação (exigência da Apple para apps com criação de conta). |

## Ordem de design

A → B → C. As telas de entrada criam os componentes básicos (botão, campo, link) que o resto reaproveita.

## Pendências técnicas

- Serviço de autenticação e dados (ex.: Supabase ou Firebase): decidir antes de implementar a tela 2.
- Login com Apple e Google não roda no Expo Go; para testar no celular será preciso uma development build.

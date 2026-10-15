# Status do Rancho

> **Leia este arquivo no início de toda sessão e atualize no fim.** Ele é a memória do projeto: o que existe no Figma e no código, o que foi decidido e o que vem a seguir. Assim uma sessão nova (local ou na nuvem) continua de onde a anterior parou sem refazer descobertas.
>
> **Última atualização:** 14/10/2026 · telas 1 a 9 desenhadas, aprovadas e implementadas.

---

## 1. Visão rápida

| | |
|---|---|
| **Produto** | App de compra do mês: planejar a lista, controlar gastos na hora e aprender com o histórico. Brief completo em [`docs/product-brief.md`](docs/product-brief.md). |
| **Quem** | Projeto de portfólio de Product Design (designer = dono do produto). Comunicação em pt-BR. |
| **Repositório** | [github.com/dylandesigner-max/rancho](https://github.com/dylandesigner-max/rancho) (público) |
| **Figma** | [Rancho](https://www.figma.com/design/imkUw2bVyRrBlHJt9v9Wsp/Rancho) · fileKey `imkUw2bVyRrBlHJt9v9Wsp` |
| **Design system** | **Onda** (no Figma: página Design System; no código: `src/theme/onda` + `src/components/onda`) |
| **Stack** | Expo SDK 57 · React Native 0.86 · Expo Router · TypeScript · Reanimated · react-native-svg · Lucide |
| **Plano de telas** | [`docs/plano-de-telas.md`](docs/plano-de-telas.md) (v2, aprovado) |

## 2. Processo de trabalho (regras)

1. **Figma primeiro.** Cada tela é desenhada no Figma, revisada pelo designer e **só depois de aprovada** vai para o código.
2. **Componentes sob demanda.** O Onda cresce com as telas: componente novo só quando uma tela pede.
3. **O designer ajusta direto no Figma** (ex.: medidas de componentes). Ao sincronizar, ler os valores reais do Figma, conferir variantes irmãs e propagar para variantes, tokens e código.
4. **Tokens do código espelham o Figma.** Nunca editar `src/theme/onda/tokens.ts` à mão.
5. **Cada entrega no código vai por branch + PR.** Merge para `main` só com aprovação do designer.
6. **Antes de declarar pronto:** `npx tsc --noEmit`, `npx expo lint` e, quando houver tela nova, `npx expo export --platform android` + teste no navegador (390×844).

## 3. Telas: estado

Seções na página **Prototype** do Figma, cada uma com linha Light e Dark (frames 390×844).

| # | Tela | Figma (seção) | Aprovada | Código |
|---|------|---------------|----------|--------|
| 1 | Splash (nativa + animação da onda) | `01 · Splash` (30:33) | ✅ | ✅ `src/components/splash/animated-splash.tsx` + splash nativa no `app.json` |
| 2 | Boas-vindas | `02 · Boas-vindas` (37:74) | ✅ | ✅ `src/app/(auth)/index.tsx` |
| 3 | Entrar com e-mail | `03 · Entrar com e-mail` (47:132) | ✅ | ✅ `src/app/(auth)/entrar.tsx` |
| 4 | Criar conta | `04 · Criar conta` (55:296) | ✅ | ✅ `src/app/(auth)/criar-conta.tsx` |
| 5 | Esqueci a senha | `05 · Esqueci a senha` (63:531) | ✅ | ✅ `src/app/(auth)/esqueci-a-senha.tsx` |
| 6 | Início (vazio) | `06 · Início` (66:641) | ✅ | ✅ `src/app/(app)/inicio.tsx` |
| 7 | Nova compra (folha) | `07 · Nova compra` (75:680) | ✅ | ✅ `src/components/compra/nova-compra-sheet.tsx` |
| 8 | Compra: lista vazia | `08 · Compra` (82:876) | ✅ | ✅ `src/app/(app)/compra.tsx` |
| 9 | Adicionar item (folha) | `09 · Adicionar item` (93:888) | ✅ | ✅ `src/components/compra/adicionar-item-sheet.tsx` |
| 10 | Compra em andamento | — | ⏳ próxima | ⚠️ lista provisória no código |
| 11 | Colocar no carrinho | — | — | — |
| 12 | Alertas de orçamento | — | — | — |
| 13 | Concluir compra *(opcional)* | — | — | — |
| 14 | Meu perfil | — | — | — (avatar mostra "Em breve") |
| 15 | Editar perfil | — | — | — |
| 16 | Excluir conta | — | — | — |

**Lacunas conhecidas (não estão no plano v2, a desenhar):**
- **Início com compra em andamento** (cartão com orçamento e progresso). Hoje o código mostra um texto provisório + "Abrir compra". Proposto desenhar depois das telas 8–10.
- **Editar nome/orçamento da compra** depois de criada.
- **Depois de adicionar item:** a folha fecha (padrão atual). Alternativa em aberto: continuar aberta para o próximo item.

As seções originais do designer na página Prototype ("Splash", "Login e Cadastro", "Fluxo Principal", "Meu perfil") são explorações dele: **não apagar**.

## 4. Design system Onda

### 4.1 Foundations (Figma → variáveis locais)

| Coleção | Conteúdo |
|---|---|
| **Primitives** (60) | Escalas 50–950 de `green`, `orange`, `neutral` (creme → cacau), `amber`, `red`; `base/white`; transparências `green/400-a40`, `green/300-a40`, `neutral/950-a50`, `neutral/950-a70`. Cores da marca fixas nos degraus (marcadas com ● na amostra). |
| **Color** (43, modos Light/Dark) | Semânticas `bg/*`, `text/*`, `icon/*`, `border/*`, sempre apontando para primitivas. Inclui `bg/overlay`, `border/brand-subtle` e `icon/accent`. |
| **Spacing** | `space/none, 3xs(2), 2xs(4), xs(8), sm(12), md(16), lg(20), xl(24), 2xl(32), 3xl(40), 4xl(48), 5xl(64)` |
| **Radius** | `radius/none, xs(4), sm(8), md(12), lg(16), xl(24), full(9999)` |
| **Typography** | Família (Lilita One / Nunito Sans), peso, tamanho e altura de linha. 15 text styles: Display L/M, Heading L/M/S, Body L/M/S, Label L/M/S, Caption, Amount L/M/S. |

Amostra visual: página **Design System** → frame **"Onda · Foundations"** (24:49).

### 4.2 Componentes (Figma: "Onda · Componentes", 30:31 · código: `src/components/onda/`)

| Componente | Figma | Notas |
|---|---|---|
| Logo (Full, Mark) | 30:32 | Vetores do Branding; cores = `bg/brand`, `bg/canvas`, `text/primary`. |
| Button (Primary: Default, Pressed, Disabled, Loading) | 35:11 | Altura 60, face 52 + borda 3D de 8 px (`bg/brand-pressed`). Pressionado afunda 8. |
| SocialButton (Apple, Google) | 35:23 | Textos oficiais pt-BR. Apple só no iOS; no app final usar botão nativo. |
| Ícones (Lucide, 24, traço 2) | vários | arrow-left, eye, eye-off, circle-alert, loader-circle, check, mail-check, shopping-basket, clipboard-list, x, minus, plus. No código: import por arquivo (`lucide-react-native/icons/<nome>`). |
| IconButton | 46:25 | Área de toque 44. |
| TextField (Default, Focus, Filled, Error) | 46:69 | Campo 52, borda 1 (2 em foco/erro). |
| Checkbox (false, true) | 54:16 | Linha inteira tocável. |
| Avatar | 65:15 | Inicial do nome, círculo 40 / toque 44. |
| EmptyState | 65:18 | Círculo 96 `bg/brand-subtle` + contorno 2 `border/brand-subtle`. |
| SheetHeader / BottomSheet | 74:20 | Alça, título, fechar; folha `bg/surface` com cantos `radius/xl` sobre `bg/overlay`. |
| AmountField (Default, Focus, Filled) | 74:51 | Mesmas medidas do TextField; "R$" fixo; digitação a partir dos centavos. |
| TopBar | 82:24 | Voltar + título opcional (Heading/Medium). |
| ProgressBar | 82:51 | Trilho `bg/subtle`, preenchimento **`bg/accent` (laranja)**. |
| BudgetSummary (Normal) | 82:64 | Saldo em destaque (Amount/Large), barra, gasto/orçamento. Estados de alerta virão na tela 12. |
| QuantityStepper | 91:27 | − e + em `icon/accent` sobre `bg/accent-subtle`; mínimo 1. |

## 5. Código

### 5.1 Estrutura

```
src/app/(auth)/        telas 2–5 (index = Boas-vindas)
src/app/(app)/         inicio.tsx (tela 6), compra.tsx (tela 8)
src/components/onda/   componentes do design system
src/components/auth/   AuthLayout, AuthHeader, TextLink
src/components/compra/ folhas Nova compra e Adicionar item
src/components/splash/ animação da Splash
src/lib/               auth (simulado), store (memória), money, validation, email-draft
src/theme/onda/        tokens gerados + fontes + useOnda()
design/tokens/         export das variáveis do Figma (onda.figma.json)
scripts/build-tokens.mjs  gera src/theme/onda/tokens.ts (npm run tokens)
```

### 5.2 Convenções

- **Dinheiro em centavos inteiros** (`src/lib/money.ts`). Conferido com o exemplo do brief: 347,82 + 12 × 5,99 = **419,70**; saldo de 900,00 = **480,30**.
- **Cores só por token** via `useOnda()` (modo do sistema). Nada de hex solto.
- **Nomes de token:** `bg/brand-pressed` → `color.bg.brandPressed`; `Amount/Large` → `text.amount.large`.
- **Sincronizar tokens:** reexportar as variáveis do Figma para `design/tokens/onda.figma.json` e rodar `npm run tokens`.
- **Nada de dados pessoais em parâmetros de rota** (na web viram URL).
- **Trechos sem design** ficam marcados com `// PROVISÓRIO`.
- **Web:** campos usam `noWebFocusOutline` e `flexBasis: 0` (senão o navegador desenha contorno amarelo e estica o input). Animações dentro de `Modal` com o `Animated` do React Native (o Reanimated não anima entrada dentro de Modal na web).

### 5.3 Simulações (até existir backend)

- **Contas:** `src/lib/auth.ts` só imita a rede. Qualquer e-mail entra; **e-mails com "erro" simulam falha** (ex.: `erro@rancho.app`). No login, o nome vem do e-mail (dylan@… → Dylan).
- **Dados:** `src/lib/store.ts` guarda usuário e compra **só na memória**. Fechar o app apaga tudo.

## 6. Decisões (registro)

| Data | Decisão |
|---|---|
| 14/10 | Expo + TypeScript; repositório público. |
| 14/10 | Paleta = seção **Branding** do Figma (não as paletas do ChatGPT); escalas tonais geradas em OKLCH com as cores da marca fixas. |
| 14/10 | Âmbar e vermelho para alertas de orçamento; laranja fica como cor de marca. |
| 14/10 | Light e Dark desde o início; **Dark em cacau** (`neutral/950`), não verde-escuro. |
| 14/10 | Tipografia: Lilita One (títulos) + Nunito Sans (resto). |
| 14/10 | Texto escuro sobre o verde-limão (branco tem contraste 2,4:1). Pedido de branco foi cancelado pelo designer — **não reabrir**. |
| 14/10 | Plano de telas v2: entrada com Splash, Boas-vindas, Login, Cadastro, Esqueci a senha; login obrigatório com Apple, Google e e-mail. |
| 14/10 | Telas em 390×844. |
| 14/10 | Mensagens de erro de login genéricas (não revelam se o e-mail existe). No cadastro, "este e-mail já tem conta" é aceito (padrão de mercado). |
| 14/10 | Orçamento obrigatório ao criar compra; saldo é o número em destaque no resumo. |
| 14/10 | Usar o **laranja (`bg/accent`) em partes dos componentes** para o app não ficar todo verde (ex.: barra de progresso, stepper, subtotal). Cuidado para não confundir com o âmbar de alerta na tela 12. |
| 14/10 | Uso pessoal sem lojas: **web app instalável (PWA)** no iPhone. Login com Apple fica indisponível nessa fase. |

## 7. Ambiente e ferramentas

- **Windows / PowerShell:** `npx` é bloqueado pela política de scripts → usar **`npx.cmd`** (ou o Bash). Não mudar a política de segurança.
- **GitHub CLI:** instalado em `C:\Program Files\GitHub CLI\gh.exe` (logado como `dylandesigner-max`).
- **Expo Go no iPhone:** exige a **mesma conta Expo** no computador (`npx.cmd expo login`) e no app Expo Go. Já configurado. Celular e computador na mesma Wi-Fi.
- **Figma via MCP:** escrever com `use_figma` seguindo as skills `figma-use` / `figma-generate-library` / `figma-generate-design`.
  - Copiar uma variante para dentro de um component set **perde as ligações de propriedade**; religar depois.
  - Folhas montadas sobre uma cópia de outra tela precisam de nomes de camada únicos (a cópia já tem "Topo").
  - Retorno do `use_figma` tem limite de ~20 KB (exportar SVGs grandes em partes).

## 8. Distribuição (uso pessoal)

- Sem orçamento para App Store / Play Store. Sem Mac → não dá para instalar app nativo de graça.
- Caminho: **PWA** (Safari → Compartilhar → Adicionar à Tela de Início).
- Preferência do designer: **Cloudflare** (hospedagem) e **Supabase** (contas e banco).
- Falta: manifesto/ícones/metas iOS, publicação, **guardar dados no aparelho** (offline no mercado) e, depois, contas e sincronização com Supabase.

## 9. Próximos passos

1. **Tela 10 · Compra em andamento** no Figma (abas Pendentes / No carrinho, resumo sempre visível). Substitui a lista provisória.
2. Telas 11 (colocar no carrinho, com prévia do cálculo) e 12 (alertas: BudgetSummary ganha estados).
3. **PWA** em sessão separada (pode ser na nuvem): manifesto, ícones, persistência local, deploy na Cloudflare.
4. Depois: Supabase (contas reais + sincronização), telas 13–16.

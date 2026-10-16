# Status do Rancho

> **Leia este arquivo no início de toda sessão e atualize no fim.** Ele é a memória do projeto: o que existe no Figma e no código, o que foi decidido e o que vem a seguir. Assim uma sessão nova (local ou na nuvem) continua de onde a anterior parou sem refazer descobertas.
>
> **Última atualização:** 16/10/2026 · telas do plano v2 (mais 06b, 14b, 14c e 05b) desenhadas e implementadas; PWA publicado; **Supabase fase A (contas reais) no ar e testada no iPhone** (cadastro, perfil com nome e foto, sair/entrar, nova senha por e-mail, excluir conta); aviso "Nova versão pronta" no PWA; **visual sem contornos** (V2) no Figma e no código, com o componente `Divider`.

---

## 1. Visão rápida

| | |
|---|---|
| **Produto** | App de compra do mês: planejar a lista, controlar gastos na hora e aprender com o histórico. Brief completo em [`docs/product-brief.md`](docs/product-brief.md). |
| **Quem** | Projeto de portfólio de Product Design (designer = dono do produto). Comunicação em pt-BR. |
| **Repositório** | [github.com/dylandesigner-max/rancho](https://github.com/dylandesigner-max/rancho) (público) |
| **App (PWA)** | [rancho.dylan-dsgner.workers.dev](https://rancho.dylan-dsgner.workers.dev) · Cloudflare Workers, publica sozinho a cada merge na `main` |
| **Figma** | [Rancho](https://www.figma.com/design/imkUw2bVyRrBlHJt9v9Wsp/Rancho) · fileKey `imkUw2bVyRrBlHJt9v9Wsp` |
| **Design system** | **Onda** (no Figma: página Design System; no código: `src/theme/onda` + `src/components/onda`) |
| **Stack** | Expo SDK 57 · React Native 0.86 · Expo Router · TypeScript · Reanimated · react-native-svg · Lucide |
| **Plano de telas** | [`docs/plano-de-telas.md`](docs/plano-de-telas.md) (v2, aprovado) |

## 2. Processo de trabalho (regras)

1. **Figma primeiro.** Cada tela é desenhada no Figma, revisada pelo designer e **só depois de aprovada** vai para o código.
   - **Autonomia (16/10):** o Claude monta componentes e telas no Figma sem pedir licença; o designer avalia direto no Figma. Só decisões importantes de produto vêm como enquete.
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
| 5b | Nova senha (link do e-mail) | `05b · Nova senha` (144:3042) | ✅ | ✅ `src/app/(auth)/nova-senha.tsx` |
| — | PWA · Aviso de atualização | `PWA · Aviso de atualização` (147:3118) | ✅ | ✅ `UpdateBanner` + `src/lib/pwa.web.ts` |
| 6 | Início (vazio) | `06 · Início` (66:641) | ✅ | ✅ `src/app/(app)/inicio.tsx` |
| 7 | Nova compra (folha) | `07 · Nova compra` (75:680) | ✅ | ✅ `src/components/compra/nova-compra-sheet.tsx` |
| 8 | Compra: lista vazia | `08 · Compra` (82:876) | ✅ | ✅ `src/app/(app)/compra.tsx` |
| 9 | Adicionar item (folha) | `09 · Adicionar item` (93:888) | ✅ | ✅ `src/components/compra/adicionar-item-sheet.tsx` |
| 10 | Compra em andamento | `10 · Compra em andamento` (116:1239) | ✅ | ✅ `src/app/(app)/compra.tsx` (⚠️ estado vazio das abas provisório) |
| 11 | Colocar no carrinho (folha) | `11 · Colocar no carrinho` (121:1540) | ✅ | ✅ `src/components/compra/colocar-no-carrinho-sheet.tsx` |
| 12 | Alertas de orçamento | `12 · Alertas de orçamento` (125:2096) | ✅ | ✅ `BudgetSummary` + prévia da folha 11 |
| 13 | Concluir compra (folha; deixou de ser opcional) | `13 · Concluir compra` (129:2614) | ✅ | ✅ `src/components/compra/concluir-compra-sheet.tsx` |
| 14 | Meu perfil | `14 · Meu perfil` (132:2754) | ✅ | ✅ `src/app/(app)/perfil.tsx` (⚠️ Termos/Privacidade mostram "Em breve") |
| 14b | Foto de perfil (escolher, trocar, remover, ajustar) | `14b · Foto de perfil` (137:2892) | ✅ | ✅ `foto-de-perfil.tsx` + `ajustar-foto.tsx` |
| 14c | Aparência (Automático, Claro, Escuro) | `14c · Aparência` (140:3098) | ✅ | ✅ `src/app/(app)/aparencia.tsx` |
| 15 | Editar perfil | `15 · Editar perfil` (132:2900) | ✅ | ✅ `src/app/(app)/editar-perfil.tsx` |
| 16 | Excluir conta | `16 · Excluir conta` (132:3060) | ✅ | ✅ `src/app/(app)/excluir-conta.tsx` |
| 06b | Início com compra em andamento | `06b · Início com compra em andamento` (128:2530) | ✅ | ✅ `src/app/(app)/inicio.tsx` |

**Lacunas conhecidas (não estão no plano v2, a desenhar):**
- ~~Início com compra em andamento~~ → desenhado como 06b (16/10).
- **Estado vazio de cada aba** da tela 10 (ex.: "Tudo no carrinho!").
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
| Ícones (Lucide, 24, traço 2) | vários | arrow-left, eye, eye-off, circle-alert, loader-circle, check, mail-check, shopping-basket, clipboard-list, x, minus, plus, chevron-right, camera, refresh-cw. No código: import por arquivo (`lucide-react-native/icons/<nome>`). |
| IconButton | 46:25 | Área de toque 44. |
| TextField (Default, Focus, Filled, Error) | 46:69 | Campo 52, borda 1 (2 em foco/erro). |
| Checkbox (false, true) | 54:16 | Linha inteira tocável. |
| Avatar (Size: Small, Large · Content: Initial, Photo) | 136:62 | Small: círculo 40 / toque 44. Large: 120, com selo de câmera opcional. Photo: foto em círculo com contorno `border/default`. (A variante Small/Initial manteve o id 65:15.) |
| EmptyState | 65:18 | Círculo 96 `bg/brand-subtle` + contorno 2 `border/brand-subtle`. |
| SheetHeader / BottomSheet | 74:20 | Alça, título, fechar; folha `bg/surface` com cantos `radius/xl` sobre `bg/overlay`. |
| AmountField (Default, Focus, Filled) | 74:51 | Mesmas medidas do TextField; "R$" fixo; digitação a partir dos centavos. |
| TopBar | 82:24 | Voltar + título opcional (Heading/Medium). |
| ProgressBar | 82:51 | Trilho `bg/subtle`, preenchimento **`bg/accent` (laranja)**. |
| BudgetSummary (Normal, Warning, Over) | 82:64 | Saldo em destaque (Amount/Large), barra, gasto/orçamento. Warning (≥ 80%): fundo `bg/warning-subtle`, barra `bg/warning`, aviso. Over: fundo `bg/danger-subtle`, "Acima do orçamento" + excedente em `text/danger`. Propriedade de texto Alerta. |
| QuantityStepper | 91:27 | − e + em `icon/accent` sobre `bg/accent-subtle`; mínimo 1. |
| Button · Danger | 130:53 | Contorno `border/danger`, texto `text/danger`, altura 52; ação destrutiva principal (excluir conta). |
| RadioItem (Selected true/false) | 139:50 | Opção de escolha única: rótulo, descrição opcional, rádio à direita (anel `border/brand` + ponto `bg/brand`). |
| UpdateBanner | 146:47 | Aviso fixo no rodapé do PWA ("Nova versão pronta · Atualizar", X para esconder). Fundo `bg/inverse`, ação em pílula `bg/brand`. |
| ListItem (Default, Danger) | 130:52 | Linha de menu (mín. 52): rótulo, valor opcional, chevron opcional; agrupada em cartão `bg/surface`. |
| Divider (Inset true/false) | 163:49 | Linha de 1 px em `border/default` entre itens de um cartão ou lista; `Inset=true` recua 16 dos lados. Substitui o contorno dos containers. |
| Button · Ghost | 120:29 | Só texto `text/brand`, altura 52; ação secundária (ex.: "Devolver para pendentes"). |
| Tab (Active, Inactive) | 115:30 | Aba com contador; ativa em `bg/surface` com contador `text/accent` sobre `bg/accent-subtle`. |
| Tabs | 115:31 | Trilha `bg/subtle` com duas Tab (Pendentes / No carrinho). |
| ItemRow (Pending, InCart) | 115:54 | Linha tocável (mín. 64): círculo vazio ou check `bg/brand`; nome, detalhe e valor (estimado em `text/secondary`; subtotal em `text/accent`). |

## 5. Código

### 5.1 Estrutura

```
src/app/(auth)/        telas 2–5 (index = Boas-vindas)
src/app/(app)/         inicio (6/06b), compra (8/10), perfil (14), foto-de-perfil e ajustar-foto (14b),
                       aparencia (14c), editar-perfil (15), excluir-conta (16)
src/components/onda/   componentes do design system
src/components/auth/   AuthLayout, AuthHeader, TextLink
src/components/compra/ folhas Nova compra, Adicionar item, Colocar no carrinho, Concluir compra
src/components/perfil/ Grupo (título + cartão de linhas)
src/components/splash/ animação da Splash
src/lib/               auth (Supabase ou simulado), supabase, profile, store (salvo no aparelho), money,
                       validation, notice, pwa,
                       session (sair → Boas-vindas), photo-draft (foto à espera do recorte)
src/theme/onda/        tokens gerados + fontes + useOnda()
design/tokens/         export das variáveis do Figma (onda.figma.json)
scripts/build-tokens.mjs  gera src/theme/onda/tokens.ts (npm run tokens)
scripts/build-pwa.mjs     gera dist/sw.js depois do export web (npm run build:web)
supabase/migrations/   SQL do banco (perfis, fotos, excluir conta)
public/                manifesto, ícones do PWA e _headers da Cloudflare (copiados para dist/)
src/app/+html.tsx      HTML da versão web (metas do iOS, manifesto)
```

### 5.2 Convenções

- **Dinheiro em centavos inteiros** (`src/lib/money.ts`). Conferido com o exemplo do brief: 347,82 + 12 × 5,99 = **419,70**; saldo de 900,00 = **480,30**.
- **Cores só por token** via `useOnda()` (modo do sistema). Nada de hex solto.
- **Nomes de token:** `bg/brand-pressed` → `color.bg.brandPressed`; `Amount/Large` → `text.amount.large`.
- **Sincronizar tokens:** reexportar as variáveis do Figma para `design/tokens/onda.figma.json` e rodar `npm run tokens`.
- **Nada de dados pessoais em parâmetros de rota** (na web viram URL).
- **Trechos sem design** ficam marcados com `// PROVISÓRIO`.
- **Aparência:** `useOnda()` usa a preferência salva (Automático/Claro/Escuro) antes do modo do aparelho; a barra de status e a cor do PWA acompanham (`applyThemeColor`).
- **Ajustar foto:** arrastar e pinçar com Gesture Handler + Reanimated; funciona com toque (testado com toque simulado no Chromium). Com mouse no computador o arrastar não ativa — não é o uso alvo.
- **Web:** campos usam `noWebFocusOutline` e `flexBasis: 0` (senão o navegador desenha contorno amarelo e estica o input). Animações dentro de `Modal` com o `Animated` do React Native (o Reanimated não anima entrada dentro de Modal na web).

### 5.3 Contas e dados

- **Contas (Supabase, fase A):** `src/lib/auth.ts` usa o Supabase quando há `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` no build (cliente em `src/lib/supabase.ts`; perfil e foto em `src/lib/profile.ts`; banco em `supabase/migrations/`). Passo a passo em [`docs/supabase.md`](docs/supabase.md). **Sem as chaves, cai no modo simulado:** qualquer e-mail entra; e-mails com "erro" simulam falha (ex.: `erro@rancho.app`).
- **Teste sem o Supabase real:** build com URL falsa + respostas simuladas no Playwright (o ambiente da nuvem bloqueia `*.supabase.co`). `npm run build:web` limpa o cache do bundler (`--clear`) para não levar chaves de um build anterior.
- **Dados:** `src/lib/store.ts` guarda usuário e compra **no aparelho** (AsyncStorage; na web, `localStorage`), chave `rancho/estado/v1`. Guarda também e-mail, foto (data URI JPEG 512 px) e aparência. Quem já entrou abre direto no Início. Sair limpa a conta mas mantém a compra e a aparência (a compra só existe no aparelho até a fase B); excluir apaga tudo. Nome e foto alterados sem internet ficam em `pendingProfile` e sobem depois.

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
| 16/10 | **Visual sem contornos** (pedido do designer, início da V2): containers e componentes não têm borda; itens de cartão/lista se separam com o `Divider` recuado. Campos: fundo `bg/subtle`; foco = `bg/brand-subtle`, erro = `bg/danger-subtle` (sem anel). Controles desmarcados (Checkbox, Radio, item pendente) = nova cor `bg/control`; Radio marcado = círculo `bg/brand` com ponto. Button Danger = fundo `bg/danger-subtle`. Tab ativa com raio md e trilha do Tabs com raio lg. Tokens sincronizados (brand-subtle mais forte, neutros, bordas com opacidade). |
| 16/10 | **Aviso de atualização do PWA** (pedido do designer): a versão nova espera e o app mostra um aviso fixo no rodapé; "Atualizar" recarrega já na versão nova. Fim de re-adicionar o app à Tela de Início. |
| 16/10 | **Supabase no ar (projeto `rancho`, São Paulo).** A `EXPO_PUBLIC_SUPABASE_URL` é a Project URL **sem** `/rest/v1` (com ele o cadastro dava 404; o app agora corta esse final). Testes no iPhone ok: cadastro, nome e foto (tabela `profiles` e bucket `avatars`), sair/entrar, nova senha por link, excluir conta. O link de nova senha falhou uma vez ("Este link expirou") e funcionou no pedido seguinte: provável link antigo; cada pedido invalida o anterior. |
| 16/10 | **Supabase em duas fases:** A = contas reais (login, cadastro sem confirmação de e-mail, nova senha por link, perfil com nome e foto, excluir conta); B = dados da compra, depois dos esboços da V2. Google fica para depois. |
| 16/10 | Tela extra **14c · Aparência** (pedido do designer): Automático (padrão, segue o aparelho), Claro ou Escuro; vale na hora e fica salvo no aparelho. No código, `useOnda()` passa a respeitar a preferência antes do `useColorScheme()`. |
| 16/10 | Tela extra **14b · Foto de perfil** (pedido do designer): foto escolhida pelo seletor do sistema, recorte em círculo, remover volta à inicial. Fica só no aparelho até existir serviço de contas. |
| 16/10 | **Concluir compra = resumo e recomeça**: mostra gasto final e o que ficou de fora; ao confirmar, a compra é apagada e o Início volta ao vazio. Sem histórico no MVP. Tela 13 deixa de ser opcional. |
| 16/10 | Uma compra por vez no MVP: com compra aberta, o Início mostra a 06b ("Continuar" / "Concluir"). |
| 16/10 | Alerta de orçamento: **âmbar a partir de 80%** do orçamento; vermelho quando passa. Nada é bloqueado. |
| 16/10 | Na folha "Colocar no carrinho" o **preço é obrigatório**; item do carrinho abre a mesma folha para editar ou devolver para pendentes. |
| 15/10 | PWA: dados no aparelho com AsyncStorage (vale para web e nativo); service worker próprio gerado no build (sem biblioteca); deploy na Cloudflare via Workers com arquivos estáticos (`wrangler.jsonc`). Ícones do PWA provisórios até o ícone do app ser desenhado. |

## 7. Ambiente e ferramentas

- **Windows / PowerShell:** `npx` é bloqueado pela política de scripts → usar **`npx.cmd`** (ou o Bash). Não mudar a política de segurança.
- **GitHub CLI:** instalado em `C:\Program Files\GitHub CLI\gh.exe` (logado como `dylandesigner-max`).
- **Expo Go no iPhone:** exige a **mesma conta Expo** no computador (`npx.cmd expo login`) e no app Expo Go. Já configurado. Celular e computador na mesma Wi-Fi.
- **Figma via MCP:** escrever com `use_figma` seguindo as skills `figma-use` / `figma-generate-library` / `figma-generate-design`.
  - Copiar uma variante para dentro de um component set **perde as ligações de propriedade**; religar depois.
  - Folhas montadas sobre uma cópia de outra tela precisam de nomes de camada únicos (a cópia já tem "Topo").
  - Retorno do `use_figma` tem limite de ~20 KB (exportar SVGs grandes em partes).
  - **Contorno externo/interno não sobrevive ao export SVG** (o Figma engorda o desenho e cola formas vizinhas). Ler `fillGeometry` do vetor e desenhar o contorno por baixo com o dobro da espessura, como no `Logo` (corrigido em 16/10: as linhas ao lado do R saíam quebradas).

## 8. Distribuição (uso pessoal)

- Sem orçamento para App Store / Play Store. Sem Mac → não dá para instalar app nativo de graça.
- Caminho: **PWA** (Safari → Compartilhar → Adicionar à Tela de Início).
- Preferência do designer: **Cloudflare** (hospedagem) e **Supabase** (contas e banco).
- **Pronto (15/10):** manifesto, metas do iOS, ícones provisórios, dados no aparelho, abrir offline (service worker) e config da Cloudflare. Detalhes e passo a passo em [`docs/pwa.md`](docs/pwa.md).
- **Publicado (15/10):** https://rancho.dylan-dsgner.workers.dev, projeto da Cloudflare ligado ao GitHub (build `npm run build:web`, deploy `npx wrangler deploy`). Build ok.
- **Testado no iPhone (16/10):** instalação, uso offline e contas reais.
- **Falta:** desenhar o ícone do app no Figma. Depois: sincronização da compra (Supabase fase B).

## 9. Próximos passos

1. **V2:** o designer compartilha os esboços de ideação → planejamento num documento didático para aprovação → Figma → código (mesmo processo). A fase B do Supabase (compra na nuvem) nasce desse plano.
2. Lacunas ainda sem desenho: **estado vazio das abas** (hoje texto provisório), editar nome/orçamento da compra, textos de Termos e Privacidade.
3. Ícone do app no Figma (PWA e nativo ainda provisórios).
4. E-mails do Supabase em português: exige SMTP próprio (hoje o de "Esqueci a senha" chega em inglês).
5. Depois: login com Google.

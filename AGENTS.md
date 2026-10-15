This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

> **Comece por [`Status.md`](Status.md):** estado das telas (Figma e código), componentes do Onda, decisões e próximos passos. Atualize-o ao fim de cada sessão.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## Sobre o Rancho

App de compra do mês (planejar → comprar → aprender). Leia `docs/product-brief.md` antes de decisões de produto.

- Textos de interface em português do Brasil.
- Valores monetários em centavos inteiros (nunca float) — ex.: 12 × R$ 5,99 = R$ 71,88.
- Cores, tipografia, espaçamentos e raios vêm do Onda (`@/theme/onda`): `useOnda()` dá as cores do modo atual (Light/Dark); `text`, `space` e `radius` são estáticos. Nunca use hex solto nem primitivas direto nas telas.
- MVP enxuto: não construir lista compartilhada, inventário ou histórico sem decisão explícita.
- É um case de portfólio: não apresentar hipóteses como resultados validados.

## Processo de design → código

Design system: **Onda**. Fonte da verdade: o arquivo do Figma [Rancho](https://www.figma.com/design/imkUw2bVyRrBlHJt9v9Wsp/Rancho).

1. Foundations primeiro (cores, tipografia, spacing, radius) como variáveis no Figma.
2. Plano de telas.
3. Uma tela por vez: Figma → aprovação de quem desenha → código.
4. Componentes nascem conforme as telas pedem; nada de biblioteca especulativa.

Nunca implemente UI no código antes da tela estar aprovada no Figma. Os tokens do código espelham os nomes das variáveis Onda no Figma.

### Tokens Onda

- `design/tokens/onda.figma.json` é o export das variáveis e text styles do Figma. Para sincronizar: reexporte do Figma, sobrescreva o JSON e rode `npm run tokens`.
- `src/theme/onda/tokens.ts` é gerado. Não edite à mão.
- Nomes: `bg/brand-pressed` no Figma → `color.bg.brandPressed`; `Amount/Large` → `text.amount.large`.
- Fontes (Lilita One e Nunito Sans) entram via `@expo-google-fonts`, importadas por peso em `src/theme/onda/fonts.ts`. Novo peso no Figma = adicionar o import lá e o mapeamento em `scripts/build-tokens.mjs`.

### Componentes e telas

- Componentes do Onda em `src/components/onda/`, um arquivo por componente do Figma (mesmo nome). Crie um novo só quando uma tela aprovada pedir.
- Ícones: Lucide, sempre importados por arquivo (`lucide-react-native/icons/arrow-left`), nunca do pacote inteiro.
- Telas de entrada em `src/app/(auth)/`; o resto do app vai em `src/app/(app)/`.
- Contas: Supabase (`src/lib/auth.ts`, `src/lib/supabase.ts`, `src/lib/profile.ts`; banco em `supabase/migrations/`, ver `docs/supabase.md`). Sem as chaves `EXPO_PUBLIC_SUPABASE_*` no build, o app usa o modo SIMULADO (e-mails com "erro" simulam falha). Nunca coloque a secret/service_role key no app.
- Estado do app (usuário e compra) em `src/lib/store.ts`, salvo no aparelho (AsyncStorage; `localStorage` no PWA). Dinheiro: use `src/lib/money.ts` (centavos inteiros, `formatBRL`, `digitsToCents`, `subtotal`).
- Trechos de interface ainda não desenhados ficam marcados com `// PROVISÓRIO` e devem ser trocados quando a tela for aprovada no Figma.
- Folhas inferiores: use `BottomSheet` do Onda. Animações dentro de `Modal` com o `Animated` do React Native (as de entrada do Reanimated não rodam no Modal na web).
- Nunca passe dados pessoais (e-mail etc.) por parâmetro de rota: na versão web eles aparecem na URL.
- Versão web = PWA (ver `docs/pwa.md`). Build com `npm run build:web`; o `sw.js` é gerado por `scripts/build-pwa.mjs`, não edite à mão. Avisos ao usuário com `showNotice` (`src/lib/notice.ts`), porque o `Alert` do React Native não funciona na web.

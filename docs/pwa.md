# Rancho como PWA (web app instalável)

Sem App Store nem Mac, o Rancho roda no iPhone como **PWA**: um site que se instala na Tela de Início, abre em tela cheia e funciona sem internet no mercado.

**Endereço:** https://rancho.dylan-dsgner.workers.dev

## O que já está pronto

| Peça | Onde |
|---|---|
| HTML com metas do iOS (tela cheia, nome, ícone, cor da barra em Light/Dark, área segura) | `src/app/+html.tsx` |
| Manifesto (nome, cores, ícones, abre em `/`) | `public/manifest.webmanifest` |
| Ícones **provisórios** (símbolo da splash sobre o creme `bg/canvas`) | `public/icons/`, `assets/images/favicon.png` |
| Dados guardados no aparelho (usuário e compra) | `src/lib/store.ts` (AsyncStorage → `localStorage` na web) |
| Abrir sem internet (service worker gerado a cada build) | `scripts/build-pwa.mjs` → `dist/sw.js`, registrado em `src/lib/pwa.web.ts` |
| Cabeçalhos de cache da Cloudflare | `public/_headers` |
| Configuração da Cloudflare | `wrangler.jsonc` |

## Comandos

```bash
npm run build:web    # gera o site em dist/ (export do Expo + service worker)
npm run preview:web  # build + servidor local em http://localhost:8081
```

`npx expo start --web` continua sendo o modo de desenvolvimento; nele o service worker fica desligado.

## Publicar na Cloudflare (uma vez)

1. Entre no painel da Cloudflare → **Workers & Pages** → **Create** → importar um repositório do GitHub → escolha `dylandesigner-max/rancho`.
2. Configure o build:
   - **Build command:** `npm run build:web`
   - **Deploy command:** `npx wrangler deploy` (lê o `wrangler.jsonc`, que aponta para `dist/`)
   - Branch de produção: `main`
3. Salve e faça o primeiro deploy. O endereço sai como `rancho.<sua-conta>.workers.dev` (dá para ligar um domínio próprio depois).

A partir daí, **cada merge na `main` publica sozinho**. Branches de PR podem gerar versões de prévia, se ativadas no painel.

> Alternativa equivalente: Cloudflare **Pages** com o mesmo build command e pasta de saída `dist`. O `_headers` funciona nos dois.

## Instalar no iPhone

1. Abra o endereço no **Safari**.
2. **Compartilhar** → **Adicionar à Tela de Início** → **Adicionar**.
3. Abra pelo ícone. Na primeira abertura com internet o app se guarda no aparelho; depois abre mesmo sem sinal.

## Como as atualizações chegam

Cada build gera um `sw.js` novo (a versão do cache vem do conteúdo). Ao abrir o app com internet, o iPhone baixa a versão nova em segundo plano; ela aparece **na abertura seguinte**. Para forçar: fechar o app no seletor de apps e abrir de novo.

## Limitações conhecidas

- **Dados só neste aparelho.** O PWA instalado tem armazenamento próprio, separado do Safari. Apagar o app da Tela de Início apaga a compra. Sincronização vem com o Supabase.
- **Ícones provisórios.** Gerados a partir do símbolo da splash. Falta desenhar o ícone do app no Figma (e trocar também os ícones nativos, que ainda são os do template do Expo).
- **Sem tela de abertura do iOS.** O iPhone mostra o fundo da página até o app carregar; a animação da splash entra logo em seguida. Imagens de abertura por tamanho de tela (`apple-touch-startup-image`) ficaram de fora.
- **Login com Apple indisponível** nesta fase (decisão de 14/10). Google e e-mail continuam simulados.
- **Avisos ("Em breve")** usam o alerta do navegador na web (`src/lib/notice.web.ts`), porque o `Alert` do React Native não faz nada no navegador.

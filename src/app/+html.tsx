import { ScrollViewStyleReset, useServerDocumentContext } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

import { color } from '@/theme/onda/tokens';

// HTML de cada página na versão web (PWA). Só roda na hora de gerar o site
// (`npm run build:web`), nunca no navegador nem no app nativo.

const light = color.light.bg.canvas;
const dark = color.dark.bg.canvas;

// Fundo da página no tom do app antes do JavaScript carregar (e no "elástico" da rolagem).
const pageBackground = `
body { background-color: ${light}; }
@media (prefers-color-scheme: dark) { body { background-color: ${dark}; } }
`;

export default function Root({ children }: PropsWithChildren) {
  const { bodyAttributes, bodyNodes, htmlAttributes, headNodes } = useServerDocumentContext();

  return (
    <html lang="pt-BR" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {/* viewport-fit=cover: o app desenha até as bordas e respeita a área segura (notch, barra inferior). */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="description" content="Planeje a compra do mês, controle o orçamento no mercado e aprenda com o histórico." />

        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content={light} />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content={dark} />

        {/* iPhone: "Adicionar à Tela de Início" abre em tela cheia, com nome e ícone próprios. */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Rancho" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        {/* Evita que o Safari transforme valores e números em links de telefone. */}
        <meta name="format-detection" content="telephone=no" />

        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: pageBackground }} />
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}

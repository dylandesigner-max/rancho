// Gera dist/sw.js (service worker) depois do `expo export --platform web`.
// Uso: npm run build:web  (export + este script)
//
// O service worker guarda no aparelho todos os arquivos do site, para o PWA abrir
// sem internet no mercado. A lista muda a cada build (os arquivos têm hash no nome),
// e a versão do cache vem do conteúdo: build novo = cache novo, o antigo é apagado.

import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const files = walk(dist).map((path) => relative(dist, path).split(sep).join('/'));

// Páginas: a Cloudflare serve `inicio.html` em `/inicio` (sem .html), então guardamos
// o endereço limpo. Ficam de fora as cópias com grupo no caminho, como `(auth)/entrar.html`,
// e as páginas internas do Expo Router.
const pageUrl = (file) => {
  const path = file.replace(/\.html$/, '');
  return path === 'index' ? '/' : `/${path}`;
};
const isPage = (file) =>
  file.endsWith('.html') && !file.includes('(') && !file.startsWith('_') && !file.startsWith('+');
const isAsset = (file) => !file.endsWith('.html') && !file.startsWith('_expo/.') && file !== 'sw.js' && !file.startsWith('_headers');

const urls = [
  ...files.filter(isPage).map(pageUrl),
  ...files.filter(isAsset).map((file) => `/${file}`),
].sort();

const hash = createHash('sha256');
for (const file of files.filter((f) => isPage(f) || isAsset(f)).sort()) {
  hash.update(file).update(readFileSync(join(dist, file)));
}
const version = hash.digest('hex').slice(0, 12);

const sw = `// Gerado por scripts/build-pwa.mjs. Não edite à mão.
const CACHE = 'rancho-${version}';
const PRECACHE = ${JSON.stringify(urls, null, 2)};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE.map((url) => new Request(url, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

// Páginas: tenta a rede (para pegar a versão nova) e cai no que está guardado se
// demorar ou não houver sinal. O resto (JS, fontes, imagens): guardado primeiro.
const NETWORK_TIMEOUT_MS = 3000;

async function fromCache(request) {
  const cache = await caches.open(CACHE);
  return (await cache.match(request, { ignoreSearch: true })) ?? (await cache.match('/'));
}

async function page(request) {
  const network = fetch(request);
  const timeout = new Promise((resolve) => setTimeout(resolve, NETWORK_TIMEOUT_MS));
  try {
    const response = await Promise.race([network, timeout]);
    if (response && response.ok) return response;
  } catch {
    // Sem internet: usa o que está guardado.
  }
  return (await fromCache(request)) ?? network;
}

async function asset(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(request.mode === 'navigate' ? page(request) : asset(request));
});
`;

writeFileSync(resolve(dist, 'sw.js'), sw);
console.log(`dist/sw.js: ${urls.length} arquivos no cache ${version}`);

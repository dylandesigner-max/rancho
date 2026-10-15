// Gera src/theme/onda/tokens.ts a partir do export das variáveis do Figma.
// Uso: node scripts/build-tokens.mjs
//
// Regra de nomes: cada segmento "a/b" vira objeto aninhado e kebab-case vira camelCase.
//   Figma `bg/brand-pressed`  →  color.light.bg.brandPressed
//   Figma `Display/Large`     →  text.display.large

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = JSON.parse(readFileSync(resolve(root, 'design/tokens/onda.figma.json'), 'utf8'));
const { Primitives, Color, Spacing, Radius, Typography } = src.collections;

// Família + estilo do Figma → nome da fonte carregada pelo @expo-google-fonts.
const FONT_FILES = {
  'Lilita One/Regular': 'LilitaOne_400Regular',
  'Nunito Sans/Regular': 'NunitoSans_400Regular',
  'Nunito Sans/SemiBold': 'NunitoSans_600SemiBold',
  'Nunito Sans/Bold': 'NunitoSans_700Bold',
  'Nunito Sans/ExtraBold': 'NunitoSans_800ExtraBold',
};

const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase()).replace(/^[A-Z]/, (c) => c.toLowerCase());

function setPath(obj, path, value) {
  const keys = path.split('/').map(camel);
  let cur = obj;
  for (const k of keys.slice(0, -1)) cur = cur[k] ??= {};
  cur[keys.at(-1)] = value;
}

const single = (collection, prefix) => {
  const out = {};
  for (const [name, modes] of Object.entries(collection)) setPath(out, name.slice(prefix.length), modes.Value);
  return out;
};

const primitives = {};
for (const [name, { Value }] of Object.entries(Primitives)) setPath(primitives, name, Value);

const resolveAlias = (v) => {
  if (typeof v === 'object' && v.alias) {
    const target = Primitives[v.alias];
    if (!target) throw new Error(`Alias sem primitiva: ${v.alias}`);
    return target.Value;
  }
  return v;
};
const colorFor = (mode) => {
  const out = {};
  for (const [name, modes] of Object.entries(Color)) setPath(out, name, resolveAlias(modes[mode]));
  return out;
};

const tv = (name) => {
  const v = Typography[name];
  if (!v) throw new Error(`Variável de tipografia ausente: ${name}`);
  return v.Value;
};
const text = {};
for (const { name, bound } of src.textStyles) {
  const key = `${tv(bound.fontFamily)}/${tv(bound.fontStyle)}`;
  const fontFamily = FONT_FILES[key];
  if (!fontFamily) throw new Error(`Fonte sem mapeamento para o app: ${key}`);
  const style = { fontFamily, fontSize: tv(bound.fontSize), lineHeight: tv(bound.lineHeight) };
  // Valores em reais: dígitos tabulares para o total não "pular" enquanto muda.
  if (name.startsWith('Amount/')) style.fontVariant = ['tabular-nums'];
  setPath(text, name, style);
}

// Tipo das cores semânticas: mesma forma nos dois modos, valores string.
const typeOf = (obj, indent = '  ') =>
  '{\n' +
  Object.entries(obj)
    .map(([k, v]) => `${indent}${JSON.stringify(k)}: ${typeof v === 'object' ? typeOf(v, indent + '  ') : 'string'};`)
    .join('\n') +
  `\n${indent.slice(2)}}`;

const lit = (v) => JSON.stringify(v, null, 2);
const light = colorFor('Light');

const out = `// Gerado por scripts/build-tokens.mjs a partir de design/tokens/onda.figma.json.
// Não edite à mão: altere no Figma, reexporte e rode \`npm run tokens\`.

export const primitives = ${lit(primitives)} as const;

export type ColorTokens = ${typeOf(light)};

export const color: { light: ColorTokens; dark: ColorTokens } = {
  light: ${lit(light).replace(/\n/g, '\n  ')},
  dark: ${lit(colorFor('Dark')).replace(/\n/g, '\n  ')},
};

export const space = ${lit(single(Spacing, 'space/'))} as const;

export const radius = ${lit(single(Radius, 'radius/'))} as const;

export const text = ${lit(text)} as const;
`;

writeFileSync(resolve(root, 'src/theme/onda/tokens.ts'), out);
console.log('Onda tokens gerados em src/theme/onda/tokens.ts');

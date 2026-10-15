import { useColorScheme } from 'react-native';

import { useStore } from '@/lib/store';

import { color, type ColorTokens } from './tokens';

export { font, useOndaFonts } from './fonts';
export { color, primitives, radius, space, text, type ColorTokens } from './tokens';

/**
 * Cores semânticas do modo atual (Light/Dark), como no Figma. O modo vem da
 * Aparência escolhida no perfil (tela 14c); em "Automático", segue o aparelho.
 */
export function useOnda(): { color: ColorTokens; scheme: 'light' | 'dark' } {
  const system = useColorScheme() === 'dark' ? 'dark' : 'light';
  const appearance = useStore((s) => s.appearance);
  const scheme = appearance === 'system' ? system : appearance;
  return { color: color[scheme], scheme };
}

import { useColorScheme } from 'react-native';

import { color, type ColorTokens } from './tokens';

export { useOndaFonts } from './fonts';
export { color, primitives, radius, space, text, type ColorTokens } from './tokens';

/** Cores semânticas do modo atual do sistema (Light/Dark), como no Figma. */
export function useOnda(): { color: ColorTokens; scheme: 'light' | 'dark' } {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  return { color: color[scheme], scheme };
}

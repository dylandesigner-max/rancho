import { Platform, type TextStyle } from 'react-native';

/**
 * Na web, o navegador desenha o próprio contorno de foco (outline-style: auto) por
 * cima da borda dos campos do Onda. Os tipos do React Native não aceitam 'none',
 * mas o react-native-web aceita. No iOS/Android não faz nada.
 */
export const noWebFocusOutline: TextStyle | undefined =
  Platform.OS === 'web' ? ({ outlineStyle: 'none' } as unknown as TextStyle) : undefined;

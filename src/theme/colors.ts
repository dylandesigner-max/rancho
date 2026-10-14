/**
 * Paleta PROVISÓRIA do Rancho.
 *
 * Direção: verde + laranja (comida e organização). A paleta final ainda não
 * foi escolhida — veja docs/references/. Troque os valores aqui e o app todo
 * acompanha.
 */
export const palette = {
  green: '#258C50',
  greenDark: '#1B3A2A',
  orange: '#FF8A35',
  orangeSoft: '#E99552',
  cream: '#F8F5EC',
  white: '#FFFFFF',
  graphite: '#202820',
  graphiteSoft: '#5B635B',
} as const;

export const colors = {
  background: palette.cream,
  surface: palette.white,
  text: palette.graphite,
  textSecondary: palette.graphiteSoft,
  primary: palette.green,
  onPrimary: palette.white,
  accent: palette.orange,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 16,
  lg: 24,
} as const;

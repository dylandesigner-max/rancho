import type { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { radius, useOnda } from '@/theme/onda';

type IconButtonProps = {
  icon: ReactNode;
  /** Rótulo lido pelo leitor de tela (ex.: "Voltar"). */
  accessibilityLabel: string;
  onPress?: () => void;
};

/** IconButton do Onda: só ícone, área de toque 44×44. */
export function IconButton({ icon, accessibilityLabel, onPress }: IconButtonProps) {
  const { color } = useOnda();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.root, pressed && { backgroundColor: color.bg.subtle }]}>
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

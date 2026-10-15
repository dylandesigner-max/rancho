import { Pressable, StyleSheet, Text, View } from 'react-native';

import { radius, text, useOnda } from '@/theme/onda';

type AvatarProps = {
  name: string;
  onPress?: () => void;
};

/** Avatar do Onda: inicial do nome num círculo de 40, área de toque de 44. */
export function Avatar({ name, onPress }: AvatarProps) {
  const { color } = useOnda();
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Meu perfil, ${name}`}
      style={styles.touch}>
      <View style={[styles.circle, { backgroundColor: color.bg.brand }]}>
        <Text style={[text.label.large, { color: color.text.onBrand }]}>{initial}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touch: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

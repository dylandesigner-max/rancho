import { Pressable, StyleSheet, Text, View } from 'react-native';

import { radius, space, text, useOnda } from '@/theme/onda';

import { Spinner } from './spinner';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  /** Mostra o spinner e bloqueia o toque (ex.: enquanto envia). */
  loading?: boolean;
};

const HEIGHT = 60;
const EDGE = space.xs;

/**
 * Button · Variant=Primary do Onda. Face verde de 52 sobre uma borda 3D de 8 px
 * (bg/brand-pressed); pressionado, a face afunda 8 px. Desativado fica plano.
 */
export function Button({ label, onPress, disabled = false, loading = false }: ButtonProps) {
  const { color } = useOnda();
  const inactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled, busy: loading }}
      style={styles.root}>
      {({ pressed }) => {
        const sunk = pressed || disabled;
        return (
          <View
            style={[
              styles.edge,
              { backgroundColor: sunk ? 'transparent' : color.bg.brandPressed },
            ]}>
            <View
              style={[
                styles.face,
                {
                  marginTop: sunk ? EDGE : 0,
                  backgroundColor: disabled ? color.bg.disabled : color.bg.brand,
                },
              ]}>
              {loading && <Spinner color={color.icon.onBrand} />}
              <Text
                style={[text.label.large, { color: disabled ? color.text.disabled : color.text.onBrand }]}
                numberOfLines={1}>
                {label}
              </Text>
            </View>
          </View>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'stretch',
  },
  edge: {
    height: HEIGHT,
    borderRadius: radius.md,
  },
  face: {
    height: HEIGHT - EDGE,
    borderRadius: radius.md,
    paddingHorizontal: space.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
  },
});

import { Image } from 'expo-image';
import Camera from 'lucide-react-native/icons/camera';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { radius, text, useOnda } from '@/theme/onda';

type AvatarProps = {
  name: string;
  /** Foto de perfil (data URI ou endereço). Sem foto, mostra a inicial do nome. */
  photoUri?: string | null;
  /** small = 40 em área de toque de 44 (Início, perfil); large = 120 (Foto de perfil). */
  size?: 'small' | 'large';
  /** Selo de câmera no canto (só no large): indica que dá para trocar a foto. */
  showEditBadge?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
};

/** Avatar do Onda: foto ou inicial do nome num círculo. */
export function Avatar({ name, photoUri, size = 'small', showEditBadge = false, onPress, accessibilityLabel }: AvatarProps) {
  const { color } = useOnda();
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  const large = size === 'large';
  const dim = large ? 120 : 40;

  const circle = (
    <View
      style={[
        styles.circle,
        { width: dim, height: dim, backgroundColor: color.bg.brand },
      ]}>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.photo} contentFit="cover" accessibilityIgnoresInvertColors />
      ) : (
        <Text style={[large ? text.display.large : text.label.large, { color: color.text.onBrand }]}>{initial}</Text>
      )}
    </View>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : 'image'}
      accessibilityLabel={accessibilityLabel ?? (photoUri ? `Foto de ${name}` : name)}
      style={large ? { width: dim, height: dim } : styles.touch}>
      {circle}
      {large && showEditBadge ? (
        <View style={[styles.badge, { backgroundColor: color.bg.surface }]}>
          <Camera color={color.icon.primary} size={20} />
        </View>
      ) : null}
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
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

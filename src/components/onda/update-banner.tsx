import RefreshCw from 'lucide-react-native/icons/refresh-cw';
import X from 'lucide-react-native/icons/x';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { radius, space, text, useOnda } from '@/theme/onda';

type UpdateBannerProps = {
  onUpdate: () => void;
  onDismiss: () => void;
};

/**
 * UpdateBanner do Onda: aviso fixo no rodapé, 16 acima da área segura, por cima do
 * conteúdo. Fundo bg/inverse, ação "Atualizar" em pílula bg/brand, X para esconder.
 */
export function UpdateBanner({ onUpdate, onDismiss }: UpdateBannerProps) {
  const { color } = useOnda();
  const insets = useSafeAreaInsets();

  return (
    <View
      accessibilityRole="alert"
      style={[styles.root, { backgroundColor: color.bg.inverse, bottom: insets.bottom + space.md }]}>
      <RefreshCw color={color.text.inverse} size={20} />
      <Text style={[text.label.medium, styles.message, { color: color.text.inverse }]} numberOfLines={1}>
        Nova versão pronta
      </Text>
      <Pressable
        onPress={onUpdate}
        accessibilityRole="button"
        accessibilityLabel="Atualizar o app"
        style={({ pressed }) => [styles.action, { backgroundColor: color.bg.brand, opacity: pressed ? 0.8 : 1 }]}>
        <Text style={[text.label.medium, { color: color.text.onBrand }]}>Atualizar</Text>
      </Pressable>
      <Pressable onPress={onDismiss} accessibilityRole="button" accessibilityLabel="Esconder aviso" style={styles.close}>
        <X color={color.text.inverse} size={20} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: space.xl,
    right: space.xl,
    minHeight: 56,
    borderRadius: radius.lg,
    paddingVertical: space.xs,
    paddingLeft: space.md,
    paddingRight: space.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    boxShadow: '0 4px 16px rgba(23, 12, 9, 0.18)',
  },
  message: {
    flex: 1,
  },
  action: {
    borderRadius: radius.full,
    paddingVertical: space.xs,
    paddingHorizontal: space.md,
  },
  close: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

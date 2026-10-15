import X from 'lucide-react-native/icons/x';
import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Easing, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { radius, space, text, useOnda } from '@/theme/onda';

import { IconButton } from './icon-button';

type BottomSheetProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** Ação principal, fixa embaixo da folha. */
  footer?: ReactNode;
};

/**
 * Folha inferior do Onda: fundo bg/overlay (tocar fora fecha), folha bg/surface com
 * cantos superiores radius/xl e o SheetHeader (alça, título, fechar). Sobe com o teclado.
 */
export function BottomSheet({ visible, title, onClose, children, footer }: BottomSheetProps) {
  const { color } = useOnda();
  const insets = useSafeAreaInsets();
  // Animated do próprio React Native: a animação de entrada do Reanimated não roda
  // dentro de um Modal na versão web.
  // useState com inicializador: o valor é criado uma vez e pode ser lido no render.
  const [slide] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (!visible) return;
    slide.setValue(1);
    Animated.timing(slide, {
      toValue: 0,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [visible, slide]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable
          style={[StyleSheet.absoluteFill, { backgroundColor: color.bg.overlay }]}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Fechar"
        />
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: color.bg.surface,
              paddingBottom: Math.max(insets.bottom, space.md) + space.xs,
              transform: [{ translateY: slide.interpolate({ inputRange: [0, 1], outputRange: [0, 600] }) }],
            },
          ]}
          accessibilityViewIsModal>
          <View style={styles.header}>
            <View style={[styles.handle, { backgroundColor: color.border.strong }]} />
            <View style={styles.titleRow}>
              <Text style={[text.heading.large, styles.title, { color: color.text.primary }]} accessibilityRole="header">
                {title}
              </Text>
              <IconButton accessibilityLabel="Fechar" onPress={onClose} icon={<X color={color.icon.primary} size={24} />} />
            </View>
          </View>
          <View style={styles.body}>{children}</View>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    gap: space.md,
  },
  header: {
    alignItems: 'center',
    paddingTop: space.xs,
    gap: space.xs,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: radius.full,
  },
  titleRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingLeft: space.xl,
    paddingRight: space.sm,
  },
  title: {
    flex: 1,
  },
  body: {
    paddingHorizontal: space.xl,
    gap: space.lg,
  },
  footer: {
    paddingHorizontal: space.xl,
    paddingTop: space.xs,
  },
});

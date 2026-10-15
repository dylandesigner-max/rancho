import { router } from 'expo-router';
import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconButton } from '@/components/onda';
import { space, useOnda } from '@/theme/onda';

type AuthLayoutProps = {
  children: ReactNode;
  /** Fica fixo embaixo e sobe junto com o teclado. */
  footer?: ReactNode;
  contentStyle?: ViewStyle;
};

/** Estrutura das telas de entrada (3, 4 e 5): barra com voltar, conteúdo rolável e rodapé fixo. */
export function AuthLayout({ children, footer, contentStyle }: AuthLayoutProps) {
  const { color } = useOnda();

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.root, { backgroundColor: color.bg.canvas }]}>
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.topBar}>
          <IconButton
            accessibilityLabel="Voltar"
            onPress={() => router.back()}
            icon={<ArrowLeft color={color.icon.primary} size={24} />}
          />
        </View>
        <ScrollView
          contentContainerStyle={[styles.content, contentStyle]}
          keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  topBar: {
    paddingLeft: space.sm,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: space.xl,
    paddingTop: space.md,
    paddingBottom: space.xl,
    gap: space['2xl'],
  },
  footer: {
    paddingHorizontal: space.xl,
    paddingBottom: space.xs,
    gap: space.xs,
  },
});

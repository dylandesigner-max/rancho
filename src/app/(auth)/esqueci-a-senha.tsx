import { router } from 'expo-router';
import MailCheck from 'lucide-react-native/icons/mail-check';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Button, TextField } from '@/components/onda';
import { sendPasswordReset } from '@/lib/auth';
import { emailDraft } from '@/lib/email-draft';
import { isValidEmail } from '@/lib/validation';
import { font, radius, space, text, useOnda } from '@/theme/onda';

// Tela 5 · Esqueci a senha (Figma: Prototype → 05 · Esqueci a senha).

const RESEND_SECONDS = 30;

export default function EsqueciASenha() {
  const { color } = useOnda();
  const [email, setEmail] = useState(emailDraft.get);
  const [emailError, setEmailError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const send = async () => {
    if (!isValidEmail(email)) {
      setEmailError('Digite um e-mail válido, como nome@email.com.');
      return;
    }
    setLoading(true);
    await sendPasswordReset(email.trim());
    setLoading(false);
    setSent(true);
    setCountdown(RESEND_SECONDS);
  };

  if (sent) {
    return (
      <AuthLayout
        contentStyle={styles.sentContent}
        footer={
          <>
            <Button label="Voltar para entrar" onPress={() => router.back()} />
            {countdown > 0 ? (
              <Text style={[text.body.medium, styles.resend, { color: color.text.tertiary }]}>
                Não recebeu? Reenviar em 0:{String(countdown).padStart(2, '0')}
              </Text>
            ) : (
              <Pressable onPress={send} accessibilityRole="button" style={styles.resendButton}>
                <Text style={[text.body.medium, { color: color.text.secondary }]}>
                  Não recebeu?{' '}
                  <Text style={{ fontFamily: font.bold, color: color.text.brand }}>Reenviar</Text>
                </Text>
              </Pressable>
            )}
          </>
        }>
        <View
          style={[styles.iconCircle, { backgroundColor: color.bg.brandSubtle }]}>
          <MailCheck color={color.icon.brand} size={44} />
        </View>
        <View style={styles.message}>
          <Text style={[text.display.medium, styles.center, { color: color.text.primary }]} accessibilityRole="header">
            Confira seu e-mail
          </Text>
          <Text style={[text.body.medium, styles.center, { color: color.text.secondary }]}>
            Se existir uma conta com{' '}
            <Text style={{ fontFamily: font.bold, color: color.text.primary }}>{email.trim()}</Text>, você vai
            receber um link para criar uma nova senha.
          </Text>
        </View>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      footer={
        <Button
          label={loading ? 'Enviando…' : 'Enviar link'}
          onPress={send}
          disabled={email.trim().length === 0}
          loading={loading}
        />
      }>
      <AuthHeader
        title="Esqueci a senha"
        subtitle="Digite o e-mail da sua conta. Vamos enviar um link para você criar uma nova senha."
      />
      <TextField
        label="E-mail"
        placeholder="seu@email.com"
        value={email}
        onChangeText={(v) => {
          setEmail(v);
          setEmailError(undefined);
        }}
        error={emailError}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="send"
        onSubmitEditing={() => email.trim() && send()}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  sentContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xl,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    gap: space.xs,
    alignItems: 'center',
  },
  center: {
    textAlign: 'center',
  },
  resend: {
    textAlign: 'center',
    paddingVertical: space.sm,
  },
  resendButton: {
    alignSelf: 'center',
    minHeight: 44,
    justifyContent: 'center',
    paddingVertical: space.sm,
  },
});

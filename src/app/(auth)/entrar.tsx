import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthLayout } from '@/components/auth/auth-layout';
import { TextLink } from '@/components/auth/text-link';
import { Button, TextField } from '@/components/onda';
import { signIn } from '@/lib/auth';
import { emailDraft } from '@/lib/email-draft';
import { isValidEmail } from '@/lib/validation';
import { space } from '@/theme/onda';

// Tela 3 · Entrar com e-mail (Figma: Prototype → 03 · Entrar com e-mail).

export default function Entrar() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string>();
  const [authError, setAuthError] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length > 0;

  const clearErrors = () => {
    setEmailError(undefined);
    setAuthError(false);
  };

  const submit = async () => {
    if (!isValidEmail(email)) {
      setEmailError('Digite um e-mail válido, como nome@email.com.');
      return;
    }
    setLoading(true);
    const result = await signIn(email.trim(), password);
    setLoading(false);
    if (!result.ok) {
      // Mensagem genérica: não revela se o erro foi no e-mail ou na senha.
      setAuthError(true);
      return;
    }
    router.replace('/inicio');
  };

  return (
    <AuthLayout
      footer={
        <>
          <Button
            label={loading ? 'Entrando…' : 'Entrar'}
            onPress={submit}
            disabled={!canSubmit}
            loading={loading}
          />
          <TextLink prefix="Não tem conta?" action="Criar conta" onPress={() => router.push('/criar-conta')} />
        </>
      }>
      <AuthHeader title="Entrar com e-mail" subtitle="Use o e-mail e a senha da sua conta Rancho." />
      <View style={styles.form}>
        <TextField
          label="E-mail"
          placeholder="seu@email.com"
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            clearErrors();
          }}
          error={emailError ?? authError}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
        />
        <TextField
          label="Senha"
          placeholder="Sua senha"
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            clearErrors();
          }}
          error={authError ? 'E-mail ou senha incorretos. Confira e tente de novo.' : undefined}
          password
          autoCapitalize="none"
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={() => canSubmit && submit()}
        />
        <TextLink
          action="Esqueci a senha"
          align="end"
          onPress={() => {
            emailDraft.set(email.trim());
            router.push('/esqueci-a-senha');
          }}
        />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: space.md,
  },
});

import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthLayout } from '@/components/auth/auth-layout';
import { TextLink } from '@/components/auth/text-link';
import { Button, Checkbox, TextField } from '@/components/onda';
import { signUp } from '@/lib/auth';
import { MIN_PASSWORD_LENGTH, isValidEmail } from '@/lib/validation';
import { font, space, text, useOnda } from '@/theme/onda';

// Tela 4 · Criar conta (Figma: Prototype → 04 · Criar conta).

const soon = (what: string) => Alert.alert('Em breve', `${what} ainda não foi publicada.`);

export default function CriarConta() {
  const { color } = useOnda();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();

  const canSubmit = name.trim().length > 0 && email.trim().length > 0 && password.length > 0 && accepted;

  const submit = async () => {
    const emailProblem = isValidEmail(email) ? undefined : 'Digite um e-mail válido, como nome@email.com.';
    const passwordProblem =
      password.length >= MIN_PASSWORD_LENGTH
        ? undefined
        : `A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`;
    setEmailError(emailProblem);
    setPasswordError(passwordProblem);
    if (emailProblem || passwordProblem) return;

    setLoading(true);
    const result = await signUp(name.trim(), email.trim(), password);
    setLoading(false);
    if (!result.ok) {
      setEmailError('Este e-mail já tem uma conta. Tente entrar.');
      return;
    }
    router.replace('/inicio');
  };

  const link = { fontFamily: font.bold, color: color.text.brand, textDecorationLine: 'underline' } as const;

  return (
    <AuthLayout
      footer={
        <>
          <Button
            label={loading ? 'Criando conta…' : 'Criar conta'}
            onPress={submit}
            disabled={!canSubmit}
            loading={loading}
          />
          <TextLink prefix="Já tem conta?" action="Entrar" onPress={() => router.replace('/entrar')} />
        </>
      }>
      <AuthHeader title="Criar conta" subtitle="Preencha seus dados para começar a organizar suas compras." />
      <View style={styles.form}>
        <TextField
          label="Nome"
          placeholder="Como podemos te chamar?"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
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
          returnKeyType="next"
        />
        <TextField
          label="Senha"
          placeholder="Crie uma senha"
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            setPasswordError(undefined);
          }}
          helper={`Mínimo de ${MIN_PASSWORD_LENGTH} caracteres.`}
          error={passwordError}
          password
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
        />
        <Checkbox
          checked={accepted}
          onChange={setAccepted}
          accessibilityLabel="Li e aceito os Termos de Uso e a Política de Privacidade">
          <Text style={[text.body.small, { color: color.text.primary }]}>
            Li e aceito os{' '}
            <Text style={link} onPress={() => soon('A página de Termos de Uso')}>
              Termos de Uso
            </Text>{' '}
            e a{' '}
            <Text style={link} onPress={() => soon('A Política de Privacidade')}>
              Política de Privacidade
            </Text>
            .
          </Text>
        </Checkbox>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: space.md,
  },
});

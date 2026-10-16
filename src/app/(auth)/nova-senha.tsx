import { router } from 'expo-router';
import CircleAlert from 'lucide-react-native/icons/circle-alert';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Button, Spinner, TextField } from '@/components/onda';
import { authMessage, hasRecoverySession, updatePassword } from '@/lib/auth';
import { MIN_PASSWORD_LENGTH } from '@/lib/validation';
import { radius, space, text, useOnda } from '@/theme/onda';

// Tela 05b · Nova senha (Figma: Prototype → 05b · Nova senha).
// Abre pelo link do e-mail de "Esqueci a senha"; o link já identifica a conta.

const toWelcome = () => router.replace('/');

export default function NovaSenha() {
  const { color } = useOnda();
  const [status, setStatus] = useState<'checking' | 'ready' | 'expired'>('checking');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    hasRecoverySession().then((ok) => setStatus(ok ? 'ready' : 'expired'));
  }, []);

  const save = async () => {
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }
    setLoading(true);
    const result = await updatePassword(password);
    setLoading(false);
    if (!result.ok) {
      if (result.reason === 'expired-link') setStatus('expired');
      else setError(authMessage(result.reason, result.code));
      return;
    }
    router.replace('/inicio');
  };

  if (status === 'checking') {
    return (
      <AuthLayout onBack={toWelcome} contentStyle={styles.center}>
        <Spinner color={color.icon.brand} />
      </AuthLayout>
    );
  }

  if (status === 'expired') {
    return (
      <AuthLayout
        onBack={toWelcome}
        contentStyle={styles.center}
        footer={<Button label="Pedir novo link" onPress={() => router.replace('/esqueci-a-senha')} />}>
        <View style={[styles.iconCircle, { backgroundColor: color.bg.brandSubtle }]}>
          <CircleAlert color={color.icon.brand} size={44} />
        </View>
        <View style={styles.message}>
          <Text style={[text.display.medium, styles.textCenter, { color: color.text.primary }]} accessibilityRole="header">
            Este link expirou
          </Text>
          <Text style={[text.body.medium, styles.textCenter, { color: color.text.secondary }]}>
            Por segurança, o link de troca de senha vale por pouco tempo. Peça um novo para continuar.
          </Text>
        </View>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      onBack={toWelcome}
      footer={
        <Button
          label={loading ? 'Salvando…' : 'Salvar senha'}
          onPress={save}
          disabled={password.length === 0}
          loading={loading}
        />
      }>
      <AuthHeader title="Criar nova senha" subtitle="Escolha uma senha nova para a sua conta Rancho." />
      <TextField
        label="Nova senha"
        value={password}
        onChangeText={(v) => {
          setPassword(v);
          setError(undefined);
        }}
        helper={`Mínimo de ${MIN_PASSWORD_LENGTH} caracteres.`}
        error={error}
        password
        autoFocus
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={() => password && save()}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  center: {
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
  textCenter: {
    textAlign: 'center',
  },
});

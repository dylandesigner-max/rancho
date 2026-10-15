import { Stack } from 'expo-router';

import { useOnda } from '@/theme/onda';

// Grupo de entrada: Boas-vindas, Entrar, Criar conta, Esqueci a senha.
export default function AuthLayout() {
  const { color } = useOnda();
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.bg.canvas } }} />;
}

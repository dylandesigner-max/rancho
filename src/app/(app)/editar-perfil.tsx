import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, TextField, TopBar } from '@/components/onda';
import { actions, useStore } from '@/lib/store';
import { space, useOnda } from '@/theme/onda';

// Tela 15 · Editar perfil (Figma: Prototype → 15 · Editar perfil). Só o nome (plano v2).

export default function EditarPerfil() {
  const { color } = useOnda();
  const current = useStore((s) => s.userName) ?? '';
  const [name, setName] = useState(current);
  const empty = name.trim().length === 0;

  const save = () => {
    actions.setUserName(name.trim());
    router.back();
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.root, { backgroundColor: color.bg.canvas }]}>
      <TopBar title="Editar perfil" />
      <View style={styles.content}>
        <TextField
          label="Nome"
          value={name}
          onChangeText={setName}
          autoFocus
          autoCapitalize="words"
          autoComplete="name"
          returnKeyType="done"
          onSubmitEditing={() => !empty && save()}
          helper="É assim que o Rancho vai te chamar."
          error={empty ? 'Digite seu nome.' : undefined}
        />
      </View>
      <View style={styles.footer}>
        <Button label="Salvar" disabled={empty} onPress={save} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: space.xl,
    paddingTop: space.xl,
  },
  footer: {
    paddingHorizontal: space.xl,
    paddingBottom: space.xs,
  },
});

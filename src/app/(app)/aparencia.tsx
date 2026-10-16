import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RadioItem, TopBar } from '@/components/onda';
import { Grupo } from '@/components/perfil/grupo';
import { actions, useStore } from '@/lib/store';
import { space, text, useOnda } from '@/theme/onda';

// Tela 14c · Aparência (Figma: Prototype → 14c · Aparência). Vale na hora, sem salvar.

export default function Aparencia() {
  const { color } = useOnda();
  const appearance = useStore((s) => s.appearance);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.root, { backgroundColor: color.bg.canvas }]}>
      <TopBar title="Aparência" />
      <View style={styles.content} accessibilityRole="radiogroup">
        <Grupo>
          <RadioItem
            label="Automático"
            description="Segue o modo claro ou escuro do aparelho."
            selected={appearance === 'system'}
            onPress={() => actions.setAppearance('system')}
          />
          <RadioItem label="Claro" selected={appearance === 'light'} onPress={() => actions.setAppearance('light')} />
          <RadioItem label="Escuro" selected={appearance === 'dark'} onPress={() => actions.setAppearance('dark')} />
        </Grupo>
        <Text style={[text.caption, { color: color.text.tertiary }]}>A escolha fica salva neste aparelho.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: space.xl,
    paddingTop: space.xl,
    gap: space.xs,
  },
});

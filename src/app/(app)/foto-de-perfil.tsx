import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image as RNImage, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar, Button, TopBar } from '@/components/onda';
import { showNotice } from '@/lib/notice';
import { photoDraft } from '@/lib/photo-draft';
import { syncProfile } from '@/lib/profile';
import { actions, useStore } from '@/lib/store';
import { space, text, useOnda } from '@/theme/onda';

// Tela 14b · Foto de perfil (Figma: Prototype → 14b · Foto de perfil).

/** Largura e altura da imagem; alguns navegadores não informam no seletor. */
function measure(uri: string, width: number, height: number): Promise<{ width: number; height: number }> {
  if (width > 0 && height > 0) return Promise.resolve({ width, height });
  return new Promise((resolve, reject) => RNImage.getSize(uri, (w, h) => resolve({ width: w, height: h }), reject));
}

export default function FotoDePerfil() {
  const { color } = useOnda();
  const userName = useStore((s) => s.userName) ?? '';
  const photoUri = useStore((s) => s.photoUri);
  const [picking, setPicking] = useState(false);

  const choose = async () => {
    setPicking(true);
    try {
      // O seletor do sistema já oferece fototeca e câmera (no iPhone, também na versão web).
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 1 });
      if (result.canceled) return;
      const asset = result.assets[0];
      const size = await measure(asset.uri, asset.width, asset.height);
      photoDraft.set({ uri: asset.uri, ...size });
      router.push('/ajustar-foto');
    } catch {
      showNotice('Não deu para abrir a foto', 'Tente outra imagem.');
    } finally {
      setPicking(false);
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.root, { backgroundColor: color.bg.canvas }]}>
      <TopBar title="Foto de perfil" />
      <View style={styles.content}>
        <Avatar name={userName} photoUri={photoUri} size="large" />
        <Text style={[text.body.small, styles.center, { color: color.text.secondary }]}>
          {photoUri
            ? 'Sua foto aparece no Início e no seu perfil.'
            : 'Sua foto aparece no Início e no seu perfil. Sem foto, usamos a inicial do seu nome.'}
        </Text>
      </View>
      <View style={styles.footer}>
        <Button label={photoUri ? 'Trocar foto' : 'Escolher foto'} loading={picking} onPress={choose} />
        {photoUri ? (
          <Button
            variant="ghost"
            label="Remover foto"
            onPress={() => {
              actions.setPhoto(null);
              syncProfile();
            }}
          />
        ) : null}
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
    alignItems: 'center',
    paddingHorizontal: space.xl,
    paddingTop: space['2xl'],
    gap: space.xl,
  },
  center: {
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: space.xl,
    paddingBottom: space.xs,
    gap: space.xs,
  },
});

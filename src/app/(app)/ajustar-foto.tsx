import { Image } from 'expo-image';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Mask, Rect } from 'react-native-svg';

import { Button, TopBar } from '@/components/onda';
import { showNotice } from '@/lib/notice';
import { photoDraft } from '@/lib/photo-draft';
import { actions } from '@/lib/store';
import { radius, space, text, useOnda } from '@/theme/onda';

// Tela 14b · Ajustar foto (Figma: Prototype → 14b · Foto de perfil, coluna "Ajustar foto").
// Arrastar enquadra, pinçar aproxima. O círculo vira a foto de perfil (512 px, JPEG).

const MAX_ZOOM = 4;
const OUTPUT = 512;
/** Círculo do recorte em relação ao quadro (300 de 342 no Figma). */
const CIRCLE_RATIO = 300 / 342;

export default function AjustarFoto() {
  const { color } = useOnda();
  const { width: screen } = useWindowDimensions();
  const [photo] = useState(photoDraft.get);
  const [saving, setSaving] = useState(false);

  const frame = Math.min(screen - space.xl * 2, 420);
  const circle = frame * CIRCLE_RATIO;
  const inset = (frame - circle) / 2;
  // Escala que faz a foto cobrir o quadro inteiro (zoom 1).
  const base = photo ? Math.max(frame / photo.width, frame / photo.height) : 1;
  const imgW = (photo?.width ?? 0) * base;
  const imgH = (photo?.height ?? 0) * base;

  const zoom = useSharedValue(1);
  const startZoom = useSharedValue(1);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  // A foto precisa cobrir o círculo: o deslocamento máximo depende do zoom.
  const clampX = (value: number, z: number) => {
    'worklet';
    const max = (imgW * z - circle) / 2;
    return Math.min(max, Math.max(-max, value));
  };
  const clampY = (value: number, z: number) => {
    'worklet';
    const max = (imgH * z - circle) / 2;
    return Math.min(max, Math.max(-max, value));
  };

  const pan = Gesture.Pan()
    .onStart(() => {
      startX.set(x.get());
      startY.set(y.get());
    })
    .onUpdate((e) => {
      x.set(clampX(startX.get() + e.translationX, zoom.get()));
      y.set(clampY(startY.get() + e.translationY, zoom.get()));
    });
  const pinch = Gesture.Pinch()
    .onStart(() => {
      startZoom.set(zoom.get());
    })
    .onUpdate((e) => {
      const z = Math.min(MAX_ZOOM, Math.max(1, startZoom.get() * e.scale));
      zoom.set(z);
      x.set(clampX(x.get(), z));
      y.set(clampY(y.get(), z));
    });
  const gesture = Gesture.Simultaneous(pan, pinch);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.get() }, { translateY: y.get() }, { scale: zoom.get() }],
  }));

  if (!photo) return <Redirect href="/foto-de-perfil" />;

  const use = async () => {
    setSaving(true);
    try {
      // Do quadro para os pixels da foto: onde o círculo cai dentro da imagem.
      const k = base * zoom.get();
      const left = frame / 2 + x.get() - (photo.width * k) / 2;
      const top = frame / 2 + y.get() - (photo.height * k) / 2;
      const size = Math.min(Math.round(circle / k), photo.width, photo.height);
      const originX = Math.min(Math.max(0, Math.round((inset - left) / k)), photo.width - size);
      const originY = Math.min(Math.max(0, Math.round((inset - top) / k)), photo.height - size);
      const rendered = await ImageManipulator.manipulate(photo.uri)
        .crop({ originX, originY, width: size, height: size })
        .resize({ width: OUTPUT, height: OUTPUT })
        .renderAsync();
      const saved = await rendered.saveAsync({ format: SaveFormat.JPEG, compress: 0.8, base64: true });
      actions.setPhoto(`data:image/jpeg;base64,${saved.base64}`);
      photoDraft.set(null);
      router.back();
    } catch {
      showNotice('Não deu para salvar a foto', 'Tente de novo ou escolha outra imagem.');
      setSaving(false);
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.root, { backgroundColor: color.bg.canvas }]}>
      <TopBar title="Ajustar foto" />
      <View style={styles.content}>
        <GestureDetector gesture={gesture}>
          <View
            style={[styles.frame, { width: frame, height: frame, backgroundColor: color.bg.subtle }]}
            accessibilityLabel="Área de recorte da foto. Arraste para enquadrar e use dois dedos para aproximar.">
            <Animated.View style={[{ width: imgW, height: imgH }, imageStyle]}>
              <Image source={{ uri: photo.uri }} style={StyleSheet.absoluteFill} contentFit="fill" />
            </Animated.View>
            {/* Escurece fora do círculo e marca o contorno. */}
            <Svg width={frame} height={frame} style={StyleSheet.absoluteFill} pointerEvents="none">
              <Defs>
                <Mask id="fora">
                  <Rect width={frame} height={frame} fill="white" />
                  <Circle cx={frame / 2} cy={frame / 2} r={circle / 2} fill="black" />
                </Mask>
              </Defs>
              <Rect width={frame} height={frame} fill={color.bg.overlay} mask="url(#fora)" />
              <Circle cx={frame / 2} cy={frame / 2} r={circle / 2} fill="none" stroke={color.bg.surface} strokeWidth={2} />
            </Svg>
          </View>
        </GestureDetector>
        <Text style={[text.body.small, styles.center, { color: color.text.secondary }]}>
          Arraste para enquadrar e use dois dedos para aproximar.
        </Text>
      </View>
      <View style={styles.footer}>
        <Button label="Usar foto" loading={saving} onPress={use} />
        <Button variant="ghost" label="Cancelar" onPress={() => router.back()} />
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
    paddingTop: space.xl,
    gap: space.md,
  },
  frame: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
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

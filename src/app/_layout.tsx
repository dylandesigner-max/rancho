import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { UpdateBanner } from '@/components/onda';
import { AnimatedSplash } from '@/components/splash/animated-splash';
import { initAuth } from '@/lib/auth';
import { applyThemeColor, applyUpdate, registerServiceWorker, useUpdateReady } from '@/lib/pwa';
import { hydrateStore, useStoreHydrated } from '@/lib/store';
import { useOnda, useOndaFonts } from '@/theme/onda';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useOndaFonts();
  const { color, scheme } = useOnda();
  const hydrated = useStoreHydrated();
  const [authReady, setAuthReady] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const updateReady = useUpdateReady();
  const [updateDismissed, setUpdateDismissed] = useState(false);
  const ready = (fontsLoaded || !!fontError) && hydrated && authReady;
  const finishSplash = useCallback(() => setSplashDone(true), []);

  useEffect(() => {
    // Confere a conta depois de carregar o que está salvo. Sem internet, não segura
    // a abertura do app por mais de 3 s: segue com o que está no aparelho.
    const timeout = new Promise((resolve) => setTimeout(resolve, 3000));
    hydrateStore()
      .then(() => Promise.race([initAuth(), timeout]))
      .catch(() => {})
      .finally(() => setAuthReady(true));
    registerServiceWorker();
  }, []);

  useEffect(() => {
    // Na web (PWA), a barra do navegador e o fundo da página seguem a Aparência escolhida.
    applyThemeColor(color.bg.canvas);
  }, [color.bg.canvas]);

  useEffect(() => {
    // A splash nativa (símbolo sobre o creme) sai e a animação começa do mesmo quadro.
    if (ready) SplashScreen.hide();
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <GestureHandlerRootView style={[styles.root, { backgroundColor: color.bg.canvas }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: color.bg.canvas },
        }}
      />
      {updateReady && !updateDismissed && splashDone ? (
        <UpdateBanner onUpdate={applyUpdate} onDismiss={() => setUpdateDismissed(true)} />
      ) : null}
      {!splashDone && <AnimatedSplash onFinish={finishSplash} />}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

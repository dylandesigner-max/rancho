import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

import { AnimatedSplash } from '@/components/splash/animated-splash';
import { registerServiceWorker } from '@/lib/pwa';
import { hydrateStore, useStoreHydrated } from '@/lib/store';
import { useOnda, useOndaFonts } from '@/theme/onda';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useOndaFonts();
  const { color } = useOnda();
  const hydrated = useStoreHydrated();
  const [splashDone, setSplashDone] = useState(false);
  const ready = (fontsLoaded || !!fontError) && hydrated;
  const finishSplash = useCallback(() => setSplashDone(true), []);

  useEffect(() => {
    hydrateStore();
    registerServiceWorker();
  }, []);

  useEffect(() => {
    // A splash nativa (símbolo sobre o creme) sai e a animação começa do mesmo quadro.
    if (ready) SplashScreen.hide();
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: color.bg.canvas }}>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: color.bg.canvas },
        }}
      />
      {!splashDone && <AnimatedSplash onFinish={finishSplash} />}
    </View>
  );
}

import { Fredoka_400Regular, Fredoka_600SemiBold } from '@expo-google-fonts/fredoka';
import { Pacifico_400Regular } from '@expo-google-fonts/pacifico';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { Quicksand_500Medium, Quicksand_700Bold } from '@expo-google-fonts/quicksand';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useTheme } from '@/components/ui';
import { StoreProvider, useStore } from '@/lib/store';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Quicksand_500Medium,
    Quicksand_700Bold,
    Fredoka_400Regular,
    Fredoka_600SemiBold,
    Poppins_400Regular,
    Poppins_600SemiBold,
    PlayfairDisplay_700Bold,
    Pacifico_400Regular,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <StoreProvider>
        <RootNav />
      </StoreProvider>
    </SafeAreaProvider>
  );
}

function RootNav() {
  const { state, ready } = useStore();
  const { c, f } = useTheme();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    SplashScreen.hideAsync();
    const inOnboarding = segments[0] === 'onboarding';
    if (!state.onboarded && !inOnboarding) router.replace('/onboarding');
    if (state.onboarded && inOnboarding) router.replace('/');
  }, [ready, state.onboarded, segments, router]);

  if (!ready) return null;

  return (
    <>
      <StatusBar style={c.dark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: c.bg },
          headerTintColor: c.primary,
          headerTitleStyle: { fontFamily: f.bold, color: c.text },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: c.bg },
          headerBackTitle: 'Voltar',
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="item" options={{ presentation: 'modal', title: 'Peça' }} />
        <Stack.Screen name="settings" options={{ title: 'Personalizar' }} />
      </Stack>
    </>
  );
}

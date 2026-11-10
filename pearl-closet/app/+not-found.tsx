import { router, Stack } from 'expo-router';
import { Button, EmptyState, Screen } from '@/components/ui';

export default function NotFoundScreen() {
  return (
    <Screen>
      <Stack.Screen options={{ title: 'Ops!' }} />
      <EmptyState
        emoji="🧭"
        title="Essa página não existe"
        text="Vamos voltar para o início?"
        action={<Button label="Ir para o início" icon="home" onPress={() => router.replace('/')} />}
      />
    </Screen>
  );
}

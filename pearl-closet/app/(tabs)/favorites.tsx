import { router } from 'expo-router';
import { View } from 'react-native';
import { Button, EmptyState, OutfitCard, Screen, Txt } from '@/components/ui';
import { useStore } from '@/lib/store';

export default function Favorites() {
  const { state, toggleFavorite } = useStore();
  return (
    <Screen>
      <Txt variant="title">Looks favoritos</Txt>
      <Txt variant="caption" style={{ marginBottom: 16 }}>
        Seus looks preferidos, prontos para usar. 💖
      </Txt>
      {state.favorites.length === 0 ? (
        <EmptyState
          emoji="💝"
          title="Nenhum favorito ainda"
          text="Quando gostar de um look, toque no coração e ele aparece aqui."
          action={<Button label="Criar looks" icon="sparkles" onPress={() => router.push('/looks')} />}
        />
      ) : (
        <View style={{ gap: 14 }}>
          {state.favorites.map((o) => (
            <OutfitCard key={o.id} outfit={o} items={state.items} favorite onToggleFavorite={() => toggleFavorite(o)} />
          ))}
        </View>
      )}
    </Screen>
  );
}

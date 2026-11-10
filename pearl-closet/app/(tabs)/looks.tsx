import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Chip, EmptyState, OutfitCard, Screen, Txt } from '@/components/ui';
import { EVENTS, eventOf } from '@/lib/catalog';
import { useStore } from '@/lib/store';
import { generateOutfits } from '@/lib/stylist';

export default function Looks() {
  const params = useLocalSearchParams<{ event?: string }>();
  const { state, toggleFavorite, isFavorite } = useStore();
  const [eventKey, setEventKey] = useState(params.event ?? EVENTS[0].key);
  const [seed, setSeed] = useState(1);

  useEffect(() => {
    if (params.event) setEventKey(params.event);
  }, [params.event]);

  const result = useMemo(
    () => generateOutfits(state.items, eventKey, { count: 3, seed }),
    [state.items, eventKey, seed],
  );
  const ev = eventOf(eventKey);

  return (
    <Screen>
      <Txt variant="title">Criar looks</Txt>
      <Txt variant="caption">
        {state.assistant.avatar} A {state.assistant.name} combina as suas roupas para cada ocasião.
      </Txt>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 16, marginHorizontal: -20 }}
        contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
        {EVENTS.map((e) => (
          <Chip
            key={e.key}
            label={`${e.emoji} ${e.label}`}
            selected={e.key === eventKey}
            onPress={() => {
              setEventKey(e.key);
              setSeed(1);
            }}
          />
        ))}
      </ScrollView>

      {!result.ok ? (
        <EmptyState
          emoji="🧺"
          title="Faltam roupas no closet"
          text={result.missing}
          action={<Button label="Adicionar peça" icon="add" onPress={() => router.push('/item')} />}
        />
      ) : (
        <View style={{ gap: 14 }}>
          {result.outfits.map((o) => (
            <OutfitCard
              key={o.id}
              outfit={o}
              items={state.items}
              favorite={isFavorite(o.id)}
              onToggleFavorite={() => toggleFavorite(o)}
            />
          ))}
          <Button
            label={`Outras ideias para ${ev.label.toLowerCase()}`}
            icon="shuffle"
            kind="soft"
            onPress={() => setSeed((s) => s + 1)}
          />
        </View>
      )}
    </Screen>
  );
}

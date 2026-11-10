import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Button, Chip, EmptyState, ItemThumb, Screen, Txt, useTheme } from '@/components/ui';
import { CATEGORIES } from '@/lib/catalog';
import { useStore } from '@/lib/store';
import type { CategoryKey } from '@/lib/types';

export default function Closet() {
  const { state } = useStore();
  const { c } = useTheme();
  const [filter, setFilter] = useState<CategoryKey | 'all'>('all');
  const items = filter === 'all' ? state.items : state.items.filter((i) => i.category === filter);

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Txt variant="title">Meu closet</Txt>
        <Button label="Adicionar" icon="add" onPress={() => router.push('/item')} style={{ minHeight: 44 }} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 16, marginHorizontal: -20 }}
        contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
        <Chip label={`Tudo (${state.items.length})`} selected={filter === 'all'} onPress={() => setFilter('all')} />
        {CATEGORIES.map((cat) => {
          const n = state.items.filter((i) => i.category === cat.key).length;
          return (
            <Chip
              key={cat.key}
              label={`${cat.emoji} ${cat.label}${n ? ` (${n})` : ''}`}
              selected={filter === cat.key}
              onPress={() => setFilter(cat.key)}
            />
          );
        })}
      </ScrollView>

      {items.length === 0 ? (
        <EmptyState
          emoji="🪞"
          title={filter === 'all' ? 'Seu closet está vazio' : 'Nada nesta categoria ainda'}
          text="Tire uma foto da sua roupa ou escolha só a cor. Quanto mais peças, mais looks eu consigo criar!"
          action={<Button label="Adicionar primeira peça" icon="camera" onPress={() => router.push('/item')} />}
        />
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {items.map((item) => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={`Editar ${item.name}`}
              onPress={() => router.push({ pathname: '/item', params: { id: item.id } })}
              style={({ pressed }) => ({
                width: '31%',
                flexGrow: 0,
                gap: 6,
                opacity: pressed ? 0.8 : 1,
              })}>
              <View style={{ aspectRatio: 1, width: '100%' }}>
                <ItemThumbFill item={item} />
              </View>
              <Txt variant="caption" numberOfLines={1} style={{ color: c.text }}>
                {item.name}
              </Txt>
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}

function ItemThumbFill({ item }: { item: Parameters<typeof ItemThumb>[0]['item'] }) {
  const [size, setSize] = useState(0);
  return (
    <View style={{ flex: 1 }} onLayout={(e) => setSize(e.nativeEvent.layout.width)}>
      {size > 0 && <ItemThumb item={item} size={size} />}
    </View>
  );
}

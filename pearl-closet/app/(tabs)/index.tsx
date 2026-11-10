import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Button, Card, Row, Screen, Txt, useTheme } from '@/components/ui';
import { EVENTS } from '@/lib/catalog';
import { useStore } from '@/lib/store';

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
}

export default function Home() {
  const { state } = useStore();
  const { c } = useTheme();
  const { assistant, profile, items, favorites } = state;

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Txt variant="caption">{greeting()},</Txt>
          <Txt variant="title" color={c.primary}>
            {profile.name} ✨
          </Txt>
        </View>
        <Link href="/settings" asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Personalizar"
            style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: c.soft, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="color-palette" size={24} color={c.primary} />
          </Pressable>
        </Link>
      </View>

      <Card style={{ marginTop: 20, backgroundColor: c.primary, borderColor: c.primary, flexDirection: 'row', gap: 14, alignItems: 'center' }}>
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 36 }}>{assistant.avatar}</Text>
        </View>
        <View style={{ flex: 1, gap: 8 }}>
          <Txt variant="bold" color={c.onPrimary}>
            {assistant.name}: "Para onde vamos hoje?"
          </Txt>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/chat')}
            style={{ alignSelf: 'flex-start', backgroundColor: c.bg, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 8 }}>
            <Txt variant="bold" color={c.primary} style={{ fontSize: 14 }}>
              Conversar 💬
            </Txt>
          </Pressable>
        </View>
      </Card>

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
        <Stat label="peças no closet" value={items.length} emoji="👚" onPress={() => router.push('/closet')} />
        <Stat label="looks favoritos" value={favorites.length} emoji="💖" onPress={() => router.push('/favorites')} />
      </View>

      <Txt variant="h2" style={{ marginTop: 28, marginBottom: 12 }}>
        Que roupa eu uso para...
      </Txt>
      <Row gap={10}>
        {EVENTS.map((e) => (
          <Pressable
            key={e.key}
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/looks', params: { event: e.key } })}
            style={({ pressed }) => ({
              width: '31%',
              minWidth: 96,
              flexGrow: 1,
              aspectRatio: 1.1,
              borderRadius: 20,
              backgroundColor: c.card,
              borderWidth: 1,
              borderColor: c.border,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 8,
              opacity: pressed ? 0.8 : 1,
            })}>
            <Text style={{ fontSize: 30 }}>{e.emoji}</Text>
            <Txt variant="caption" style={{ textAlign: 'center', color: c.text, marginTop: 4 }} numberOfLines={2}>
              {e.label}
            </Txt>
          </Pressable>
        ))}
      </Row>

      {items.length === 0 && (
        <Card style={{ marginTop: 24, gap: 10, alignItems: 'flex-start' }}>
          <Txt variant="h2">Comece pelo seu closet 👗</Txt>
          <Txt variant="caption">Adicione suas roupas (com ou sem foto) para a {assistant.name} montar seus looks.</Txt>
          <Button label="Adicionar peça" icon="add" onPress={() => router.push('/item')} />
        </Card>
      )}
    </Screen>
  );
}

function Stat({ label, value, emoji, onPress }: { label: string; value: number; emoji: string; onPress: () => void }) {
  const { c } = useTheme();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={{ flex: 1 }}>
      <Card style={{ gap: 2, backgroundColor: c.soft, borderColor: c.soft }}>
        <Text style={{ fontSize: 22 }}>{emoji}</Text>
        <Txt variant="title">{value}</Txt>
        <Txt variant="caption">{label}</Txt>
      </Card>
    </Pressable>
  );
}

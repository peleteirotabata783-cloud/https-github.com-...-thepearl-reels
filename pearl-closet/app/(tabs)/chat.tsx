import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chip, OutfitCard, Txt, useTheme } from '@/components/ui';
import { reply, welcomeMessage } from '@/lib/assistant';
import { uid, useStore } from '@/lib/store';
import type { ChatMessage } from '@/lib/types';
import { speak, stopSpeaking } from '@/lib/voice';

export default function Chat() {
  const store = useStore();
  const { state, pushMessages, toggleFavorite, isFavorite, clearChat } = store;
  const { c, f } = useTheme();
  const [text, setText] = useState('');
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const a = state.assistant;

  useEffect(() => {
    if (state.chat.length === 0) pushMessages([welcomeMessage(state)]);
  }, [state.chat.length]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => stopSpeaking(), []);

  const send = (raw: string) => {
    const t = raw.trim();
    if (!t) return;
    const mine: ChatMessage = { id: uid(), from: 'user', text: t, createdAt: Date.now() };
    const answer = reply(t, state);
    pushMessages([mine, answer]);
    setText('');
    if (a.autoSpeak) speak(answer.text, a.voice);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
  };

  const last = state.chat[state.chat.length - 1];

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 10, borderBottomWidth: 1, borderColor: c.border }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: c.soft, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 26 }}>{a.avatar}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Txt variant="h2">{a.name}</Txt>
          <Txt variant="caption">Sua ajudante de moda</Txt>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Limpar conversa" onPress={clearChat} hitSlop={10}>
          <Ionicons name="refresh" size={22} color={c.muted} />
        </Pressable>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={0}>
        <FlatList
          ref={listRef}
          data={state.chat}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: 16, gap: 12, maxWidth: 640, width: '100%', alignSelf: 'center' }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item: m }) => {
            const mine = m.from === 'user';
            return (
              <View style={{ gap: 8, alignItems: mine ? 'flex-end' : 'flex-start' }}>
                <View
                  style={{
                    maxWidth: '85%',
                    backgroundColor: mine ? c.primary : c.card,
                    borderColor: c.border,
                    borderWidth: mine ? 0 : 1,
                    borderRadius: 20,
                    borderBottomRightRadius: mine ? 6 : 20,
                    borderBottomLeftRadius: mine ? 20 : 6,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    flexDirection: 'row',
                    gap: 8,
                    alignItems: 'flex-end',
                  }}>
                  <Txt color={mine ? c.onPrimary : c.text} style={{ flexShrink: 1 }}>
                    {m.text}
                  </Txt>
                  {!mine && (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Ouvir mensagem"
                      onPress={() => speak(m.text, a.voice)}
                      hitSlop={10}>
                      <Ionicons name="volume-high" size={18} color={c.primary} />
                    </Pressable>
                  )}
                </View>
                {m.outfits?.map((o) => (
                  <View key={o.id} style={{ width: '92%' }}>
                    <OutfitCard
                      compact
                      outfit={o}
                      items={state.items}
                      favorite={isFavorite(o.id)}
                      onToggleFavorite={() => toggleFavorite(o)}
                    />
                  </View>
                ))}
              </View>
            );
          }}
        />

        {last?.from === 'assistant' && last.chips?.length ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, paddingBottom: 8, maxWidth: 640, width: '100%', alignSelf: 'center' }}>
            {last.chips.map((ch) => (
              <Chip key={ch} label={ch} onPress={() => send(ch)} />
            ))}
          </View>
        ) : null}

        <View style={{ flexDirection: 'row', gap: 10, padding: 12, borderTopWidth: 1, borderColor: c.border, backgroundColor: c.card }}>
          <TextInput
            accessibilityLabel={`Mensagem para ${a.name}`}
            value={text}
            onChangeText={setText}
            onSubmitEditing={() => send(text)}
            placeholder={`Fale com a ${a.name}...`}
            placeholderTextColor={c.muted}
            returnKeyType="send"
            maxLength={300}
            style={{
              flex: 1,
              minHeight: 48,
              borderRadius: 24,
              paddingHorizontal: 18,
              backgroundColor: c.bg,
              color: c.text,
              fontFamily: f.regular,
              fontSize: 16,
              borderWidth: 1,
              borderColor: c.border,
            }}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Enviar"
            onPress={() => send(text)}
            disabled={!text.trim()}
            style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center', opacity: text.trim() ? 1 : 0.5 }}>
            <Ionicons name="send" size={20} color={c.onPrimary} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/** Blocos de personalização usados no onboarding e na tela de Ajustes. */
import { Pressable, Text, TextInput, View } from 'react-native';
import { Txt, Row, Chip, useTheme, Button } from './ui';
import { useStore } from '@/lib/store';
import { FONTS, PALETTES } from '@/lib/themes';
import { VOICES, speak } from '@/lib/voice';
import type { FontKey, PaletteKey, VoiceKey } from '@/lib/types';

export const AVATARS = ['🦄', '🧚‍♀️', '👸', '🐱', '🐰', '🦋', '🌸', '⭐', '🐼', '🦊', '🐬', '🍓'];

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  maxLength = 20,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  maxLength?: number;
}) {
  const { c, f } = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <Txt variant="bold">{label}</Txt>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c.muted}
        maxLength={maxLength}
        style={{
          fontFamily: f.regular,
          fontSize: 17,
          color: c.text,
          backgroundColor: c.card,
          borderWidth: 1.5,
          borderColor: c.border,
          borderRadius: 16,
          paddingHorizontal: 16,
          minHeight: 52,
        }}
      />
    </View>
  );
}

export function PalettePicker() {
  const { state, update } = useStore();
  const { c } = useTheme();
  return (
    <View style={{ gap: 10 }}>
      <Txt variant="bold">Cor do app</Txt>
      <Row gap={12}>
        {(Object.keys(PALETTES) as PaletteKey[]).map((k) => {
          const p = PALETTES[k];
          const sel = state.theme.palette === k;
          return (
            <Pressable
              key={k}
              accessibilityRole="button"
              accessibilityLabel={`Cor ${p.label}`}
              accessibilityState={{ selected: sel }}
              onPress={() => update({ theme: { ...state.theme, palette: k } })}
              style={{ alignItems: 'center', gap: 4, width: 76 }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: p.primary,
                  borderWidth: sel ? 4 : 2,
                  borderColor: sel ? c.text : p.soft,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: p.bg }} />
              </View>
              <Txt variant="caption" style={{ textAlign: 'center' }}>
                {p.label}
              </Txt>
            </Pressable>
          );
        })}
      </Row>
    </View>
  );
}

export function FontPicker() {
  const { state, update } = useStore();
  const { c } = useTheme();
  return (
    <View style={{ gap: 10 }}>
      <Txt variant="bold">Estilo da letra</Txt>
      <Row gap={10}>
        {(Object.keys(FONTS) as FontKey[]).map((k) => {
          const sel = state.theme.font === k;
          return (
            <Pressable
              key={k}
              accessibilityRole="button"
              accessibilityState={{ selected: sel }}
              onPress={() => update({ theme: { ...state.theme, font: k } })}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 16,
                borderWidth: 2,
                borderColor: sel ? c.primary : c.border,
                backgroundColor: sel ? c.soft : c.card,
              }}>
              <Text style={{ fontFamily: FONTS[k].title, fontSize: 18, color: c.text }}>{FONTS[k].label}</Text>
            </Pressable>
          );
        })}
      </Row>
    </View>
  );
}

export function AssistantEditor() {
  const { state, update } = useStore();
  const { c } = useTheme();
  const a = state.assistant;
  const set = (patch: Partial<typeof a>) => update({ assistant: { ...a, ...patch } });
  return (
    <View style={{ gap: 18 }}>
      <Field label="Nome da ajudante" value={a.name} onChangeText={(name) => set({ name })} placeholder="Ex.: Pérola" />
      <View style={{ gap: 10 }}>
        <Txt variant="bold">Carinha</Txt>
        <Row gap={10}>
          {AVATARS.map((e) => (
            <Pressable
              key={e}
              accessibilityRole="button"
              accessibilityLabel={`Avatar ${e}`}
              accessibilityState={{ selected: a.avatar === e }}
              onPress={() => set({ avatar: e })}
              style={{
                width: 54,
                height: 54,
                borderRadius: 27,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: a.avatar === e ? c.soft : c.card,
                borderWidth: 2,
                borderColor: a.avatar === e ? c.primary : c.border,
              }}>
              <Text style={{ fontSize: 28 }}>{e}</Text>
            </Pressable>
          ))}
        </Row>
      </View>
      <View style={{ gap: 10 }}>
        <Txt variant="bold">Voz</Txt>
        <Txt variant="caption">Toque para ouvir como ela fala.</Txt>
        <Row gap={8}>
          {(Object.keys(VOICES) as VoiceKey[]).map((k) => (
            <Chip
              key={k}
              label={`${VOICES[k].emoji} ${VOICES[k].label}`}
              selected={a.voice === k}
              onPress={() => {
                set({ voice: k });
                speak(`Oi! Eu sou a ${a.name || 'sua ajudante'}. Vamos escolher um look lindo?`, k);
              }}
            />
          ))}
        </Row>
      </View>
      <Pressable
        accessibilityRole="switch"
        accessibilityState={{ checked: a.autoSpeak }}
        onPress={() => set({ autoSpeak: !a.autoSpeak })}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View
          style={{
            width: 50,
            height: 30,
            borderRadius: 15,
            backgroundColor: a.autoSpeak ? c.primary : c.border,
            padding: 3,
            alignItems: a.autoSpeak ? 'flex-end' : 'flex-start',
          }}>
          <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff' }} />
        </View>
        <Txt style={{ flex: 1 }}>Ler as respostas em voz alta no chat</Txt>
      </Pressable>
    </View>
  );
}

export { Button };

import * as Speech from 'expo-speech';
import type { VoiceKey } from './types';

export const VOICES: Record<VoiceKey, { label: string; emoji: string; pitch: number; rate: number }> = {
  doce: { label: 'Doce', emoji: '🍬', pitch: 1.3, rate: 0.95 },
  animada: { label: 'Animada', emoji: '✨', pitch: 1.25, rate: 1.1 },
  calma: { label: 'Calma', emoji: '🌙', pitch: 1.0, rate: 0.85 },
  divertida: { label: 'Divertida', emoji: '🤖', pitch: 1.6, rate: 1.05 },
};

/** Remove emojis para a voz não ler "rosto sorridente" em voz alta. */
const clean = (t: string) =>
  t
    .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();

export async function speak(text: string, voice: VoiceKey) {
  const v = VOICES[voice];
  try {
    await Speech.stop();
  } catch {}
  Speech.speak(clean(text), { language: 'pt-BR', pitch: v.pitch, rate: v.rate });
}

export function stopSpeaking() {
  Speech.stop().catch(() => {});
}

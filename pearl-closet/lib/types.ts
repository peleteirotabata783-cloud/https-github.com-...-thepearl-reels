export type CategoryKey =
  | 'top'
  | 'bottom'
  | 'dress'
  | 'outerwear'
  | 'shoes'
  | 'accessory'
  | 'bag';

export type StyleKey =
  | 'casual'
  | 'escola'
  | 'esportivo'
  | 'elegante'
  | 'festa'
  | 'praia'
  | 'conforto';

export type ColorKey = string;

export type ClothingItem = {
  id: string;
  name: string;
  category: CategoryKey;
  color: ColorKey;
  styles: StyleKey[];
  warm?: boolean; // peça quentinha (boa para dias frios)
  photoUri?: string;
  createdAt: number;
};

export type Outfit = {
  /** Identidade estável: ids das peças ordenados */
  id: string;
  itemIds: string[];
  eventKey: string;
  reason: string;
  createdAt: number;
};

export type ChatMessage = {
  id: string;
  from: 'user' | 'assistant';
  text: string;
  outfits?: Outfit[];
  chips?: string[];
  createdAt: number;
};

export type PaletteKey = 'perola' | 'lavanda' | 'menta' | 'ceu' | 'pessego' | 'noite';
export type FontKey = 'delicada' | 'divertida' | 'moderna' | 'chique' | 'fofa';
export type VoiceKey = 'doce' | 'animada' | 'calma' | 'divertida';

export type AssistantConfig = {
  name: string;
  avatar: string;
  voice: VoiceKey;
  autoSpeak: boolean;
};

export type AppState = {
  version: 1;
  onboarded: boolean;
  profile: { name: string };
  theme: { palette: PaletteKey; font: FontKey };
  assistant: AssistantConfig;
  items: ClothingItem[];
  favorites: Outfit[];
  chat: ChatMessage[];
};

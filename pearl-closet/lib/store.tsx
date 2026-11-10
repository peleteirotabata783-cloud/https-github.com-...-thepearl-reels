import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { uid } from './id';
import type { AppState, ChatMessage, ClothingItem, Outfit } from './types';

const KEY = 'pearl-closet/state/v1';
const MAX_CHAT = 120;

export const initialState: AppState = {
  version: 1,
  onboarded: false,
  profile: { name: '' },
  theme: { palette: 'perola', font: 'delicada' },
  assistant: { name: 'Pérola', avatar: '🦄', voice: 'doce', autoSpeak: false },
  items: [],
  favorites: [],
  chat: [],
};

export { uid };

type Actions = {
  update: (patch: Partial<AppState>) => void;
  addItem: (item: Omit<ClothingItem, 'id' | 'createdAt'>) => void;
  updateItem: (id: string, patch: Partial<ClothingItem>) => void;
  removeItem: (id: string) => void;
  toggleFavorite: (outfit: Outfit) => void;
  isFavorite: (id: string) => boolean;
  pushMessages: (msgs: ChatMessage[]) => void;
  clearChat: () => void;
  resetAll: () => void;
};

type Ctx = { state: AppState; ready: boolean } & Actions;

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) {
          const parsed = JSON.parse(raw) as AppState;
          if (parsed?.version === 1) setState({ ...initialState, ...parsed });
        }
      })
      .catch(() => {})
      .finally(() => {
        loaded.current = true;
        setReady(true);
      });
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
  }, [state]);

  const update = useCallback((patch: Partial<AppState>) => setState((s) => ({ ...s, ...patch })), []);

  const actions: Actions = useMemo(
    () => ({
      update,
      addItem: (item) =>
        setState((s) => ({ ...s, items: [{ ...item, id: uid(), createdAt: Date.now() }, ...s.items] })),
      updateItem: (id, patch) =>
        setState((s) => ({ ...s, items: s.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) })),
      removeItem: (id) =>
        setState((s) => ({
          ...s,
          items: s.items.filter((i) => i.id !== id),
          favorites: s.favorites.filter((f) => !f.itemIds.includes(id)),
        })),
      toggleFavorite: (outfit) =>
        setState((s) => ({
          ...s,
          favorites: s.favorites.some((f) => f.id === outfit.id)
            ? s.favorites.filter((f) => f.id !== outfit.id)
            : [{ ...outfit, createdAt: Date.now() }, ...s.favorites],
        })),
      isFavorite: () => false, // substituído abaixo (depende do state)
      pushMessages: (msgs) => setState((s) => ({ ...s, chat: [...s.chat, ...msgs].slice(-MAX_CHAT) })),
      clearChat: () => setState((s) => ({ ...s, chat: [] })),
      resetAll: () => setState(initialState),
    }),
    [update],
  );

  const value = useMemo<Ctx>(
    () => ({
      state,
      ready,
      ...actions,
      isFavorite: (id: string) => state.favorites.some((f) => f.id === id),
    }),
    [state, ready, actions],
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('useStore precisa do StoreProvider');
  return ctx;
}

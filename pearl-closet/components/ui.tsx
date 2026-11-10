import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { categoryOf, colorOf, eventOf } from '@/lib/catalog';
import { useStore } from '@/lib/store';
import { FONTS, PALETTES } from '@/lib/themes';
import type { ClothingItem, Outfit } from '@/lib/types';

export function useTheme() {
  const { state } = useStore();
  return { c: PALETTES[state.theme.palette], f: FONTS[state.theme.font] };
}

type Variant = 'display' | 'title' | 'h2' | 'body' | 'bold' | 'caption';

export function Txt({
  variant = 'body',
  color,
  style,
  ...rest
}: TextProps & { variant?: Variant; color?: string }) {
  const { c, f } = useTheme();
  const base: TextStyle = {
    display: { fontFamily: f.title, fontSize: 30, lineHeight: 42 },
    title: { fontFamily: f.title, fontSize: 24, lineHeight: 34 },
    h2: { fontFamily: f.bold, fontSize: 18, lineHeight: 26 },
    body: { fontFamily: f.regular, fontSize: 16, lineHeight: 23 },
    bold: { fontFamily: f.bold, fontSize: 16, lineHeight: 23 },
    caption: { fontFamily: f.regular, fontSize: 13, lineHeight: 18 },
  }[variant];
  return (
    <Text
      {...rest}
      style={[base, { color: color ?? (variant === 'caption' ? c.muted : c.text) }, style]}
    />
  );
}

export function Screen({
  children,
  scroll = true,
  padded = true,
  edges = ['top'],
}: {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: ('top' | 'bottom')[];
}) {
  const { c } = useTheme();
  const inner = padded ? { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 32 } : undefined;
  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: c.bg }}>
      {scroll ? (
        <ScrollView contentContainerStyle={[inner, { maxWidth: 640, width: '100%', alignSelf: 'center' }]}>
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1, maxWidth: 640, width: '100%', alignSelf: 'center' }, inner]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function Button({
  label,
  onPress,
  icon,
  kind = 'primary',
  disabled,
  style,
}: {
  label: string;
  onPress: () => void;
  icon?: ComponentProps<typeof Ionicons>['name'];
  kind?: 'primary' | 'soft' | 'ghost';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { c } = useTheme();
  const bg = kind === 'primary' ? c.primary : kind === 'soft' ? c.soft : 'transparent';
  const fg = kind === 'primary' ? c.onPrimary : c.primary;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg, opacity: disabled ? 0.45 : pressed ? 0.85 : 1 },
        kind === 'ghost' && { borderWidth: 1.5, borderColor: c.border },
        style,
      ]}>
      {icon && <Ionicons name={icon} size={20} color={fg} />}
      <Txt variant="bold" color={fg}>
        {label}
      </Txt>
    </Pressable>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { c } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }, style]}>{children}</View>
  );
}

export function Chip({
  label,
  selected,
  onPress,
  color,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  color?: string;
}) {
  const { c } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? c.primary : c.card,
          borderColor: selected ? c.primary : c.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}>
      {color && <View style={[styles.dot, { backgroundColor: color, borderColor: c.border }]} />}
      <Txt variant="caption" color={selected ? c.onPrimary : c.text} style={{ fontSize: 14 }}>
        {label}
      </Txt>
    </Pressable>
  );
}

export function ItemThumb({ item, size = 96 }: { item: ClothingItem; size?: number }) {
  const { c } = useTheme();
  const col = colorOf(item.color);
  if (item.photoUri) {
    return (
      <Image
        source={{ uri: item.photoUri }}
        style={{ width: size, height: size, borderRadius: 16, backgroundColor: c.soft }}
        accessibilityLabel={item.name}
      />
    );
  }
  return (
    <View
      accessibilityLabel={item.name}
      style={{
        width: size,
        height: size,
        borderRadius: 16,
        backgroundColor: col.family === 'estampa' ? c.soft : col.hex,
        borderWidth: 1,
        borderColor: c.border,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{ fontSize: size * 0.45 }}>
        {col.family === 'estampa' ? '🌸' : ''}
        {categoryOf(item.category).emoji}
      </Text>
    </View>
  );
}

export function OutfitCard({
  outfit,
  items,
  favorite,
  onToggleFavorite,
  compact,
}: {
  outfit: Outfit;
  items: ClothingItem[];
  favorite: boolean;
  onToggleFavorite: () => void;
  compact?: boolean;
}) {
  const { c } = useTheme();
  const pieces = outfit.itemIds
    .map((id) => items.find((i) => i.id === id))
    .filter(Boolean) as ClothingItem[];
  const ev = eventOf(outfit.eventKey);
  return (
    <Card style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Txt variant="bold">
          {ev.emoji} {ev.label}
        </Txt>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={favorite ? 'Remover dos favoritos' : 'Favoritar look'}
          onPress={onToggleFavorite}
          hitSlop={12}
          style={{ padding: 4 }}>
          <Ionicons name={favorite ? 'heart' : 'heart-outline'} size={28} color={c.primary} />
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
        {pieces.map((p) => (
          <View key={p.id} style={{ alignItems: 'center', width: compact ? 72 : 88, gap: 4 }}>
            <ItemThumb item={p} size={compact ? 72 : 88} />
            <Txt variant="caption" numberOfLines={1}>
              {p.name}
            </Txt>
          </View>
        ))}
      </ScrollView>
      <Txt variant="caption" style={{ color: c.text }}>
        {outfit.reason}
      </Txt>
    </Card>
  );
}

export function EmptyState({
  emoji,
  title,
  text,
  action,
}: {
  emoji: string;
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 40, gap: 10 }}>
      <Text style={{ fontSize: 56 }}>{emoji}</Text>
      <Txt variant="h2" style={{ textAlign: 'center' }}>
        {title}
      </Txt>
      <Txt variant="caption" style={{ textAlign: 'center', maxWidth: 300, fontSize: 15 }}>
        {text}
      </Txt>
      {action && <View style={{ marginTop: 8 }}>{action}</View>}
    </View>
  );
}

export const Row = ({ children, gap = 8, wrap = true }: { children: ReactNode; gap?: number; wrap?: boolean }) => (
  <View style={{ flexDirection: 'row', flexWrap: wrap ? 'wrap' : 'nowrap', gap }}>{children}</View>
);

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    paddingHorizontal: 22,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  card: { borderRadius: 22, borderWidth: 1, padding: 16 },
  chip: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 1 },
});

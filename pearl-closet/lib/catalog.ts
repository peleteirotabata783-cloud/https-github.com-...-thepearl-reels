import type { CategoryKey, StyleKey } from './types';

export const CATEGORIES: { key: CategoryKey; label: string; emoji: string }[] = [
  { key: 'top', label: 'Blusas', emoji: '👚' },
  { key: 'bottom', label: 'Calças & Saias', emoji: '👖' },
  { key: 'dress', label: 'Vestidos', emoji: '👗' },
  { key: 'outerwear', label: 'Casacos', emoji: '🧥' },
  { key: 'shoes', label: 'Sapatos', emoji: '👟' },
  { key: 'accessory', label: 'Acessórios', emoji: '🎀' },
  { key: 'bag', label: 'Bolsas', emoji: '👜' },
];

export const categoryOf = (key: CategoryKey) => CATEGORIES.find((c) => c.key === key)!;

export type ColorFamily = 'neutro' | 'quente' | 'frio' | 'pastel' | 'metal' | 'estampa';

export const COLORS: { key: string; label: string; hex: string; family: ColorFamily }[] = [
  { key: 'preto', label: 'Preto', hex: '#1F1F1F', family: 'neutro' },
  { key: 'branco', label: 'Branco', hex: '#FFFFFF', family: 'neutro' },
  { key: 'cinza', label: 'Cinza', hex: '#9E9E9E', family: 'neutro' },
  { key: 'bege', label: 'Bege', hex: '#E8D5B7', family: 'neutro' },
  { key: 'marrom', label: 'Marrom', hex: '#8B5A3C', family: 'neutro' },
  { key: 'jeans', label: 'Jeans', hex: '#5B7FA6', family: 'neutro' },
  { key: 'marinho', label: 'Azul-marinho', hex: '#1F3A68', family: 'frio' },
  { key: 'azul', label: 'Azul', hex: '#3D8BE0', family: 'frio' },
  { key: 'azulclaro', label: 'Azul-bebê', hex: '#BFDDF7', family: 'pastel' },
  { key: 'verde', label: 'Verde', hex: '#3E9C5A', family: 'frio' },
  { key: 'menta', label: 'Verde-menta', hex: '#BDEBD8', family: 'pastel' },
  { key: 'lilas', label: 'Lilás', hex: '#CDB4EF', family: 'pastel' },
  { key: 'roxo', label: 'Roxo', hex: '#7B3FB8', family: 'frio' },
  { key: 'rosaclaro', label: 'Rosa-claro', hex: '#F9C9DD', family: 'pastel' },
  { key: 'rosa', label: 'Rosa', hex: '#E64B93', family: 'quente' },
  { key: 'vermelho', label: 'Vermelho', hex: '#D7263D', family: 'quente' },
  { key: 'laranja', label: 'Laranja', hex: '#F28C28', family: 'quente' },
  { key: 'amarelo', label: 'Amarelo', hex: '#F7CE3E', family: 'quente' },
  { key: 'dourado', label: 'Dourado', hex: '#D4AF37', family: 'metal' },
  { key: 'prata', label: 'Prateado', hex: '#C9CED6', family: 'metal' },
  { key: 'estampado', label: 'Estampado', hex: '#FFFFFF', family: 'estampa' },
];

export const colorOf = (key: string) => COLORS.find((c) => c.key === key) ?? COLORS[1];

export const STYLES: { key: StyleKey; label: string; emoji: string }[] = [
  { key: 'casual', label: 'Dia a dia', emoji: '🌼' },
  { key: 'escola', label: 'Escola', emoji: '📚' },
  { key: 'esportivo', label: 'Esporte', emoji: '⚽' },
  { key: 'elegante', label: 'Elegante', emoji: '💎' },
  { key: 'festa', label: 'Festa', emoji: '🎉' },
  { key: 'praia', label: 'Praia', emoji: '🏖️' },
  { key: 'conforto', label: 'Conforto', emoji: '🧸' },
];

export type EventDef = {
  key: string;
  label: string;
  emoji: string;
  styles: StyleKey[];
  cold?: boolean;
  noOuterwear?: boolean;
  keywords: string[];
};

export const EVENTS: EventDef[] = [
  { key: 'escola', label: 'Escola', emoji: '📚', styles: ['escola', 'casual', 'conforto'], keywords: ['escola', 'aula', 'colegio', 'curso'] },
  { key: 'aniversario', label: 'Festa de aniversário', emoji: '🎂', styles: ['festa', 'elegante', 'casual'], keywords: ['aniversario', 'festa', 'balada', 'niver'] },
  { key: 'shopping', label: 'Passeio no shopping', emoji: '🛍️', styles: ['casual', 'conforto', 'festa'], keywords: ['shopping', 'passeio', 'cinema', 'sair', 'amigas', 'parque'] },
  { key: 'praia', label: 'Praia ou piscina', emoji: '🏖️', styles: ['praia', 'casual'], noOuterwear: true, keywords: ['praia', 'piscina', 'clube', 'verao', 'calor'] },
  { key: 'casamento', label: 'Casamento', emoji: '💍', styles: ['elegante', 'festa'], keywords: ['casamento', 'batizado', 'formatura', 'daminha', 'cerimonia'] },
  { key: 'jantar', label: 'Jantar em família', emoji: '🍝', styles: ['elegante', 'casual'], keywords: ['jantar', 'restaurante', 'almoco', 'familia', 'vovo', 'avo'] },
  { key: 'frio', label: 'Dia frio', emoji: '❄️', styles: ['casual', 'conforto', 'escola'], cold: true, keywords: ['frio', 'inverno', 'chuva', 'gelado'] },
  { key: 'esporte', label: 'Esporte', emoji: '⚽', styles: ['esportivo', 'conforto'], noOuterwear: true, keywords: ['esporte', 'academia', 'educacao fisica', 'ballet', 'bale', 'danca', 'treino', 'futebol', 'volei'] },
  { key: 'pijama', label: 'Festa do pijama', emoji: '🌙', styles: ['conforto', 'casual'], keywords: ['pijama', 'dormir', 'soneca', 'acampar'] },
];

export const eventOf = (key: string) => EVENTS.find((e) => e.key === key) ?? EVENTS[2];

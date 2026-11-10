import type { FontKey, PaletteKey } from './types';

export type Palette = {
  label: string;
  dark: boolean;
  primary: string;
  primaryDark: string;
  onPrimary: string;
  soft: string;
  bg: string;
  card: string;
  text: string;
  muted: string;
  border: string;
};

export const PALETTES: Record<PaletteKey, Palette> = {
  perola: {
    label: 'Rosa Pérola',
    dark: false,
    primary: '#D9468C',
    primaryDark: '#B5306F',
    onPrimary: '#FFFFFF',
    soft: '#FDE7F1',
    bg: '#FFF7FB',
    card: '#FFFFFF',
    text: '#3A2233',
    muted: '#8A6A7E',
    border: '#F5D3E3',
  },
  lavanda: {
    label: 'Lavanda',
    dark: false,
    primary: '#8B5CD6',
    primaryDark: '#6E40B8',
    onPrimary: '#FFFFFF',
    soft: '#EFE6FC',
    bg: '#FAF6FF',
    card: '#FFFFFF',
    text: '#2E2340',
    muted: '#776A8C',
    border: '#E3D6F7',
  },
  menta: {
    label: 'Menta',
    dark: false,
    primary: '#17917C',
    primaryDark: '#0F7564',
    onPrimary: '#FFFFFF',
    soft: '#DDF6F0',
    bg: '#F5FFFC',
    card: '#FFFFFF',
    text: '#1F3A35',
    muted: '#5A7A73',
    border: '#CDEDE5',
  },
  ceu: {
    label: 'Céu',
    dark: false,
    primary: '#3D7FD6',
    primaryDark: '#2A63B0',
    onPrimary: '#FFFFFF',
    soft: '#E3EFFC',
    bg: '#F6FAFF',
    card: '#FFFFFF',
    text: '#1E2E44',
    muted: '#62748B',
    border: '#D3E3F7',
  },
  pessego: {
    label: 'Pêssego',
    dark: false,
    primary: '#D55E44',
    primaryDark: '#B44730',
    onPrimary: '#FFFFFF',
    soft: '#FDE9E3',
    bg: '#FFF8F5',
    card: '#FFFFFF',
    text: '#3D2620',
    muted: '#8A6A61',
    border: '#F7D6CC',
  },
  noite: {
    label: 'Noite Glam',
    dark: true,
    primary: '#FF6FB5',
    primaryDark: '#E04C98',
    onPrimary: '#2A0F1F',
    soft: '#3A2340',
    bg: '#1A1220',
    card: '#261A2E',
    text: '#FBEAF4',
    muted: '#BFA3B6',
    border: '#3D2A47',
  },
};

export type FontSet = {
  label: string;
  regular: string;
  bold: string;
  title: string;
};

export const FONTS: Record<FontKey, FontSet> = {
  delicada: {
    label: 'Delicada',
    regular: 'Quicksand_500Medium',
    bold: 'Quicksand_700Bold',
    title: 'Quicksand_700Bold',
  },
  divertida: {
    label: 'Divertida',
    regular: 'Fredoka_400Regular',
    bold: 'Fredoka_600SemiBold',
    title: 'Fredoka_600SemiBold',
  },
  moderna: {
    label: 'Moderna',
    regular: 'Poppins_400Regular',
    bold: 'Poppins_600SemiBold',
    title: 'Poppins_600SemiBold',
  },
  chique: {
    label: 'Chique',
    regular: 'Poppins_400Regular',
    bold: 'Poppins_600SemiBold',
    title: 'PlayfairDisplay_700Bold',
  },
  fofa: {
    label: 'Fofa',
    regular: 'Quicksand_500Medium',
    bold: 'Quicksand_700Bold',
    title: 'Pacifico_400Regular',
  },
};

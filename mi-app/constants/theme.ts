/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Paletas = {
  oscuro: {
    header: '#1A1917',
    fondo: '#F5F3EE',
    superficie: '#FFFFFF',
    borde: '#E5E2DA',
    acento: '#3B6D11',
    acentoSuave: '#EAF3DE',
    texto: '#1A1917',
    textoSuave: '#6B6860',
    textoMuted: '#A8A59E',
  },
  pastel: {
    header: '#7C5C8A',
    fondo: '#F5F0FA',
    superficie: '#FFFFFF',
    borde: '#E8DDEF',
    acento: '#A66BBF',
    acentoSuave: '#EFE4F7',
    texto: '#3B2650',
    textoSuave: '#7B5E8A',
    textoMuted: '#B89EC7',
  },
  vivos: {
    header: '#0C447C',
    fondo: '#F0F6FF',
    superficie: '#FFFFFF',
    borde: '#C8DEFF',
    acento: '#D85A30',
    acentoSuave: '#FDEEE8',
    texto: '#0C1F3F',
    textoSuave: '#3A5A8A',
    textoMuted: '#7A9CC0',
  },
  grises: {
    header: '#2C2C2C',
    fondo: '#F2F2F2',
    superficie: '#FFFFFF',
    borde: '#DEDEDE',
    acento: '#555555',
    acentoSuave: '#EBEBEB',
    texto: '#1A1A1A',
    textoSuave: '#555555',
    textoMuted: '#999999',
  },
  natural: {
    header: '#2D4A1E',
    fondo: '#F5F0E8',
    superficie: '#FFFDF7',
    borde: '#DDD5C0',
    acento: '#5A8A2E',
    acentoSuave: '#EAF3DE',
    texto: '#1E2D10',
    textoSuave: '#4A6A30',
    textoMuted: '#8A9E70',
  },
};

export type PaletaNombre = keyof typeof Paletas;
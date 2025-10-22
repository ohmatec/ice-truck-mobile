import type { TextStyle } from "react-native";
// Design tokens (สี/spacing/radius/shadow/typography) ใช้ซ้ำได้ทุกหน้าจอ
export const colors = {
  bg: '#0B0F14',
  card: '#121821',
  text: '#E6EDF3',
  textMuted: '#9FB0C0',
  primary: '#4BA3FF',
  danger: '#FF6B6B',
  success: '#78E08F',
  border: '#1E2630'
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24
};

export const shadow = {
  card: {
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 }
  }
};

export const typography: Record<"h1" | "h2" | "body" | "caption", TextStyle> = {
  h1: { fontSize: 22, lineHeight: 28, fontWeight: 800 },
  h2: { fontSize: 18, lineHeight: 24, fontWeight: 700 },
  body: { fontSize: 14, lineHeight: 20, fontWeight: 400 },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: 400 },
};

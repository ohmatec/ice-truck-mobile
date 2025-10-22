// src/theme/styles.ts
import { StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "./tokens";

/**
 * หมายเหตุ:
 * - ใช้ fontWeight แบบ "ตัวเลข" ใน typography เพื่อให้เข้ากับชนิดของ React Native
 * - prop `gap` รองรับใน RN รุ่นใหม่; ถ้า TS ฟ้องให้ใช้ margin ระหว่างลูกแทน
 */
export const common = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },

  // ตัวหนังสือ
  h1: { color: colors.text, ...typography.h1 },
  h2: { color: colors.text, ...typography.h2 },
  body: { color: colors.text, ...typography.body },
  caption: { color: colors.textMuted, ...typography.caption },

  // layout helpers
  row: { flexDirection: "row", alignItems: "center" },
  gapSm: { gap: spacing.sm },
  gapMd: { gap: spacing.md },
  gapLg: { gap: spacing.lg },
});

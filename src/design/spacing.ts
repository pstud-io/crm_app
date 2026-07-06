import { Spacing } from "@/types/spacingTypes";

export const spacing = {
  min: 2,
  tiny: 4,
  xxs: 6,
  xs: 8,
  sm: 10,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  huge: 28,
  max: 32,
} as const satisfies Spacing;

import { BorderRadius, BorderWidth } from "@/types/borderTypes";
import { StyleSheet } from "react-native";

export const borderRadius = {
  none: 0,
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
  extreme: 64,
  full: 9999,
} as const satisfies BorderRadius;

export const borderWidth = {
  none: 0,
  hw: StyleSheet.hairlineWidth,
  thin: 0.25,
  xs: 0.5,
  sm: 0.75,
  md: 1,
  lg: 1.25,
  xl: 1.5,
  thick: 2,
} as const satisfies BorderWidth;

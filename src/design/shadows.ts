import { Shadow } from "@/types/shadowTypes";

export const lightShadows = {
  xxs: "0px 1px 2px rgba(10, 13, 18, 0.05)",
  xs: "0px 1px 3px rgba(10, 13, 18, 0.10), 0px 1px 2px rgba(10, 13, 18, 0.06)",
  sm: "0px 4px 8px -2px rgba(10, 13, 18, 0.10), 0px 2px 4px -2px rgba(10, 13, 18, 0.06)",
  md: "0px 12px 16px -4px rgba(10, 13, 18, 0.08), 0px 4px 6px -2px rgba(10, 13, 18, 0.03)",
  lg: "0px 20px 24px -4px rgba(10, 13, 18, 0.08), 0px 8px 8px -4px rgba(10, 13, 18, 0.03)",
  xl: "0px 24px 48px -12px rgba(10, 13, 18, 0.18)",
  xxl: "0px 32px 64px -12px rgba(10, 13, 18, 0.14)",
} as const satisfies Shadow;

export const darkShadows = {
  xxs: "0px 1px 2px rgba(0, 0, 0, 0.03)",
  xs: "0px 1px 3px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.03)",
  sm: "0px 4px 8px -2px rgba(0, 0, 0, 0.05), 0px 2px 4px -2px rgba(0, 0, 0, 0.03)",
  md: "0px 12px 16px -4px rgba(0, 0, 0, 0.04), 0px 4px 6px -2px rgba(0, 0, 0, 0.02)",
  lg: "0px 20px 24px -4px rgba(0, 0, 0, 0.04), 0px 8px 8px -4px rgba(0, 0, 0, 0.02)",
  xl: "0px 24px 48px -12px rgba(0, 0, 0, 0.10)",
  xxl: "0px 32px 64px -12px rgba(0, 0, 0, 0.08)",
} as const satisfies Shadow;

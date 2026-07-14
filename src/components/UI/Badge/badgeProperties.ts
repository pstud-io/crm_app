import { spacing } from "@/design/spacing";
import { body } from "@/design/typography";
import { TextStyle } from "react-native";

export interface BadgeProperty {
  pv: number;
  ph: number;
  text: TextStyle;
}

export interface NoTextPadding {
  pv: number;
  ph: number;
}

export type BadgeSize = "lg" | "md" | "sm" | "xs";

export const badgeProperties: Record<BadgeSize, BadgeProperty> = {
  lg: {
    pv: spacing.tiny,
    ph: spacing.sm,
    text: body.sm.regular,
  },
  md: {
    pv: spacing.tiny,
    ph: spacing.md,
    text: body.xs.regular,
  },
  sm: {
    pv: spacing.min,
    ph: spacing.xs,
    text: body.xs.regular,
  },
  xs: {
    pv: spacing.min,
    ph: spacing.xs,
    text: body.xxs.regular,
  },
};

export const noTextPadding: Record<BadgeSize, NoTextPadding> = {
  lg: {
    ph: spacing.xs,
    pv: spacing.xs,
  },
  md: {
    ph: spacing.xxs,
    pv: spacing.xxs,
  },
  sm: {
    ph: spacing.tiny,
    pv: spacing.tiny,
  },
  xs: {
    ph: spacing.min,
    pv: spacing.min,
  },
};

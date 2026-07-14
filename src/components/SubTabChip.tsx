import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { body } from "@/design/typography";
import { useTheme } from "@/hooks/useTheme";
import { primaryColors } from "./UI/DesignSystem/colorPalette";

import { ReactNode } from "react";
import { spacing } from "@/design/spacing";
import { borderRadius, borderWidth } from "@/design/borders";
import { center, xstack } from "@/design/layout";

export type SubTabChipType = "default" | "outlined" | "disabled";

export interface SubTabChipProps {
  title: string;
  type?: SubTabChipType;
  onPress?: () => void;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  index?: number;
}

export const SubTabChip = ({
  title,
  type = "default",
  onPress,
  iconLeft,
  iconRight,
  index = 0,
}: SubTabChipProps) => {
  const { theme } = useTheme();

  const chipStyles: Record<
    SubTabChipType,
    {
      backgroundColor: string;
      borderColor: string;
      textColor: string;
    }
  > = {
    default: {
      backgroundColor: theme.button,
      borderColor: theme.button,
      textColor: theme.buttonInverse,
    },
    outlined: {
      backgroundColor: theme.background,
      borderColor: theme.border,
      textColor: theme.text,
    },
    disabled: {
      backgroundColor: theme.backgroundDisabled,
      borderColor: theme.backgroundDisabled,
      textColor: theme.placeholderText,
    },
  };

  const currentStyle = chipStyles[type];

  return (
    <TouchableOpacity
      disabled={type === "disabled"}
      onPress={onPress}
      style={[
        xstack,
        center,
        {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs,
          gap: spacing.xs,
          backgroundColor: currentStyle.backgroundColor,
          borderColor: currentStyle.borderColor,
          borderWidth: borderWidth.md,
          borderRadius: borderRadius.full,
        },
      ]}
    >
      {iconLeft}

      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{
          ...body.sm.medium,
          color: currentStyle.textColor,
        }}
      >
        {title}
      </Text>

      {iconRight}
    </TouchableOpacity>
  );
};

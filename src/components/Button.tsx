import { borderRadius, borderWidth } from "@/design/borders";
import { center, fullWidth, xstack } from "@/design/layout";
import { spacing } from "@/design/spacing";
import { body } from "@/design/typography";
import { useTheme } from "@/hooks/useTheme";
import { ActivityIndicator, Pressable, Text, ViewStyle } from "react-native";

type CustomButton = {
  label: string | null;
  loading: boolean;
  onPress: () => void | Promise<void>;
  style?: ViewStyle;
  themeInverse?: boolean;
  leftIcon?: React.ReactNode | null;
  hasBorder?: boolean;
};

export const Button = ({
  label,
  loading,
  onPress,
  style,
  themeInverse = false,
  leftIcon = null,
  hasBorder = true,
}: CustomButton) => {
  const { theme } = useTheme();
  return (
    <Pressable
      style={[
        xstack,
        center,
        {
          paddingHorizontal: spacing.xxl,
          paddingVertical: spacing.md,
          borderRadius: borderRadius.lg,
          gap: spacing.lg,
          backgroundColor: themeInverse ? theme.buttonInverse : theme.button,
        },
        hasBorder && {
          borderWidth: themeInverse ? borderWidth.xs : borderWidth.none,
          borderColor: themeInverse ? theme.backgroundInverse : "transparent",
        },
        style,
      ]}
      disabled={loading}
      onPress={onPress}
    >
      {leftIcon && leftIcon}
      {label && (
        <Text
          style={[
            themeInverse ? body.sm.regular : body.sm.semiBold,
            { color: themeInverse ? theme.text : theme.textInverse },
          ]}
        >
          {label}
        </Text>
      )}
      {loading && (
        <ActivityIndicator
          size={10}
          color={themeInverse ? theme.text : theme.textInverse}
        />
      )}
    </Pressable>
  );
};

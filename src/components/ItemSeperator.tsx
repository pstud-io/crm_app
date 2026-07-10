import { borderWidth } from "@/design/borders";
import { spacing } from "@/design/spacing";
import { useTheme } from "@/hooks/useTheme";
import { StyleSheet, View, ViewStyle } from "react-native";

interface ItemSeparatorProps {
  direction: "horizontal" | "vertical";
  style?: ViewStyle;
  opacity: number;
}

export const ItemSeparator = ({
  direction,
  style,
  opacity,
}: ItemSeparatorProps) => {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    horizontal: {
      width: "100%",
      borderColor: theme.border,
      borderTopWidth: borderWidth.md,
      marginVertical: spacing.xxs,
      opacity: opacity,
    },
    vertical: {
      height: "50%",
      borderColor: theme.border,
      borderRightWidth: borderWidth.md,
      alignSelf: "center",
      marginHorizontal: spacing.xxs,
      opacity: opacity,
    },
  });
  return <View style={{ ...styles[direction], ...style }} />;
};

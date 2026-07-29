import { center, fullHeight, fullWidth, xstack, ystack } from "@/design/layout";
import { spacing } from "@/design/spacing";
import { useTheme } from "@/hooks/useTheme";
import { View, ViewStyle } from "react-native";

export const ListWrapper = ({
  children,
  style = undefined,
}: {
  children: React.ReactNode;
  style?: ViewStyle | undefined;
}) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: theme.background,
          paddingTop: spacing.lg,
          flex: 1,
        },
        style && style,
      ]}
    >
      {children}
    </View>
  );
};

import { center, fullHeight, fullWidth, xstack, ystack } from "@/design/layout";
import { spacing } from "@/design/spacing";
import { useTheme } from "@/hooks/useTheme";
import { View } from "react-native";

export const ListWrapper = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: theme.background,
          paddingTop: spacing.lg,
          flex: 1,
        },
      ]}
    >
      {children}
    </View>
  );
};

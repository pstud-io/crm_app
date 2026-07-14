import {
  center,
  fullHeight,
  fullWidth,
  grow,
  transparent,
  xstack,
  ystack,
} from "@/design/layout";
import { spacing } from "@/design/spacing";
import { ActivityIndicator, View } from "react-native";

export const ActivityIndicatorWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <View
      style={[
        fullWidth,
        ystack,
        transparent,
        { justifyContent: "flex-start", paddingTop: spacing.lg },
      ]}
    >
      {children}
    </View>
  );
};

import { ActivityIndicator, View, ViewStyle } from "react-native";
import { secondaryColors } from "@/design/colors";
import { spacing } from "@/design/spacing";
const LoadingIndicatorFooter = ({ width, size }: { width: any; size: any }) => {
  return (
    <View
      style={{
        paddingVertical: spacing.max,
        alignItems: "center",
        width: width ?? "auto",
      }}
    >
      <ActivityIndicator size={size ?? 20} color={secondaryColors.gray[400]} />
    </View>
  );
};
export default LoadingIndicatorFooter;

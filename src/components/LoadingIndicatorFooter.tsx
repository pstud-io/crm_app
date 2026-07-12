import { ActivityIndicator, View, ViewStyle } from "react-native";
import { secondaryColors } from "@/design/colors";
const LoadingIndicatorFooter = ({ width, size }: { width: any; size: any }) => {
  return (
    <View
      style={{
        paddingVertical: 8,
        alignItems: "center",
        width: width ?? "auto",
      }}
    >
      <ActivityIndicator size={size ?? 24} color={secondaryColors.gray[400]} />
    </View>
  );
};
export default LoadingIndicatorFooter;

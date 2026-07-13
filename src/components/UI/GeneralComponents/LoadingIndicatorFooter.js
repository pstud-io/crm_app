import { primaryColors } from "../DesignSystem/colorPalette";
import { Colors, SH } from "../../../utils";
import { ActivityIndicator, View } from "react-native";
const LoadingIndicatorFooter = ({ width, size }) => {
  return (
    <View
      style={{
        paddingVertical: SH(8),
        alignItems: "center",
        width: width ?? "auto",
      }}
    >
      <ActivityIndicator
        size={size ?? SH(24)}
        color={primaryColors.gray[400]}
      />
    </View>
  );
};
export default LoadingIndicatorFooter;

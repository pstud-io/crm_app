import { StyleSheet, View } from "react-native";
import { primaryColors } from "../DesignSystem/colorPalette";
import { SH } from "../../../utils";

export const ItemSeparatorComponent = ({ direction, style }) => {
  return <View style={{ ...styles[direction], ...style }} />;
};

const styles = StyleSheet.create({
  horizontal: {
    width: "100%",
    borderColor: primaryColors.gray[200],
    borderTopWidth: SH(1),
    marginVertical: SH(12),
  },
  vertical: {
    height: "50%",
    borderColor: primaryColors.gray[200],
    borderRightWidth: 1,
    alignSelf: "center",
    marginHorizontal: SH(4),
  },
});

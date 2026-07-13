import { Text } from "react-native";
import { SW, SH } from "../../../utils";
import { body } from "../DesignSystem/typography";
import { primaryColors } from "../DesignSystem/colorPalette";
const EmptyListComponent = ({ text }) => {
  return (
    <Text
      style={{
        display: "flex",
        flexDirection: "row",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: SH(4),
        ...body.sm.medium,
        color: primaryColors.gray[500],
      }}
    >
      {text}
    </Text>
  );
};
export default EmptyListComponent;

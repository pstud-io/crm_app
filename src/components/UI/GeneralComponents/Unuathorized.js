import { View, Text } from "react-native";
import { primaryColors } from "../DesignSystem/colorPalette";
import { body } from "../DesignSystem/typography";
const Unauthorized = () => {
  return (
    <View style={{ justifyContent: "center", flex: 1, alignSelf: "center" }}>
      <View style={{ flex: 1, borderWidth: 0 }}>
        <Text
          style={{
            ...body.md.medium,
            color: primaryColors.gray[700],
            textAlign: "center",
          }}
        >
          You do not have permission to view this
        </Text>
      </View>
    </View>
  );
};

export default Unauthorized;

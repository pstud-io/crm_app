import React from "react";
import { Text, View } from "react-native";
import { WalletFilledIcon } from "../../svg";
import { Colors, SF } from "../../utils";
import { body } from "../UI/DesignSystem/typography";

const AppHeader = ({ title }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        borderWidth: 0,
        alignItems: "center",
      }}
    >
      <View>
        <Text
          style={{
            textAlign: "left",
            ...body.xl.semiBold,
            color: Colors.black_text_color,
          }}
        >
          {title}
        </Text>
      </View>
    </View>
  );
};

export default AppHeader;

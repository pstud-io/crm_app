import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { capitalizeEachWord, SH, SW } from "../../../utils";
import { body } from "../DesignSystem/typography";
import { primaryColors } from "../DesignSystem/colorPalette";

export const SlowNetworkCard = ({ module }) => {
  return (
    <View
      style={{
        backgroundColor: "#FFF8E1",
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#FFD54F",
        borderRadius: SW(16),
        padding: SW(16),
        marginBottom: SH(16),
        width: "100%",
      }}
    >
      <Text
        style={{
          ...body.sm.semiBold,
          color: primaryColors.brand[1000],
          marginBottom: SH(6),
        }}
      >
        Slow Network Detected
      </Text>

      <Text
        style={{
          ...body.sm.regular,
          color: primaryColors.brand[1000],
          width: "100%",
        }}
      >
        Your connection appears to be slow.{" "}
        <Text style={{ ...body.sm.semiBold, color: primaryColors.brand[1000] }}>
          {capitalizeEachWord(module)}
        </Text>{" "}
        will be added to the sync queue. you can sync it later
      </Text>
    </View>
  );
};

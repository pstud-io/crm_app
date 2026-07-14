import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import { SH, SW } from "../../utils";
import { primaryColors } from "../UI/DesignSystem/colorPalette";
import { body } from "../UI/DesignSystem/typography";

export const MoreModalPopoverOption = ({ item, handleNavigation }) => {
  return (
    <TouchableOpacity
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: SW(8),
        justifyContent: "center",
        paddingHorizontal: SW(12),
        alignSelf: "flex-start",
        paddingVertical: SH(12),
      }}
      onPress={async () => {
        await handleNavigation(item.component);
      }}
    >
      {item.icon}
      <Text
        style={{
          ...body.sm.medium,
          color: primaryColors.gray[700],
        }}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );
};

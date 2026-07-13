import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import { SH, SW } from "../../../utils";
import { body } from "../DesignSystem/typography";
import { primaryColors } from "../DesignSystem/colorPalette";
export const RenderPopoverMenuOption = ({ item }) => {
  const [loading, setLoading] = useState(false);
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
        setLoading(true);
        await item.onPress();
        setLoading(false);
      }}
    >
      {loading ? (
        <ActivityIndicator size={SW(14)} color={primaryColors.gray[900]} />
      ) : (
        item.icon
      )}
      <Text
        style={{
          ...body.sm.medium,
          color: primaryColors.gray[700],
        }}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );
};

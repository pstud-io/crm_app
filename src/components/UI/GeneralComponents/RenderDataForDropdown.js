import { Colors, SH, SW, SF } from "../../../utils";
import { View, Text, StyleSheet } from "react-native";
import { primaryColors } from "../DesignSystem/colorPalette";
import { body } from "../DesignSystem/typography";
import Radio from "../../../svg/radio";

export const RenderDataForDropdown = ({ itemName, isSelected }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderRadius: SW(8),
        flex: 1,
        height: SH(44),
        gap: SW(8),
        // paddingHorizontal: SW(14),
        // backgroundColor: isSelected ? "#E8F3FD" : "#f5f5f5",
        // borderWidth: StyleSheet.hairlineWidth,
        // borderColor: isSelected ? Colors.primary : Colors.gray_line_color,
        // marginBottom: SH(12),
      }}
    >
      <Radio
        width={SW(16)}
        height={SH(16)}
        strokeWidth={1}
        stroke={primaryColors.gray[500]}
        selected={isSelected}
      />
      <Text
        style={{
          ...body.md.regular,
          color: isSelected ? primaryColors.brand[1000] : "#111",
          flex: 1,
        }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {itemName}
      </Text>
    </View>
  );
};

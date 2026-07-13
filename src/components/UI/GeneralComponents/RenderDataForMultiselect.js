import { View, Text } from "react-native";
import { Checked, Unchecked } from "../../../svg";
import { Colors, SW, SH, SF } from "../../../utils";
import { StyleSheet } from "react-native";
import { primaryColors } from "../DesignSystem/colorPalette";
import { body } from "../DesignSystem/typography";
import { Badge } from "../Badge/Badge";
import badgeColors from "../Badge/badgeColors";
export const RenderDataForMultiselect = ({
  item,
  isSelected,
  extraContent = false,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 8,
        flex: 1,
        height: SH(44),
        gap: SW(8),
        // paddingHorizontal: 14,
        // backgroundColor: isSelected ? "#E8F3FD" : "#f5f5f5",
        // borderWidth: StyleSheet.hairlineWidth,
        // borderColor: isSelected ? Colors.primary : Colors.gray_line_color,
        // marginBottom: SH(12),
      }}
    >
      {isSelected ? (
        <Checked
          width={SW(20)}
          height={SH(20)}
          fill={primaryColors.gray[50]}
          stroke={primaryColors.brand[1000]}
          strokeWidth={1}
        />
      ) : (
        <Unchecked
          width={SW(20)}
          height={SH(20)}
          stroke={primaryColors.gray[300]}
          strokeWidth={1}
        />
      )}
      <Text
        style={{
          ...body.md.regular,
          color: isSelected ? primaryColors.brand[1000] : "#111",
          flex: 1,
        }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {item.name || item.item_name || item.title || item.quote_number}
      </Text>
      {extraContent && (
        <Badge
          size="sm"
          color={badgeColors.blueGray}
          text={`${item?.quote_item_details.length.toString()} items`}
          alignSelf="center"
        />
      )}
    </View>
  );
};

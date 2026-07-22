import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { primaryColors } from "../../../../components/UI/DesignSystem/colorPalette";
import { body } from "../../../../components/UI/DesignSystem/typography";
import { SH, SW } from "../../../../utils";
import { ChevronDown } from "../../../../svg";

export const MenuItem = ({
  label,
  labelColor = primaryColors.brand[1000],
  leftIcon,
  leftIconTheme,
  hasRightIcon = false,
  rightIcon,
  onPress = () => null,
  isPopoverItem = false,
}) => {
  return (
    <TouchableOpacity
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: isPopoverItem ? SH(48) : SH(60),
        width: "100%",
        paddingHorizontal: SW(20),
        paddingVertical: SH(8),
        gap: SW(8),
      }}
      onPress={onPress}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: isPopoverItem ? SH(32) : SH(36),
          height: isPopoverItem ? SH(32) : SH(36),
          borderRadius: SW(36),
          backgroundColor: leftIconTheme.background,
        }}
      >
        {leftIcon(true)}
      </View>
      <Text
        style={[
          { color: labelColor, flexGrow: 1 },
          isPopoverItem ? { ...body.xs.regular } : { ...body.sm.regular },
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
      {hasRightIcon &&
        (rightIcon ?? (
          <ChevronDown
            width={isPopoverItem ? SH(14) : SH(16)}
            height={isPopoverItem ? SH(14) : SH(16)}
            stroke={primaryColors.gray[600]}
            strokeWidth={1}
            style={{ transform: [{ rotate: "-90deg" }] }}
          />
        ))}
    </TouchableOpacity>
  );
};

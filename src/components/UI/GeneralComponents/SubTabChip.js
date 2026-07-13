import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { SH, SW } from "../../../utils";
import { body } from "../DesignSystem/typography";
import { primaryColors } from "../DesignSystem/colorPalette";

const SecondaryButtonStyles = {
  default: {
    backgroundColor: primaryColors.gray[800],
    color: primaryColors.gray[25],
  },
  outlined: {
    backgroundColor: "white",
    color: primaryColors.gray[800],
  },
  disabled: {
    backgroundColor: "transparent",
    color: primaryColors.gray[300],
  },
};

export const SubTabChip = ({
  title,
  type,
  onPress,
  iconLeft,
  iconRight,
  index,
}) => {
  const dynamicStyle = SecondaryButtonStyles[type];

  const SecondaryButtomPressedFunctions = {
    disabled: () => {},
    default: onPress,
    outlined: onPress,
  };
  const functionToExucute = SecondaryButtomPressedFunctions[type];

  return (
    <TouchableOpacity
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: SW(12),
        paddingVertical: SH(8),
        gap: SW(8),
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: primaryColors.gray[700],
        backgroundColor: dynamicStyle.backgroundColor,
        borderRadius: SW(100),
        marginLeft: index === 0 ? SW(0) : SW(10),
        elevation: 1,
        shadowColor: "#0A0D12",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      }}
      onPress={functionToExucute}
    >
      {iconLeft && iconLeft}
      <Text
        style={{
          ...body.sm.medium,
          color: dynamicStyle.color,
        }}
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {title}
      </Text>
      {iconRight && iconLeft}
    </TouchableOpacity>
  );
};

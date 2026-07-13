import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { SH, SW } from "../../../utils";
import { body } from "../DesignSystem/typography";
import { primaryColors } from "../DesignSystem/colorPalette";

const SecondaryButtonStyles = {
  default: {
    borderBottomColor: primaryColors.brand[1000],
    color: primaryColors.brand[1000],
  },
  outlined: {
    borderBottomColor: "transparent",
    color: primaryColors.gray[700],
  },
  disabled: {
    borderBottomColor: "transparent",
    color: primaryColors.gray[300],
  },
};

export const SecondaryButton = ({
  title,
  type,
  onPress,
  iconLeft,
  iconRight,
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
        paddingVertical: SH(16),
        gap: SW(8),
        borderBottomWidth: SW(2),
        borderBottomColor: dynamicStyle.borderBottomColor,
        backgroundColor: "transparent",
      }}
      onPress={functionToExucute}
    >
      {iconLeft && iconLeft}
      <Text
        style={{
          ...body.sm.semiBold,
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

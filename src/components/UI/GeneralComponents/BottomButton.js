import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { SH, SW } from "../../../utils";
import { body } from "../DesignSystem/typography";
import { primaryColors } from "../DesignSystem/colorPalette";

const BottomButtomStyles = {
  default: {
    button: {
      backgroundColor: primaryColors.button.active,
      borderColor: primaryColors.button.active,
    },
    text: { color: primaryColors.gray[25] },
  },
  outlined: {
    button: {
      backgroundColor: "transparent",
      borderColor: primaryColors.button.active,
    },
    text: { color: primaryColors.button.active },
  },
  approveDefault: {
    button: {
      backgroundColor: primaryColors.success[600],
      borderColor: primaryColors.success[600],
    },
    text: { color: primaryColors.gray[25] },
  },
  approveOutlined: {
    button: {
      backgroundColor: "transparent",
      borderColor: primaryColors.success[600],
    },
    text: { color: primaryColors.success[600] },
  },
  rejectDefault: {
    button: {
      backgroundColor: primaryColors.error[600],
      borderColor: primaryColors.error[600],
    },
    text: { color: primaryColors.gray[25] },
  },
  rejectOutlined: {
    button: {
      backgroundColor: "transparent",
      borderColor: primaryColors.error[500],
    },
    text: { color: primaryColors.error[500] },
  },
  disabled: {
    button: {
      backgroundColor: primaryColors.gray[300],
      borderColor: primaryColors.gray[300],
    },
    text: { color: primaryColors.gray[500] },
  },
};

export const BottomButton = ({
  title,
  type = "default",
  onPress,
  icon,
  iconLeft,
  disabled,
  style,
  disableUIonly = false,
}) => {
  const currentType = disabled ? "disabled" : type || "default";
  const dynamicStyle =
    BottomButtomStyles[currentType] || BottomButtomStyles.default;

  const functionToExecute = disabled && !disableUIonly ? null : onPress;

  return (
    <TouchableOpacity
      disabled={disabled && !disableUIonly}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: SW(16),
          paddingVertical: SH(14),
          borderRadius: SW(8),
          gap: 8,
          borderWidth: 1,
          flex: 1,
        },
        dynamicStyle.button,
        style,
      ]}
      onPress={functionToExecute}
    >
      {iconLeft && iconLeft}
      <Text
        style={[body.sm.semiBold, dynamicStyle.text]}
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {title}
      </Text>
      {icon && icon}
    </TouchableOpacity>
  );
};

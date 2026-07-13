import { StyleSheet, Text, View } from "react-native";
import { noTextPadding, badgeProperties } from "./badgeProperties";
import { CircleFilled } from "../../../svg";
import { SW, SH } from "../../../utils";

export const Badge = ({
  size = "md",
  color,
  text,
  iconLeft,
  iconRight,
  maxWidth,
  alignSelf = "flex-start",
  avatarLeft,
  border,
  dot,
  textStyles,
}) => {
  const badgeProps = badgeProperties[size];
  const noTextProps = noTextPadding[size];
  return (
    <View
      style={[
        {
          backgroundColor: color?.background,
          paddingHorizontal: text ? badgeProps.ph : noTextProps.ph,
          paddingVertical: text ? badgeProps.pv : noTextProps.pv,
          borderRadius: SW(16),
          display: "flex",
          flexDirection: "row",
          gap: SW(4),
          alignItems: "center",
          justifyContent: "center",
          alignSelf: alignSelf,
          maxWidth: maxWidth,
        },
        border && {
          borderWidth: SW(StyleSheet.hairlineWidth),
          borderColor: color.text,
        },
      ]}
    >
      {iconLeft && iconLeft}
      {dot && <CircleFilled height={SH(6)} width={SW(6)} fill={color.text} />}
      {text && (
        <Text
          style={{
            ...badgeProps.text,
            color: color.text,
            ...textStyles,
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {text}
        </Text>
      )}
      {iconRight && iconRight}
    </View>
  );
};

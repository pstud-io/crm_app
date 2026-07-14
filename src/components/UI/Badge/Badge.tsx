import React, { ReactNode } from "react";
import {
  DimensionValue,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import {
  noTextPadding,
  badgeProperties,
  BadgeProperty,
  BadgeSize,
  NoTextPadding,
} from "./badgeProperties";
import { BadgeColorConfig } from "./badgeColors";
import CircleFilledIcon from "assets/icons/CircleFilledIcon";
import { height, width } from "@/design/distance";

export interface BadgeProps {
  size?: BadgeSize;
  color: BadgeColorConfig;
  text?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  avatarLeft?: ReactNode;
  maxWidth?: DimensionValue;
  alignSelf?: ViewStyle["alignSelf"];
  border?: boolean;
  dot?: boolean;
  textStyles?: StyleProp<TextStyle>;
}

export const Badge: React.FC<BadgeProps> = ({
  size = "md",
  color,
  text,
  iconLeft,
  iconRight,
  avatarLeft,
  maxWidth,
  alignSelf = "flex-start",
  border = false,
  dot = false,
  textStyles,
}) => {
  const badgeProps: BadgeProperty = badgeProperties[size];
  const noTextProps: NoTextPadding = noTextPadding[size];

  return (
    <View
      style={[
        {
          backgroundColor: color.background,
          paddingHorizontal: text ? badgeProps.ph : noTextProps.ph,
          paddingVertical: text ? badgeProps.pv : noTextProps.pv,
          borderRadius: 16,
          flexDirection: "row",
          gap: 4,
          alignItems: "center",
          justifyContent: "center",
          alignSelf,
          maxWidth,
        },
        border && {
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: color.text,
        },
      ]}
    >
      {avatarLeft}
      {iconLeft}

      {dot && (
        <CircleFilledIcon
          height={height[6]}
          width={width[6]}
          fill={color.text}
        />
      )}

      {text && (
        <Text
          style={[
            badgeProps.text,
            {
              color: color.text,
            },
            textStyles,
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {text}
        </Text>
      )}

      {iconRight}
    </View>
  );
};

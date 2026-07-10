import { borderRadius, borderWidth } from "@/design/borders";
import { height, width } from "@/design/distance";
import { center, xstack } from "@/design/layout";
import { body } from "@/design/typography";
import { useTheme } from "@/hooks/useTheme";
import FileIcon from "assets/icons/FileIcon";
import { Text, TouchableOpacity, View } from "react-native";
import ChevronDown from "./ChevronDown";
import { spacing } from "@/design/spacing";

interface MenuItemProps {
  label: string;
  labelColor: string;
  leftIcon: (isActive: boolean) => React.ReactElement;
  leftIconTheme: { background: string; text: string };
  hasRightIcon: boolean;
  rightIcon: React.ReactElement | null;
  onPress: () => void | Promise<void> | null;
}

export const MenuItem = ({
  label,
  labelColor,
  leftIcon,
  leftIconTheme,
  hasRightIcon = false,
  rightIcon = null,
  onPress = () => null,
}: MenuItemProps) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      style={[
        xstack,
        center,
        {
          width: "100%",
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.lg,
          gap: spacing.xs,
          borderColor: theme.border,
          borderRadius: borderRadius.lg,
          borderWidth: borderWidth.hw,
          backgroundColor: theme.header,
          boxShadow: theme.shadow.xs,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[
          xstack,
          center,
          {
            width: width[40],
            height: height[40],
            borderRadius: borderRadius.max,
            backgroundColor: theme.backgroundInverse,
          },
        ]}
      >
        {leftIcon(true)}
      </View>
      <Text
        style={[body.sm.regular, { color: labelColor, flexGrow: 1 }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
      {hasRightIcon &&
        (rightIcon ?? (
          <ChevronDown
            width={16}
            height={16}
            stroke={theme.text}
            strokeWidth={1}
            style={{ transform: [{ rotate: "-90deg" }] }}
          />
        ))}
    </TouchableOpacity>
  );
};

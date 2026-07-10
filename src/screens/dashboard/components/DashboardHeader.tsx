import { borderRadius } from "@/design/borders";
import { height, width } from "@/design/distance";
import {
  center,
  centerLeft,
  centerLeftY,
  fullWidth,
  grow,
  xstack,
  ystack,
} from "@/design/layout";
import { spacing } from "@/design/spacing";
import { body } from "@/design/typography";
import { useTheme } from "@/hooks/useTheme";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import UserOutline from "assets/icons/UserIcon";
import { Text, View } from "react-native";

export const DashboardHeader = ({
  navigation,
  route,
  options,
  back,
}: NativeStackHeaderProps) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        xstack,
        fullWidth,
        {
          backgroundColor: theme.header,
          paddingVertical: spacing.lg,
          paddingHorizontal: spacing.lg,
          boxShadow: theme.shadow.sm,
        },
      ]}
    >
      <View style={[xstack, grow, centerLeft, { gap: spacing.sm }]}>
        <View
          style={[
            xstack,
            center,
            {
              backgroundColor: theme.backgroundInverse,
              width: width[40],
              height: height[40],
              borderRadius: borderRadius.md,
            },
          ]}
        >
          <UserOutline
            width={width[16]}
            height={height[16]}
            strokeWidth={width[2]}
            stroke={theme.textInverse}
            fill={"none"}
          />
        </View>
        <View
          style={[
            ystack,
            centerLeftY,
            grow,
            {
              justifyContent: "space-between",
            },
          ]}
        >
          <Text style={[body.xl.semiBold, { color: theme.text }]}>Aditya</Text>
          <Text style={[body.sm.regular, { color: theme.text }]}>
            Sales Manager
          </Text>
        </View>
      </View>
      {/* <View style={[xstack, grow, center]}>
        <Text>hello</Text>
      </View> */}
    </View>
  );
};

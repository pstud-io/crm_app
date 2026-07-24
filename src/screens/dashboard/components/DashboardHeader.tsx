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
import { userNavigationRef } from "@/navigation/UserNavigation";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import UserOutline from "assets/icons/UserIcon";
import { Pressable, Text, View } from "react-native";
import { StackActions } from "@react-navigation/native";
import { NotificationBell } from "@/components";
import { useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
export const DashboardHeader = ({
  navigation,
  route,
  options,
  back,
}: NativeStackHeaderProps) => {
  const { theme } = useTheme();
  const isFocused = useIsFocused();
  const profile = useSelector((state: RootState) => state.profile);
  console.log("Profile in dashboard header", profile);
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
        <Pressable
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
          onPress={() => {
            userNavigationRef.dispatch(StackActions.push("Profile"));
          }}
        >
          <UserOutline
            width={width[16]}
            height={height[16]}
            strokeWidth={width[2]}
            stroke={theme.textInverse}
            fill={"none"}
          />
        </Pressable>
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
          <Text style={[body.xl.semiBold, { color: theme.text }]}>
            {profile.name}
          </Text>
          {/* <Text style={[body.sm.regular, { color: theme.text }]}>
            Sales Manager
          </Text> */}
        </View>
      </View>
      <Pressable
        onPress={() =>
          userNavigationRef.dispatch(StackActions.push("Notifications"))
        }
        style={{
          position: "relative",
          marginRight: 6,
        }}
      >
        {/* @ts-ignore */}
        <NotificationBell isFocused={isFocused} />
      </Pressable>
    </View>
  );
};

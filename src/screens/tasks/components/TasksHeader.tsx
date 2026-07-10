import { Button } from "@/components/Button";
import ChevronDown from "@/components/ChevronDown";
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
import FilterIcon from "assets/icons/FilterIcon";
import UserOutline from "assets/icons/UserIcon";
import { Pressable, Text, View } from "react-native";

export const TasksHeader = ({
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
      <Pressable
        style={[xstack, grow, centerLeft, { gap: spacing.sm }]}
        onPress={() => navigation.pop()}
      >
        <ChevronDown
          width={20}
          height={20}
          stroke={theme.text}
          strokeWidth={1.5}
          style={{ transform: [{ rotate: "90deg" }] }}
        />
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
          <Text style={[body.xl.semiBold, { color: theme.text }]}>Tasks</Text>
          {/* <Text style={[body.sm.regular, { color: theme.text }]}>
            Sales Manager
          </Text> */}
        </View>
      </Pressable>
      <Button
        label={null}
        loading={false}
        onPress={() => {}}
        style={{
          paddingHorizontal: 0,
          paddingVertical: 0,
          width: 32,
          height: 32,
          borderRadius: borderRadius.xs,
          boxShadow: theme.shadow.sm,
        }}
        themeInverse
        hasBorder={false}
        leftIcon={
          <FilterIcon
            width={20}
            height={20}
            stroke={theme.text}
            strokeWidth={2}
          />
        }
      />
      {/* <View style={[xstack, grow, center]}>
        <Text>hello</Text>
      </View> */}
    </View>
  );
};

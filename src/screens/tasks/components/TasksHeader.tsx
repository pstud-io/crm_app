import { Button } from "@/components/Button";
import ChevronDown from "@/components/ChevronDown";
import { SelectProject } from "@/components/SelectProject";
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
import { RootState } from "@/store/store";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import FilterIcon from "assets/icons/FilterIcon";
import UserOutline from "assets/icons/UserIcon";
import { ComponentRef, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useSelector } from "react-redux";
import { IDropdownRef } from "react-native-element-dropdown";
export const TasksHeader = ({
  navigation,
  route,
  options,
  back,
}: NativeStackHeaderProps) => {
  const selectedProject = useSelector((state: RootState) => state.project);
  console.log("Selected Project in tasks header", selectedProject);
  const dropdownRef = useRef<IDropdownRef>(null);
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
          <Text
            style={[body.lg.semiBold, { color: theme.text }]}
            onPress={dropdownRef.current?.open}
            suppressHighlighting
          >
            {selectedProject?.project_name || "Select Project"}
          </Text>
          <SelectProject dropdownRef={dropdownRef} />
          <Text style={[body.sm.regular, { color: theme.text }]}>
            Sales Manager
          </Text>
        </View>
      </View>
      {/* <Pressable
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
        </View>
      </Pressable> */}
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
    </View>
  );
};

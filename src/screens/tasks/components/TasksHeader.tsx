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
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import FilterIcon from "assets/icons/FilterIcon";
import UserOutline from "assets/icons/UserIcon";
import { useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { useSelector } from "react-redux";

export const TasksHeader = ({
  navigation,
  route,
  options,
  back,
}: NativeStackHeaderProps) => {
  const token = useSelector((state: any) => state.auth.token);
  const organization_id = useSelector(
    (state: any) => state.profile.organization_id,
  );
  console.log("these are the token", token);
  console.log("these are the organiztaion id", organization_id);
  const selectedProject = useSelector(
    (state: any) => state.project.selectedProject,
  );
  console.log("this is the selected poroject", selectedProject);
  const dropdownRef = useRef(null);
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
            style={[body.sm.regular, { color: theme.text }]}
            onPress={() => dropdownRef.current?.open()}
            suppressHighlighting
          >
            {selectedProject?.project_name || "Select Project"}
          </Text>
          <SelectProject
            getProjectsController={null}
            dropdownRef={dropdownRef}
          />
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
      {/* <View style={[xstack, grow, center]}>
        <Text>hello</Text>
      </View> */}
    </View>
  );
};

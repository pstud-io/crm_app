import { Button } from "@/components/Button";
import ChevronDown from "@/components/ChevronDown";
import { SelectProject } from "@/components/SelectProject";
import { borderRadius, borderWidth } from "@/design/borders";
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
import {
  NativeStackHeaderProps,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import FilterIcon from "assets/icons/FilterIcon";
import UserOutline from "assets/icons/UserIcon";
import {
  ComponentRef,
  Dispatch,
  SetStateAction,
  useRef,
  useState,
} from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useSelector } from "react-redux";
import { IDropdownRef } from "react-native-element-dropdown";
import { LeadsStackParamList } from "@/navigation/LeadsNavigation";
import { RouteProp } from "@react-navigation/native";
import {
  KanbanExtraParams,
  KanbanFilterParams,
} from "../hooks/useLeadsEndpoints";
import { primaryColors } from "@/design/colors";
export type LeadsHeaderProps = {
  navigation: NativeStackNavigationProp<LeadsStackParamList, "ListLeads">;
  route: RouteProp<LeadsStackParamList, "ListLeads">;
  title: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  kanbanFilters: KanbanExtraParams & KanbanFilterParams;
};

export const LeadsHeader = ({
  navigation,
  route,
  title,
  setOpen,
  kanbanFilters,
}: LeadsHeaderProps) => {
  const selectedProject = useSelector((state: RootState) => state.project);
  console.log("Selected Lead in tasks header", selectedProject);
  const dropdownRef = useRef<IDropdownRef>(null);
  const { theme } = useTheme();
  const getFilterCount = (filters: KanbanExtraParams & KanbanFilterParams) => {
    let count = 0;

    const simpleFields = [
      filters?.brand,
      filters?.project_type,
      filters?.lead_source,
      filters?.client,
      filters?.stage,
      filters?.assigned_to,
      filters?.start_date,
      filters?.end_date,
    ];

    count += simpleFields.filter(
      (value) => value !== null && value !== undefined && value !== "",
    ).length;

    // Count additional fields that actually have a search value
    count += filters?.additional_fields.filter(
      (_, index) =>
        filters.field_search[index] !== undefined &&
        filters.field_search[index] !== null &&
        filters.field_search[index] !== "",
    ).length;

    return count;
  };
  const filterCount = getFilterCount(kanbanFilters);
  console.log("kanbanFilters", kanbanFilters);
  console.log("filterCount", filterCount);
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
      {/* <View style={[xstack, grow, centerLeft, { gap: spacing.sm }]}>
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
            {selectedProject?.project_name || "Select Lead"}
          </Text>
          <SelectProject dropdownRef={dropdownRef} />
          <Text style={[body.sm.regular, { color: theme.text }]}>
            Sales Manager
          </Text>
        </View>
      </View> */}
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
          <Text style={[body.xl.semiBold, { color: theme.text }]}>{title}</Text>
        </View>
      </Pressable>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setOpen((prev) => !prev)}
        style={[
          {
            display: "flex",
            height: height[40],
            alignItems: "center",
            justifyContent: "center",
            borderRadius: borderRadius.xs,
            borderColor: theme.border,
            backgroundColor: "transparent",
            position: "relative",
            width: width[24],
          },
        ]}
      >
        {(filterCount ?? 0) > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{filterCount}</Text>
          </View>
        )}
        <FilterIcon
          width={width[20]}
          height={height[20]}
          stroke={theme.text}
          strokeWidth={2}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: 4,
    right: -2,
    backgroundColor: primaryColors.gray[900],
    minWidth: 16,
    height: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    paddingHorizontal: 2,
  },
  badgeText: {
    ...body.xxs.medium,
    color: primaryColors.gray[25],
    includeFontPadding: false,
  },
});

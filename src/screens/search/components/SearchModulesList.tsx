import {
  fullHeight,
  fullWidth,
  grow,
  topCenter,
  ystack,
} from "@/design/layout";
import { spacing } from "@/design/spacing";
import { Text } from "react-native";
import { ScrollView } from "react-native";
import { SearchModulesListItem } from "./SearchModulesListItem";
import { Dispatch, SetStateAction } from "react";
import { searchSubButtons, SubButtonId } from "../types/searchTypes";
import { body } from "@/design/typography";
import { useTheme } from "@/hooks/useTheme";

export const SearchModulesList = ({
  leads,
  tasks,
  notes,
  followups,
  setActiveSubButton,
  searchData,
}: {
  leads: any[];
  notes: any[];
  tasks: any[];
  followups: any[];
  setActiveSubButton: Dispatch<
    SetStateAction<SubButtonId<typeof searchSubButtons>>
  >;
  searchData: any[];
}) => {
  const { theme } = useTheme();
  if (searchData.length === 0) {
    return (
      <Text
        style={[
          body.sm.regular,
          {
            textAlign: "center",
            color: theme.textSecondary,
            paddingVertical: 44,
          },
        ]}
      >
        No Data Available
      </Text>
    );
  }

  return (
    <ScrollView
      style={[
        {
          gap: spacing.lg,
          flexGrow: 1,
        },
      ]}
      contentContainerStyle={[
        topCenter,
        {
          gap: spacing.xl,
          padding: spacing.lg,
          paddingBottom: spacing.ultra,
        },
      ]}
    >
      <SearchModulesListItem
        id={searchSubButtons[1].id}
        label="Leads"
        data={leads}
        setActiveSubButton={setActiveSubButton}
      />
      <SearchModulesListItem
        id={searchSubButtons[2].id}
        label="Tasks"
        data={tasks}
        setActiveSubButton={setActiveSubButton}
      />
      <SearchModulesListItem
        id={searchSubButtons[3].id}
        label="Notes"
        data={notes}
        setActiveSubButton={setActiveSubButton}
      />
      <SearchModulesListItem
        id={searchSubButtons[4].id}
        label="Followups"
        data={followups}
        setActiveSubButton={setActiveSubButton}
      />
    </ScrollView>
  );
};

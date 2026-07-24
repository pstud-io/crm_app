import {
  center,
  fullHeight,
  fullWidth,
  grow,
  xstack,
  ystack,
} from "@/design/layout";
import { body } from "@/design/typography";
import { useTheme } from "@/hooks/useTheme";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SearchModuleItem } from "./SearchModuleItem";
import { spacing } from "@/design/spacing";
import { SubTabBar } from "@/components/SubTabBar";
import {
  SearchSectionState,
  searchSubButtons,
  SubButtonId,
  UniversalSearchState,
} from "../types/searchTypes";
import { SearchModulesList } from "./SearchModulesList";

export const SearchModules = ({
  search,
  searchData,
  loading,
  refreshing,
  // onRefresh,
  onEndReached,
  activeSubButton,
  setActiveSubButton,
}: {
  search: string;
  searchData: UniversalSearchState | null;
  loading: boolean;
  refreshing: boolean;
  // onRefresh: () => Promise<void>;
  onEndReached: () => Promise<void>;
  activeSubButton: SubButtonId<typeof searchSubButtons>;
  setActiveSubButton: Dispatch<
    SetStateAction<SubButtonId<typeof searchSubButtons>>
  >;
}) => {
  const { theme } = useTheme();

  const [leads, setLeads] = useState<SearchSectionState | null>(null);
  const [tasks, setTasks] = useState<SearchSectionState | null>(null);
  const [notes, setNotes] = useState<SearchSectionState | null>(null);
  const [followups, setFollowups] = useState<SearchSectionState | null>(null);
  const [calls, setCalls] = useState<SearchSectionState | null>(null);

  console.log("Search data is", searchData);
  console.log("leads data is", leads);
  console.log("tasks data is", tasks);
  console.log("notes data is", notes);
  console.log("followup data is", followups);

  useEffect(() => {
    if (!searchData) return;
    setLeads(searchData.project_search);
    setTasks(searchData.tasks_search);
    setNotes(searchData.notes_search);
    setFollowups(searchData.followup_search);
    setCalls(searchData.call_history_search);
  }, [searchData]);

  // if (searchData?.length === 0) {
  //   return (
  //     <Text
  //       style={[
  //         fullWidth,
  //         body.sm.regular,
  //         { textAlign: "center", color: theme.textSecondary, padding: 16 },
  //       ]}
  //     >
  //       No data found
  //     </Text>
  //   );
  // }

  console.log("Search is", search);

  if (search === "") {
    return (
      <View style={[ystack, fullWidth, grow, { gap: 16, paddingTop: 44 }]}>
        <Text
          style={[
            fullWidth,
            body.sm.regular,
            { textAlign: "center", color: theme.textSecondary },
          ]}
        >
          Type to start searching
        </Text>
      </View>
    );
  }

  return (
    <>
      {activeSubButton === "all" && (
        <SearchModulesList
          leads={leads}
          tasks={tasks}
          notes={notes}
          followups={followups}
          calls={calls}
          setActiveSubButton={setActiveSubButton}
          searchData={searchData}
        />
      )}
      {activeSubButton === "leads" && (
        <SearchModuleItem
          data={leads}
          onEndReached={onEndReached}
          // onRefresh={onRefresh}
          loading={loading}
          refreshing={refreshing}
          type="lead"
        />
      )}
      {activeSubButton === "tasks" && (
        <SearchModuleItem
          data={tasks}
          onEndReached={onEndReached}
          // onRefresh={onRefresh}
          loading={loading}
          refreshing={refreshing}
          type="task"
        />
      )}
      {activeSubButton === "notes" && (
        <SearchModuleItem
          data={notes}
          onEndReached={onEndReached}
          // onRefresh={onRefresh}
          loading={loading}
          refreshing={refreshing}
          type="note"
        />
      )}
      {activeSubButton === "followups" && (
        <SearchModuleItem
          data={followups}
          onEndReached={onEndReached}
          // onRefresh={onRefresh}
          loading={loading}
          refreshing={refreshing}
          type="followup"
        />
      )}
    </>
  );
};

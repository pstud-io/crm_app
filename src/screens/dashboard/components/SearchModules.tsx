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

export const SearchModules = ({
  search,
  searchData,
  loading,
  refreshing,
  onRefresh,
  onEndReached,
}: {
  search: string;
  searchData: any[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => Promise<void>;
  onEndReached: () => Promise<void>;
}) => {
  const { theme } = useTheme();
  const [leads, setLeads] = useState<any>([]);
  const [tasks, setTasks] = useState<any>([]);
  const [notes, setNotes] = useState<any>([]);
  const [followups, setFollowups] = useState<any>([]);
  console.log("Search data is", searchData);
  console.log("leads data is", leads);
  console.log("tasks data is", tasks);
  console.log("notes data is", notes);
  console.log("followup data is", followups);

  useEffect(() => {
    console.log("In useeffect of search data");
    const tempLeads: any[] = [];
    const tempTasks: any[] = [];
    const tempNotes: any[] = [];
    const tempFollowups: any[] = [];

    for (const item of searchData) {
      switch (item.type) {
        case "project_search":
          tempLeads.push(item);
          break;
        case "tasks_search":
          tempTasks.push(item);
          break;
        case "notes_search":
          tempNotes.push(item);
          break;
        case "followups_search":
          tempFollowups.push(item);
          break;
      }
    }

    setLeads(tempLeads);
    setTasks(tempTasks);
    setNotes(tempNotes);
    setFollowups(tempFollowups);
  }, [searchData]);

  if (search === "") {
    return (
      <View style={[ystack, fullWidth, grow, { gap: 16, paddingTop: 16 }]}>
        <Text
          style={[
            fullWidth,
            body.xs.regular,
            { textAlign: "center", color: theme.textSecondary },
          ]}
        >
          Type to start searching
        </Text>
      </View>
    );
  }

  if (loading && searchData?.length === 0) {
    return (
      <View style={[xstack, center, fullWidth, { padding: 16 }]}>
        <ActivityIndicator size={12} />
      </View>
    );
  }

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

  return (
    <View
      style={[
        ystack,
        fullWidth,
        grow,
        { gap: 16, paddingVertical: spacing.huge },
      ]}
    >
      {leads.length > 0 && (
        <SearchModuleItem
          label="Leads"
          data={leads}
          onEndReached={onEndReached}
          onRefresh={onRefresh}
          loading={loading}
          refreshing={refreshing}
          type="lead"
        />
      )}
      {tasks.length > 0 && (
        <SearchModuleItem
          label="Tasks"
          data={tasks}
          onEndReached={onEndReached}
          onRefresh={onRefresh}
          loading={loading}
          refreshing={refreshing}
          type="task"
        />
      )}
      {notes.length > 0 && (
        <SearchModuleItem
          label="Notes"
          data={notes}
          onEndReached={onEndReached}
          onRefresh={onRefresh}
          loading={loading}
          refreshing={refreshing}
          type="note"
        />
      )}
      {followups.length > 0 && (
        <SearchModuleItem
          label="Follow Ups"
          data={followups}
          onEndReached={onEndReached}
          onRefresh={onRefresh}
          loading={loading}
          refreshing={refreshing}
          type="followup"
        />
      )}
    </View>
  );
};

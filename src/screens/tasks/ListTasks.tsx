import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { useTaskEndpoints } from "./hooks/useTaskEndpoints";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useTheme } from "@/hooks/useTheme";
import { RenderTaskItem } from "./components/RenderTaskItem";
import LoadingIndicatorFooter from "@/components/LoadingIndicatorFooter";
import { ItemSeparator } from "@/components/ItemSeperator";

const SW = (x) => {
  return x;
};

const SH = (x) => {
  return x;
};

const SF = (x) => {
  return x;
};

export const ListTasks = ({ navigation }) => {
  const { theme } = useTheme();
  const [tasksData, setTasksData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { getTasks, tasksLoading } = useTaskEndpoints();
  const [completedTasks, setCompletedTasks] = useState([]);
  const [createdTasks, setCreatedTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [onHoldTasks, setOnHoldTasks] = useState([]);
  const [discardedTasks, setDiscardedTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const selectedProject = useSelector((state: any) => state.project);

  useFocusEffect(
    useCallback(() => {
      const fetchTasks = async () => {
        console.log("In fetch tasks");
        await getTasks(
          1,
          "",
          hasMore,
          tasksData,
          setTasksData,
          setCompletedTasks,
          setCreatedTasks,
          setInProgressTasks,
          setOnHoldTasks,
          setDiscardedTasks,
        );
      };
      fetchTasks();
    }, [selectedProject]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await getTasks(
      1,
      searchTerm,
      hasMore,
      tasksData,
      setTasksData,
      setCompletedTasks,
      setCreatedTasks,
      setInProgressTasks,
      setOnHoldTasks,
      setDiscardedTasks,
    );
    setRefreshing(false);
  };

  if (tasksLoading.getTasks && page === 1) {
    return <ActivityIndicator />;
  }

  return (
    <FlatList
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => await onRefresh()}
          tintColor={theme.backgroundInverse}
          colors={[theme.backgroundInverse]}
          progressBackgroundColor={theme.header}
        />
      }
      data={tasksData}
      keyExtractor={(item, index) => item.id}
      renderItem={({ item }) => (
        <RenderTaskItem
          task={item}
          navigation={navigation}
          onRefresh={onRefresh}
          hasActionButtons={true}
        />
      )}
      contentContainerStyle={{
        // paddingBottom: SH(80),
        maxWidth: "100%",
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 40,
      }}
      onEndReached={async () => {
        if (!tasksLoading.getTasks && hasMore) {
          setPage(page + 1);
          await getTasks(
            page + 1,
            searchTerm,
            hasMore,
            tasksData,
            setTasksData,
            setCompletedTasks,
            setCreatedTasks,
            setInProgressTasks,
            setOnHoldTasks,
            setDiscardedTasks,
          );
        }
      }}
      // onEndReachedThreshold={0.8}
      ListFooterComponent={() => {
        if (tasksLoading.getTasks) {
          return <LoadingIndicatorFooter width={"100%"} size={10} />;
        }
        return null;
      }}
      ItemSeparatorComponent={() => (
        <ItemSeparator direction="horizontal" opacity={0} />
      )}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={<Text>No Tasks</Text>}
    />
  );
};

import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import {
  TasksExtraParams,
  useNewTaskEndpoints,
} from "./hooks/useNewTaskEndpoints";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RenderTaskItem } from "./components/RenderTaskItem";
import { UserNavigationProp } from "@/navigation/UserNavigation";
import { ListWrapper } from "@/components/ListWrapper";
import { CustomLegendList } from "@/components/CustomLegendList";
import { usePaginatedSearch } from "@/hooks/usePaginatedSearch";
import { RootState } from "@/store/store";
import { SubButtonId, subButtons, Task } from "./types/taskTypes";
import { ActivityIndicatorWrapper } from "@/components/ActivityIndicatorWrapper";
import SectionHeader from "@/components/ModuleListHeader";
import { SubTabChip } from "@/components/SubTabChip";
import { spacing } from "@/design/spacing";
import { height } from "@/design/distance";
import Spacing from "@/components/Spacing";
import { ItemSeparator } from "@/components/ItemSeperator";
import { SubTabBar } from "@/components/SubTabBar";
import { ModuleSearchInput } from "@/components/ModuleSearchInput";
import {
  completedFilterMethods,
  completedSortMethods,
  createdFilterMethods,
  createdSortMethods,
  discardedFilterMethods,
  discardedSortMethods,
  initialCompletedFilterState,
  initialCompletedSortState,
  initialCreatedFilterState,
  initialCreatedSortState,
  initialDiscardedFilterState,
  initialDiscardedSortState,
  initialInProgressFilterState,
  initialInProgressSortState,
  initialOnHoldFilterState,
  initialOnHoldSortState,
  inProgressFilterMethods,
  inProgressSortMethods,
  onHoldFilterMethods,
  onHoldSortMethods,
} from "./utils/tasksGeneralData";
import {
  filterCompletedTasks,
  filterCreatedTasks,
  filterDiscardedTasks,
  filterInProgressTasks,
  filterOnHoldTasks,
} from "./utils/tasksFilterFunctions";
import { returnTasksCount } from "./utils/taskFunctions";
import {
  FilterSortPopover,
  FilterState,
  SortState,
} from "@/components/FilterSortPopover";
import { fullWidth, xstack } from "@/design/layout";
// import { Badge } from "@/components/UI/Badge/Badge";
import { Badge } from "../../components/UI/Badge/Badge";
import badgeColors from "@/components/UI/Badge/badgeColors";
import { FilterChip } from "@/components/FilterChip";
import { OverdueCustomRangeFilterPopover } from "./components/OverdueCustomRangeFilterPopover";
import { setActiveSubButtonGlobal } from "@/store/slices/activeSubButtonGlobal";
import { TaskHistoryBottomSheet } from "./components/TaskHistoryBottomSheet";

export const ListTasks = ({ route }: { route: any }) => {
  const { task_type } = route.params;
  console.log("Task type in list taks", task_type);
  const dispatch = useDispatch();
  const navigation = useNavigation<UserNavigationProp>();
  const [tasksData, setTasksData] = useState<Task[]>([]);
  const { getTasks, tasksLoading } = useNewTaskEndpoints();
  const [activeSubButton, setActiveSubButton] =
    useState<SubButtonId>("created");

  const selectedProject = useSelector((state: RootState) => state.project);
  const profile = useSelector((state: RootState) => state.profile);
  const organization_contact_id = profile.organization_contact_id;

  const [completedTasks, setCompletedTasks] = useState([]);
  const [createdTasks, setCreatedTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [onHoldTasks, setOnHoldTasks] = useState([]);
  const [discardedTasks, setDiscardedTasks] = useState([]);

  const modalRef = useRef(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [showOverdueTasks, setShowOverdueTasks] = useState<boolean>(false);
  const [showSelfCreatedTasks, setShowSelfCreatedTasks] =
    useState<boolean>(false);
  const [showAssignedToMeTasks, setShowAssignedToMeTasks] =
    useState<boolean>(false);
  const [overdueFromDate, setOverdueFromDate] = useState(null);
  const [overdueToDate, setOverdueToDate] = useState(null);
  const [overdueOption, setOverdueOption] = useState<"all" | "custom" | null>(
    null,
  );

  const [filteredCreatedTasks, setFilteredCreatedTasks] =
    useState(createdTasks);

  const [createdFilterState, setCreatedFilterState] = useState<FilterState>({
    ...initialCreatedFilterState,
  });
  const [createdSortState, setCreatedSortState] = useState<SortState>(
    initialCreatedSortState,
  );

  const [filteredInProgressTasks, setFilteredInProgressTasks] =
    useState(inProgressTasks);

  const [inProgressFilterState, setInProgressFilterState] =
    useState<FilterState>({
      ...initialInProgressFilterState,
    });
  const [inProgressSortState, setInProgressSortState] = useState<SortState>(
    initialInProgressSortState,
  );

  const [filteredOnHoldTasks, setFilteredOnHoldTasks] = useState(onHoldTasks);

  const [onHoldFilterState, setOnHoldFilterState] = useState<FilterState>({
    ...initialOnHoldFilterState,
  });
  const [onHoldSortState, setOnHoldSortState] = useState<SortState>(
    initialOnHoldSortState,
  );

  const [filteredCompletedTasks, setFilteredCompletedTasks] =
    useState(completedTasks);

  const [completedFilterState, setCompletedFilterState] = useState<FilterState>(
    {
      ...initialCompletedFilterState,
    },
  );
  const [completedSortState, setCompletedSortState] = useState<SortState>(
    initialCompletedSortState,
  );

  const [filteredDiscardedTasks, setFilteredDiscardedTasks] =
    useState(discardedTasks);

  const [discardedFilterState, setDiscardedFilterState] = useState<FilterState>(
    {
      ...initialDiscardedFilterState,
    },
  );
  const [discardedSortState, setDiscardedSortState] = useState<SortState>(
    initialDiscardedSortState,
  );

  useEffect(() => {
    if (overdueFromDate !== null || overdueToDate !== null) {
      setOverdueFromDate(null);
      setOverdueToDate(null);
    }
    if (!showOverdueTasks) {
      if (overdueOption !== null) setOverdueOption(null);
    }
    if (showOverdueTasks) {
      setOverdueOption("all");
    }
  }, [showOverdueTasks]);

  useEffect(() => {
    filterCreatedTasks(
      createdTasks,
      createdFilterState,
      createdSortState,
      setFilteredCreatedTasks,
      showOverdueTasks,
      showAssignedToMeTasks,
      showSelfCreatedTasks,
      organization_contact_id,
      overdueOption,
      overdueFromDate,
      overdueToDate,
    );
  }, [
    createdFilterState,
    createdTasks,
    createdSortState,
    showOverdueTasks,
    showAssignedToMeTasks,
    showSelfCreatedTasks,
    overdueOption,
    overdueFromDate,
    overdueToDate,
  ]);

  useEffect(() => {
    filterInProgressTasks(
      inProgressTasks,
      inProgressFilterState,
      inProgressSortState,
      setFilteredInProgressTasks,
      showOverdueTasks,
      showAssignedToMeTasks,
      showSelfCreatedTasks,
      organization_contact_id,
      overdueOption,
      overdueFromDate,
      overdueToDate,
    );
  }, [
    inProgressFilterState,
    inProgressSortState,
    inProgressTasks,
    showOverdueTasks,
    showAssignedToMeTasks,
    showSelfCreatedTasks,
    overdueOption,
    overdueFromDate,
    overdueToDate,
  ]);

  useEffect(() => {
    filterOnHoldTasks(
      onHoldTasks,
      onHoldFilterState,
      onHoldSortState,
      setFilteredOnHoldTasks,
      showOverdueTasks,
      showAssignedToMeTasks,
      showSelfCreatedTasks,
      organization_contact_id,
      overdueOption,
      overdueFromDate,
      overdueToDate,
    );
  }, [
    onHoldFilterState,
    onHoldTasks,
    onHoldSortState,
    showOverdueTasks,
    showAssignedToMeTasks,
    showSelfCreatedTasks,
    overdueOption,
    overdueFromDate,
    overdueToDate,
  ]);

  useEffect(() => {
    filterCompletedTasks(
      completedTasks,
      completedFilterState,
      completedSortState,
      setFilteredCompletedTasks,
      showOverdueTasks,
      showAssignedToMeTasks,
      showSelfCreatedTasks,
      organization_contact_id,
      overdueOption,
      overdueFromDate,
      overdueToDate,
    );
  }, [
    completedFilterState,
    completedSortState,
    completedTasks,
    showOverdueTasks,
    showAssignedToMeTasks,
    showSelfCreatedTasks,
    overdueOption,
    overdueFromDate,
    overdueToDate,
  ]);

  useEffect(() => {
    filterDiscardedTasks(
      discardedTasks,
      discardedFilterState,
      discardedSortState,
      setFilteredDiscardedTasks,
      showOverdueTasks,
      showAssignedToMeTasks,
      showSelfCreatedTasks,
      organization_contact_id,
      overdueOption,
      overdueFromDate,
      overdueToDate,
    );
  }, [
    discardedFilterState,
    discardedSortState,
    discardedTasks,
    showOverdueTasks,
    showAssignedToMeTasks,
    showSelfCreatedTasks,
    overdueOption,
    overdueFromDate,
    overdueToDate,
  ]);

  const tasksSearch = usePaginatedSearch<Task, TasksExtraParams>({
    data: tasksData,
    setData: setTasksData,
    getData: getTasks,
    loading: tasksLoading.getTasks,
    pageSize: 5,
    extraParams: {
      setCompletedTasks,
      setCreatedTasks,
      setInProgressTasks,
      setOnHoldTasks,
      setDiscardedTasks,
      project: selectedProject,
      task_type: task_type,
    },
  });

  useFocusEffect(
    useCallback(() => {
      const fetchTasks = async () => {
        console.log("In fetch tasks");
        await tasksSearch.onFocus();
      };
      fetchTasks();
    }, [selectedProject]),
  );

  const setButton = task_type === "followup" ? "followups" : "tasks";

  useFocusEffect(
    useCallback(() => {
      dispatch(setActiveSubButtonGlobal(setButton));
    }, []),
  );

  const returnTasksCount = (title: string) => {
    const count =
      title === "Created"
        ? filteredCreatedTasks.length
        : title === "In Progress"
          ? filteredInProgressTasks.length
          : title === "Hold"
            ? filteredOnHoldTasks.length
            : title === "Completed"
              ? filteredCompletedTasks.length
              : title === "Discarded"
                ? filteredDiscardedTasks.length
                : 0;
    return ` (${count})`;
  };

  return (
    <>
      <ListWrapper>
        <SectionHeader
          title={task_type === "followup" ? "Follow Ups" : "Task"}
          count={tasksData.length}
        />
        <Spacing space={height[16]} />
        <SubTabBar
          data={subButtons}
          activeTab={activeSubButton}
          onTabPress={setActiveSubButton}
          extraTitle={returnTasksCount}
        />
        <View
          style={[
            xstack,
            fullWidth,
            {
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: spacing.lg,
              paddingTop: spacing.lg,
              paddingHorizontal: spacing.lg,
            },
          ]}
        >
          <ModuleSearchInput
            placeholder="Quick Search"
            value={tasksSearch.searchTerm}
            onChangeText={async (text: string) => tasksSearch.onSearch(text)}
          />
          {activeSubButton === "created" && (
            <FilterSortPopover
              id={"created-tasks"}
              title={"Created Tasks Filter"}
              filterMethods={
                task_type === "followup"
                  ? [createdFilterMethods[0]]
                  : createdFilterMethods
              }
              filterState={createdFilterState}
              setFilterState={setCreatedFilterState}
              initialFilterState={initialCreatedFilterState}
              sortMethods={createdSortMethods}
              sortState={createdSortState}
              setSortState={setCreatedSortState}
              initialSortState={initialCreatedSortState}
            />
          )}
          {activeSubButton === "in_progress" && (
            <FilterSortPopover
              id={"in-progress-tasks"}
              title={"In Progress Tasks Filter"}
              filterMethods={
                task_type === "followup"
                  ? [inProgressFilterMethods[0]]
                  : inProgressFilterMethods
              }
              filterState={inProgressFilterState}
              setFilterState={setInProgressFilterState}
              initialFilterState={initialInProgressFilterState}
              sortMethods={inProgressSortMethods}
              sortState={inProgressSortState}
              setSortState={setInProgressSortState}
              initialSortState={initialInProgressSortState}
            />
          )}
          {activeSubButton === "hold" && (
            <FilterSortPopover
              id={"hold-tasks"}
              title={"Hold Tasks Filter"}
              filterMethods={
                task_type === "followup"
                  ? [onHoldFilterMethods[0]]
                  : onHoldFilterMethods
              }
              filterState={onHoldFilterState}
              setFilterState={setOnHoldFilterState}
              initialFilterState={initialOnHoldFilterState}
              sortMethods={onHoldSortMethods}
              sortState={onHoldSortState}
              setSortState={setOnHoldSortState}
              initialSortState={initialOnHoldSortState}
            />
          )}

          {activeSubButton === "completed" && (
            <FilterSortPopover
              id={"completed-tasks"}
              title={"Completed Tasks Filter"}
              filterMethods={
                task_type === "followup"
                  ? [completedFilterMethods[0]]
                  : completedFilterMethods
              }
              filterState={completedFilterState}
              setFilterState={setCompletedFilterState}
              initialFilterState={initialCompletedFilterState}
              sortMethods={completedSortMethods}
              sortState={completedSortState}
              setSortState={setCompletedSortState}
              initialSortState={initialCompletedSortState}
            />
          )}
          {activeSubButton === "discarded" && (
            <FilterSortPopover
              id={"discarded-tasks"}
              title={"Discarded Tasks Filter"}
              filterMethods={
                task_type === "followup"
                  ? [discardedFilterMethods[0]]
                  : discardedFilterMethods
              }
              filterState={discardedFilterState}
              setFilterState={setDiscardedFilterState}
              initialFilterState={initialDiscardedFilterState}
              sortMethods={discardedSortMethods}
              sortState={discardedSortState}
              setSortState={setDiscardedSortState}
              initialSortState={initialDiscardedSortState}
            />
          )}
        </View>
        <Spacing space={height[16]} />
        <View
          style={[
            xstack,
            fullWidth,
            {
              justifyContent: "flex-start",
              alignItems: "center",
              paddingHorizontal: spacing.md,
              height: height[24],
              gap: spacing.xxs,
            },
          ]}
        >
          <FilterChip
            setFilter={setShowOverdueTasks}
            filter={showOverdueTasks}
            label={"Overdue"}
          />
          <FilterChip
            setFilter={setShowSelfCreatedTasks}
            filter={showSelfCreatedTasks}
            label={"Created by me"}
          />
          <FilterChip
            setFilter={setShowAssignedToMeTasks}
            filter={showAssignedToMeTasks}
            label={"Assigned to me"}
          />
        </View>
        {showOverdueTasks && (
          <>
            <Spacing space={8} />
            <View
              style={[
                xstack,
                fullWidth,
                {
                  justifyContent: "flex-start",
                  alignItems: "center",
                  paddingHorizontal: spacing.md,
                  height: height[24],
                  gap: spacing.xxs,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  setOverdueOption("all");
                  setOverdueFromDate(null);
                  setOverdueToDate(null);
                }}
              >
                <Badge
                  size={"md"}
                  color={
                    overdueOption === "all"
                      ? badgeColors.blueGray
                      : badgeColors.outline
                  }
                  border={overdueOption === "all" ? true : false}
                  text={"All Overdue Tasks"}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setVisible(true)}>
                <Badge
                  size={"md"}
                  color={
                    overdueOption === "custom"
                      ? badgeColors.blueGray
                      : badgeColors.blueGray
                  }
                  border={overdueOption === "custom" ? true : false}
                  text={"Custom Range"}
                />
              </TouchableOpacity>
            </View>
          </>
        )}
        {tasksLoading.getTasks && tasksSearch.page === 1 ? (
          <ActivityIndicatorWrapper>
            <ActivityIndicator />
          </ActivityIndicatorWrapper>
        ) : (
          <CustomLegendList<Task>
            data={
              activeSubButton === "created"
                ? filteredCreatedTasks
                : activeSubButton === "in_progress"
                  ? filteredInProgressTasks
                  : activeSubButton === "hold"
                    ? filteredOnHoldTasks
                    : activeSubButton === "completed"
                      ? filteredCompletedTasks
                      : activeSubButton === "discarded"
                        ? filteredDiscardedTasks
                        : []
            }
            keyExtractor={(item) => item.id as string}
            renderItem={({ item }) => (
              <RenderTaskItem
                task={item}
                navigation={navigation}
                onRefresh={tasksSearch.onRefresh}
                hasActionButtons
              />
            )}
            loading={tasksLoading.getTasks}
            refreshing={tasksSearch.refreshing}
            onRefresh={tasksSearch.onRefresh}
            onEndReached={tasksSearch.onEndReached}
          />
        )}
      </ListWrapper>
      <OverdueCustomRangeFilterPopover
        overdueFromDate={overdueFromDate}
        setOverdueFromDate={setOverdueFromDate}
        setOverdueToDate={setOverdueToDate}
        overdueToDate={overdueToDate}
        overdueOption={overdueOption}
        setOverdueOption={setOverdueOption}
        setVisible={setVisible}
        visible={visible}
        modalRef={modalRef}
      />
      <TaskHistoryBottomSheet />
    </>
  );
};

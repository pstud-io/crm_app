import { Text, View } from "react-native";
import {
  kanbanExtraParams,
  KanbanExtraParams,
  useLeadsEndpoints,
} from "./hooks/useLeadsEndpoints";
import { usePaginatedSearch } from "@/hooks/usePaginatedSearch";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setActiveSubButtonGlobal } from "@/store/slices/activeSubButtonGlobal";
import { ListWrapper } from "@/components/ListWrapper";
import SectionHeader from "@/components/ModuleListHeader";
import { ActivityIndicatorWrapper } from "@/components/ActivityIndicatorWrapper";
import { ActivityIndicator } from "react-native";
import { CustomKanbanList } from "./components/CustomKanbanList";
import { SCREEN_WIDTH } from "@/utils";
import { borderRadius } from "@/design/borders";
import { RenderKanbanItem } from "./components/RenderKanbanItem";
import AddProject from "@/components/common/AddProject/AddProject";
import { fullWidth, xstack } from "@/design/layout";
import { spacing } from "@/design/spacing";
import { ModuleSearchInput } from "@/components/ModuleSearchInput";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LeadsStackParamList } from "@/navigation/LeadsNavigation";
import { openAddProjectBottomSheet } from "../dashboard/utils/addProjectBottomSheetService";

type Props = NativeStackScreenProps<LeadsStackParamList, "ListLeads">;

export const ListLeads = ({ route, navigation }: Props) => {
  const autoOpenAddLead = route.params?.autoOpenAddLead;
  const { kanbanLoading, getKanban } = useLeadsEndpoints();
  const [kanbanData, setKanbanData] = useState<any>([]);
  const [uniSearch, setUniSearch] = useState<string>("");
  const [kanbanFilters, setKanbanFilters] =
    useState<KanbanExtraParams>(kanbanExtraParams);
  const [initialLoad, setInitialLoad] = useState<boolean | undefined>(
    undefined,
  );
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  console.log("Kanban Data", kanbanData);
  const dispatch = useDispatch();
  const kanbanSearch = usePaginatedSearch<any, KanbanExtraParams>({
    data: kanbanData,
    setData: setKanbanData,
    getData: getKanban,
    loading: kanbanLoading.getKanban,
    pageSize: 6,
    extraParams: kanbanFilters,
  });

  useFocusEffect(
    useCallback(() => {
      const fetchKanban = async () => {
        setInitialLoad(true);
        console.log("Changed initial load");
        await kanbanSearch.onFocus();
        setInitialLoad(false);
      };
      fetchKanban();

      return () => {
        setInitialLoad(undefined);
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
          debounceRef.current = null;
        }
      };
    }, []),
  );

  useEffect(() => {
    if (initialLoad === undefined) return;
    kanbanSearch.onRefresh();
  }, [kanbanFilters]);

  useLayoutEffect(() => {
    if (autoOpenAddLead) {
      openAddProjectBottomSheet();
    }
  }, [autoOpenAddLead]);

  useFocusEffect(
    useCallback(() => {
      dispatch(setActiveSubButtonGlobal("leads"));
    }, []),
  );

  return (
    <>
      <ListWrapper>
        {/* <SectionHeader title={"Leads"} count={kanbanData.length} /> */}
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
            value={uniSearch}
            onChangeText={(text: string) => {
              setUniSearch(text);

              if (debounceRef.current) {
                clearTimeout(debounceRef.current);
              }

              debounceRef.current = setTimeout(() => {
                setKanbanFilters((prev) => ({
                  ...prev,
                  search: text,
                }));
              }, 500);
            }}
          />
        </View>
        {kanbanLoading.getKanban && kanbanSearch.page === 1 ? (
          <ActivityIndicatorWrapper>
            <ActivityIndicator />
          </ActivityIndicatorWrapper>
        ) : (
          <CustomKanbanList<any>
            data={kanbanData}
            keyExtractor={(item) => String(item.substage_id)}
            renderItem={({ item, index }) => {
              console.log("This is the item", item.substage_id, index);
              return <RenderKanbanItem item={item} uniSearch={uniSearch} />;
            }}
            loading={kanbanLoading.getKanban}
            refreshing={kanbanSearch.refreshing}
            onRefresh={kanbanSearch.onRefresh}
            onEndReached={
              initialLoad === undefined
                ? null
                : initialLoad === true
                  ? null
                  : kanbanSearch.onEndReached
            }
          />
        )}
      </ListWrapper>
      <AddProject />
    </>
  );
};

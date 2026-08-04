import { Text, TouchableOpacity, View } from "react-native";
import {
  kanbanExtraParams,
  KanbanExtraParams,
  KanbanFilterParams,
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
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setActiveSubButtonGlobal } from "@/store/slices/activeSubButtonGlobal";
import { ListWrapper } from "@/components/ListWrapper";
import SectionHeader from "@/components/ModuleListHeader";
import { ActivityIndicatorWrapper } from "@/components/ActivityIndicatorWrapper";
import { ActivityIndicator } from "react-native";
import { CustomKanbanList } from "./components/CustomKanbanList";
import { SCREEN_WIDTH } from "@/utils";
import { borderRadius, borderWidth } from "@/design/borders";
import { RenderKanbanItem } from "./components/RenderKanbanItem";
import AddProject from "@/components/common/AddProject/AddProject";
import { fullHeight, fullWidth, grow, xstack } from "@/design/layout";
import { spacing } from "@/design/spacing";
import { ModuleSearchInput } from "@/components/ModuleSearchInput";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LeadsStackParamList } from "@/navigation/LeadsNavigation";
import { openAddProjectBottomSheet } from "../dashboard/utils/addProjectBottomSheetService";
import { Drawer } from "react-native-drawer-layout";
import FilterIcon from "assets/icons/FilterIcon";
import { height, width } from "@/design/distance";
import { useTheme } from "@/hooks/useTheme";
import { setIsSheetOpen } from "@/store/slices/isSheetOpenSlice";
import { LeadsHeader } from "./components/LeadsHeader";
import { ListFilters } from "./components/ListFilters";
import { useAddProjectEndpoints } from "@/components/common/AddProject/hooks/useAddProjectEndpoints";
import useKeyboardStatus from "@/hooks/useKeyboardStatus";
import { useKeyboard } from "@react-native-community/hooks";
type Props = NativeStackScreenProps<LeadsStackParamList, "ListLeads">;

export const ListLeads = ({ route, navigation }: Props) => {
  const autoOpenAddLead = route.params?.autoOpenAddLead;
  const isFocused = useIsFocused();
  const { theme } = useTheme();
  const { kanbanLoading, getKanban } = useLeadsEndpoints();
  const [open, setOpen] = useState<boolean>(false);
  const [kanbanData, setKanbanData] = useState<any>([]);
  const [uniSearch, setUniSearch] = useState<string>("");

  const [kanbanFilters, setKanbanFilters] = useState<
    KanbanExtraParams & KanbanFilterParams
  >(kanbanExtraParams);
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
        setUniSearch("");
        setKanbanFilters(kanbanExtraParams);
        // setInitialLoad(undefined);
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
    <ListWrapper style={{ paddingTop: 0 }}>
      <Drawer
        open={open}
        onOpen={async () => {
          console.log("Hi");
        }}
        swipeEnabled={false}
        onClose={() => {
          if (!open) return;
          setTimeout(() => {
            console.log("Set to false from drawer");
            dispatch(setIsSheetOpen(false));
            setOpen(false);
          }, 400);
        }}
        drawerPosition="right"
        drawerStyle={{ width: SCREEN_WIDTH * 0.75 }}
        drawerType="slide"
        renderDrawerContent={() => {
          return isFocused ? (
            <ListFilters
              open={open}
              kanbanFilters={kanbanFilters}
              setKanbanFilters={setKanbanFilters}
              setOpen={setOpen}
            />
          ) : (
            <></>
          );
        }}
      >
        <LeadsHeader
          title="Leads"
          setOpen={() => {
            dispatch(setIsSheetOpen(true));
            setTimeout(() => {
              setOpen(true);
            }, 0);
          }}
          navigation={navigation}
          route={route}
          kanbanFilters={kanbanFilters}
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
              return (
                <RenderKanbanItem
                  item={item}
                  uniSearch={uniSearch}
                  kanbanFilters={kanbanFilters}
                />
              );
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
      </Drawer>
      <AddProject onRefresh={kanbanSearch.onRefresh} />
    </ListWrapper>
  );
};

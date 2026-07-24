import { Text, View } from "react-native";
import {
  kanbanExtraParams,
  KanbanExtraParams,
  useLeadsEndpoints,
} from "./hooks/useLeadsEndpoints";
import { usePaginatedSearch } from "@/hooks/usePaginatedSearch";
import { useCallback, useEffect, useState } from "react";
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

export const ListLeads = () => {
  const { kanbanLoading, getKanban } = useLeadsEndpoints();
  const [kanbanData, setKanbanData] = useState<any>([]);
  const [initialLoad, setInitialLoad] = useState<boolean | undefined>(
    undefined,
  );
  console.log("Kanban Data", kanbanData);
  const dispatch = useDispatch();
  const kanbanSearch = usePaginatedSearch<any, KanbanExtraParams>({
    data: kanbanData,
    setData: setKanbanData,
    getData: getKanban,
    loading: kanbanLoading.getKanban,
    pageSize: 6,
    extraParams: kanbanExtraParams,
  });

  useFocusEffect(
    useCallback(() => {
      const fetchKanban = async () => {
        setInitialLoad(true);
        await kanbanSearch.onFocus();
        setInitialLoad(false);
      };
      fetchKanban();

      return () => {
        setInitialLoad(undefined);
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(setActiveSubButtonGlobal("leads"));
    }, []),
  );

  return (
    <>
      <ListWrapper>
        {/* <SectionHeader title={"Leads"} count={kanbanData.length} /> */}
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
              return <RenderKanbanItem item={item} />;
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

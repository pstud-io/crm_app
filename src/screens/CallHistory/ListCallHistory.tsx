import { usePaginatedSearch } from "@/hooks/usePaginatedSearch";
import { CallHistoryStackParamList } from "@/navigation/CallHistoryNavigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { CompositeScreenProps, useFocusEffect } from "@react-navigation/native";
import { setActiveSubButtonGlobal } from "@/store/slices/activeSubButtonGlobal";
import { ListWrapper } from "@/components/ListWrapper";
import { center, fullHeight, fullWidth, xstack } from "@/design/layout";
import { useCallHistoryEndpoints } from "./hooks/useCallHistoryEndpoints";
import { CallHistoryExtraParams } from "./utils/callHistoryEndpoints";
import { RootState } from "@/store/store";
import SectionHeader from "@/components/ModuleListHeader";
import { spacing } from "@/design/spacing";
import { ModuleSearchInput } from "@/components/ModuleSearchInput";
import { ActivityIndicatorWrapper } from "@/components/ActivityIndicatorWrapper";
import { CustomLegendList } from "@/components/CustomLegendList";
import { RenderCallHistoryItem } from "./components/RenderCallHistoryItem";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { LeadDetailsTabParamList } from "@/navigation/LeadsTopTabNavigation";

type Props =
  | NativeStackScreenProps<CallHistoryStackParamList, "ListCallHistory">
  | MaterialTopTabScreenProps<LeadDetailsTabParamList, "Call History">;

export const ListCallHistory = ({ route, navigation }: Props) => {
  const project_id = route.params.project_id;
  const project = useSelector((state: RootState) => state.project);
  const projectID = project_id ? project_id : project.id;
  const { callHistoryLoading, getCallHistory } = useCallHistoryEndpoints();
  const [callHistoryData, setCallHistorydata] = useState<any>([]);
  const [initialLoad, setInitialLoad] = useState<boolean | undefined>(
    undefined,
  );
  console.log("call history Data", callHistoryData);
  const dispatch = useDispatch();
  const callHistorySearch = usePaginatedSearch<any, CallHistoryExtraParams>({
    data: callHistoryData,
    setData: setCallHistorydata,
    getData: getCallHistory,
    loading: callHistoryLoading.getCallHistory,
    pageSize: 10,
    extraParams: {
      project_id: projectID!,
      task_id: "",
    } satisfies CallHistoryExtraParams,
  });

  useFocusEffect(
    useCallback(() => {
      const fetchCallHistory = async () => {
        setInitialLoad(true);
        console.log("Changed initial load");
        await callHistorySearch.onFocus();
        setInitialLoad(false);
      };
      fetchCallHistory();

      return () => {
        setInitialLoad(undefined);
      };
    }, [projectID]),
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(setActiveSubButtonGlobal("calls"));
    }, []),
  );
  return (
    <ListWrapper>
      <SectionHeader
        title={"Call History"}
        count={callHistoryData?.length ?? 0}
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
          value={callHistorySearch.searchTerm}
          onChangeText={(text: string) => callHistorySearch.onSearch(text)}
        />
      </View>
      {callHistoryLoading.getCallHistory && callHistorySearch.page === 1 ? (
        <ActivityIndicatorWrapper>
          <ActivityIndicator />
        </ActivityIndicatorWrapper>
      ) : (
        <CustomLegendList<any>
          data={callHistoryData}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item, index }) => {
            return <RenderCallHistoryItem callHistory={item} />;
          }}
          loading={callHistoryLoading.getCallHistory}
          refreshing={callHistoryLoading.getCallHistory}
          onRefresh={callHistorySearch.onRefresh}
          onEndReached={
            initialLoad === undefined
              ? null
              : initialLoad === true
                ? null
                : callHistorySearch.onEndReached
          }
        />
      )}
    </ListWrapper>
  );
};

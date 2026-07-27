import { ActivityIndicatorWrapper } from "@/components/ActivityIndicatorWrapper";
import { CustomLegendList } from "@/components/CustomLegendList";
import { spacing } from "@/design/spacing";
import { usePaginatedSearch } from "@/hooks/usePaginatedSearch";
import { RenderCallHistoryItem } from "@/screens/CallHistory/components/RenderCallHistoryItem";
import { useCallHistoryEndpoints } from "@/screens/CallHistory/hooks/useCallHistoryEndpoints";
import { CallHistoryExtraParams } from "@/screens/CallHistory/utils/callHistoryEndpoints";
import { callHistoryRefreshRef } from "@/screens/CallHistory/utils/callHistoryFunctions";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export const TaskCallHistory = ({
  task_id,
  project_id,
}: {
  task_id: string;
  project_id: string;
}) => {
  const { callHistoryLoading, getCallHistory } = useCallHistoryEndpoints();
  const [callHistoryData, setCallHistorydata] = useState<any>([]);
  const [initialLoad, setInitialLoad] = useState<boolean | undefined>(
    undefined,
  );
  console.log("call history Data", callHistoryData);
  const callHistorySearch = usePaginatedSearch<any, CallHistoryExtraParams>({
    data: callHistoryData,
    setData: setCallHistorydata,
    getData: getCallHistory,
    loading: callHistoryLoading.getCallHistory,
    pageSize: 10,
    extraParams: {
      project_id: project_id,
      task_id: task_id,
    } satisfies CallHistoryExtraParams,
  });
  callHistoryRefreshRef.current = { onRefresh: callHistorySearch.onRefresh };
  useEffect(() => {
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
  }, []);

  return (
    <>
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
          contentContainerStyle={{
            paddingHorizontal: 0,
            paddingTop: 0,
          }}
          scrollEnabled={false}
        />
      )}
    </>
  );
};

import { ListWrapper } from "@/components/ListWrapper";
import { fullHeight, fullWidth } from "@/design/layout";
import { useTheme } from "@/hooks/useTheme";
import { LeadsStackParamList } from "@/navigation/LeadsNavigation";
import { LeadDetailsTabParamList } from "@/navigation/LeadsTopTabNavigation";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { ActivityIndicator, Text, View } from "react-native";
import {
  TimelineExtraParams,
  useLeadsEndpoints,
} from "./hooks/useLeadsEndpoints";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { usePaginatedSearch } from "@/hooks/usePaginatedSearch";
import { useFocusEffect } from "@react-navigation/native";
import { setActiveSubButtonGlobal } from "@/store/slices/activeSubButtonGlobal";
import { ActivityIndicatorWrapper } from "@/components/ActivityIndicatorWrapper";
import { CustomLegendList } from "@/components/CustomLegendList";
import { RenderTimelineItem } from "./components/RenderTimelineItem";
import { spacing } from "@/design/spacing";
import { borderRadius, borderWidth } from "@/design/borders";
type Props = MaterialTopTabScreenProps<LeadDetailsTabParamList, "Timeline">;

export const LeadTimeline = ({ route, navigation }: Props) => {
  const { theme } = useTheme();
  const { leadsLoading, getTimeline } = useLeadsEndpoints();
  const [timelineData, setTimelineData] = useState<any>([]);
  const { project } = route.params;
  console.log("Project in timeline", project);
  const [initialLoad, setInitialLoad] = useState<boolean | undefined>(
    undefined,
  );
  console.log("Timeline Data", timelineData);
  const dispatch = useDispatch();
  const timelineSearch = usePaginatedSearch<any, TimelineExtraParams>({
    data: timelineData,
    setData: setTimelineData,
    getData: getTimeline,
    loading: leadsLoading.getTimeline,
    pageSize: 25,
    extraParams: {
      project_id: project,
    },
  });

  useFocusEffect(
    useCallback(() => {
      const fetchTimeline = async () => {
        setInitialLoad(true);
        console.log("Changed initial load");
        await timelineSearch.onFocus();
        setInitialLoad(false);
      };
      fetchTimeline();

      return () => {};
    }, [project]),
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(setActiveSubButtonGlobal("timeline"));
    }, []),
  );
  return (
    <ListWrapper style={{ padding: spacing.lg }}>
      <></>
      {leadsLoading.getTimeline && timelineSearch.page === 1 ? (
        <ActivityIndicatorWrapper>
          <ActivityIndicator />
        </ActivityIndicatorWrapper>
      ) : (
        <CustomLegendList<any>
          data={timelineData}
          keyExtractor={(item) => item.date}
          renderItem={({ item, index }) => {
            const isLast = index === timelineData.length - 1;
            return (
              <RenderTimelineItem
                index={index}
                timeline={item}
                isLast={isLast}
              />
            );
          }}
          loading={leadsLoading.getTimeline}
          refreshing={leadsLoading.getTimeline}
          onRefresh={timelineSearch.onRefresh}
          onEndReached={
            initialLoad === undefined
              ? null
              : initialLoad === true
                ? null
                : timelineSearch.onEndReached
          }
          style={{
            backgroundColor: theme.header,
            paddingBottom: 0,
            borderRadius: borderRadius.xl,
            borderWidth: borderWidth.hw,
            borderColor: theme.border,
            shadowColor: theme.shadow.xxl,
          }}
          contentContainerStyle={{
            paddingBottom: 0,
            paddingTop: 18,
          }}
        />
      )}
    </ListWrapper>
  );
};

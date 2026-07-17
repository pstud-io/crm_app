import { borderRadius, borderWidth } from "@/design/borders";
import { primaryColors } from "@/design/colors";
import { center, fullWidth, xstack, ystack } from "@/design/layout";
import { spacing } from "@/design/spacing";
import { useTheme } from "@/hooks/useTheme";
import { SCREEN_WIDTH } from "@/utils";
import { ActivityIndicator, Text, View } from "react-native";
import { KanbanHeader } from "./KanbanHeader";
import {
  leadsExtraParams,
  LeadsExtraParams,
  useLeadsEndpoints,
} from "../hooks/useLeadsEndpoints";
import { useEffect, useState } from "react";
import { usePaginatedSearch } from "@/hooks/usePaginatedSearch";
import { ActivityIndicatorWrapper } from "@/components/ActivityIndicatorWrapper";
import { CustomLegendList } from "@/components/CustomLegendList";
import { RenderLeadItem } from "./RenderLeadItem";

export const RenderKanbanItem = ({ item }: { item: any }) => {
  const { theme } = useTheme();
  const { leadsLoading, getLeads } = useLeadsEndpoints();
  console.log("item in render item", item);
  const [leadsData, setLeadsData] = useState<any>([...item.projects]);
  const [initialLoad, setInitialLoad] = useState<boolean>(false);
  const leadsSearch = usePaginatedSearch<any, LeadsExtraParams>({
    data: leadsData,
    setData: setLeadsData,
    getData: getLeads,
    loading: leadsLoading.getLeads,
    pageSize: 6,
    extraParams: { ...leadsExtraParams, substage_id: item.substage_id },
    initialPage: 2,
  });

  useEffect(() => {
    const fetchKanban = async () => {
      setInitialLoad(true);
      await leadsSearch.onFocus();
      setInitialLoad(false);
    };
    fetchKanban();
  }, []);

  return (
    <View
      style={[
        ystack,
        {
          width: SCREEN_WIDTH * 0.75,
          borderRadius: borderRadius.lg,
          borderTopColor: theme.backgroundInverse,
          borderTopWidth: borderWidth.thick,
          borderColor: theme.border,
          borderWidth: borderWidth.hw,
          boxShadow: theme.shadow.sm,
          backgroundColor: theme.header,
          overflow: "hidden",
          height: "100%",
        },
      ]}
    >
      <KanbanHeader title={item.substage_name} count={item.total_count} />
      {leadsLoading.getLeads && leadsSearch.page === 1 ? (
        <ActivityIndicatorWrapper>
          <ActivityIndicator />
        </ActivityIndicatorWrapper>
      ) : (
        <CustomLegendList<any>
          data={leadsData}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) => (
            <RenderLeadItem item={item} index={index} />
          )}
          loading={leadsLoading.getLeads}
          refreshing={leadsSearch.refreshing}
          onRefresh={leadsSearch.onRefresh}
          onEndReached={initialLoad ? null : leadsSearch.onEndReached}
        />
      )}
    </View>
  );
};

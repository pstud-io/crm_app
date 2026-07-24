import { CustomHorizontalList } from "@/components/CustomHorizontalList";
import { CustomLegendList } from "@/components/CustomLegendList";
import { borderRadius, borderWidth } from "@/design/borders";
import { fullWidth, xstack, ystack } from "@/design/layout";
import { body } from "@/design/typography";
import { useTheme } from "@/hooks/useTheme";
import { Text, View } from "react-native";
import { RenderSearchItem } from "./RenderSearchItem";
import { spacing } from "@/design/spacing";
import { SearchSectionState } from "../types/searchTypes";

export const SearchModuleItem = ({
  data,
  loading,
  refreshing,
  // onRefresh,
  onEndReached,
  type,
}: {
  data: SearchSectionState | null;
  loading: boolean;
  refreshing: boolean;
  // onRefresh: () => Promise<void>;
  onEndReached: () => Promise<void>;
  type: string;
}) => {
  return (
    <CustomLegendList<any>
      data={data?.data}
      keyExtractor={(item) => item.id as string}
      renderItem={({ item }) => <RenderSearchItem item={item} type={type} />}
      loading={loading}
      refreshing={refreshing}
      onRefresh={() => {}}
      // onRefresh={onRefresh}
      onEndReached={data?.hasNext ? onEndReached : null}
      contentContainerStyle={{ paddingBottom: spacing.extreme }}
      keyboardDismissMode="on-drag"
    />
  );
};

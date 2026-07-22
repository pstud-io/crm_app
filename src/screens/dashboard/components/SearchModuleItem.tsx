import { CustomHorizontalList } from "@/components/CustomHorizontalList";
import { CustomLegendList } from "@/components/CustomLegendList";
import { borderRadius, borderWidth } from "@/design/borders";
import { fullWidth, xstack, ystack } from "@/design/layout";
import { body } from "@/design/typography";
import { useTheme } from "@/hooks/useTheme";
import { Text, View } from "react-native";
import { RenderSearchItem } from "./RenderSearchItem";

export const SearchModuleItem = ({
  label = "hello",
  data,
  loading,
  refreshing,
  onRefresh,
  onEndReached,
  type,
}: {
  label: string;
  data: any[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => Promise<void>;
  onEndReached: () => Promise<void>;
  type: string;
}) => {
  const { theme } = useTheme();
  return (
    <View style={[ystack, fullWidth]}>
      <Text
        style={[
          body.sm.regular,
          {
            color: theme.text,
            paddingHorizontal: 16,
          },
        ]}
      >
        {label}
      </Text>
      <CustomHorizontalList<any>
        data={data}
        horizontal
        keyExtractor={(item) => item.id as string}
        renderItem={({ item }) => <RenderSearchItem item={item} type={type} />}
        loading={loading}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={onEndReached}
      />
    </View>
  );
};

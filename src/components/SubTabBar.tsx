import { FlatList } from "react-native";
import { spacing } from "@/design/spacing";
import { SubTabChip } from "@/components/SubTabChip";
import { height } from "@/design/distance";
import { ItemSeparator } from "./ItemSeperator";
import {
  SubButtonId,
  SubButtonTitle,
} from "@/screens/search/types/searchTypes";

interface SubTabBarProps<T extends readonly { id: string; title: string }[]> {
  data: T;
  activeTab: SubButtonId<T>;
  onTabPress: (id: SubButtonId<T>) => void;
  extraTitle?: (title: SubButtonTitle<T>) => string | void;
}

export function SubTabBar<T extends readonly { id: string; title: string }[]>({
  data,
  activeTab,
  onTabPress,
  extraTitle = () => {},
}: SubTabBarProps<T>) {
  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      style={{ maxHeight: height[44], minHeight: height[44] }}
      contentContainerStyle={{
        paddingHorizontal: spacing.lg,
      }}
      ItemSeparatorComponent={() => (
        <ItemSeparator
          direction="vertical"
          opacity={0}
          style={{ marginHorizontal: 4 }}
        />
      )}
      renderItem={({ item, index }) => (
        <SubTabChip
          type={item.id === activeTab ? "default" : "outlined"}
          title={item.title + extraTitle(item.title)}
          index={index}
          onPress={() => onTabPress(item.id)}
        />
      )}
    />
  );
}

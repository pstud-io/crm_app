import { FlatList } from "react-native";
import { spacing } from "@/design/spacing";
import { SubTabChip } from "@/components/SubTabChip";
import { height } from "@/design/distance";
import { SubButton, SubButtonId } from "@/screens/tasks/types/taskTypes";
import { ItemSeparator } from "./ItemSeperator";

interface SubTabBarProps {
  data: readonly SubButton[];
  activeTab: SubButtonId;
  onTabPress: (id: SubButtonId) => void;
  extraTitle: (title: string) => string | void;
}

export const SubTabBar = ({
  data,
  activeTab,
  onTabPress,
  extraTitle = () => {},
}: SubTabBarProps) => {
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
};

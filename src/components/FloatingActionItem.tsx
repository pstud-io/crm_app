import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { primaryColors } from "@/design/colors";
import { body } from "@/design/typography";
export const RenderFloatingActionItem = ({ item }: { item: any }) => {
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        justifyContent: "space-between",
        paddingHorizontal: 16,
        alignSelf: "flex-start",
        paddingVertical: 16,
        width: "100%",
        flexGrow: 1,
        height: 60,
      }}
      onPress={async () => {
        // setLoading(true);
        await item.onPress();
        // setLoading(false);
      }}
    >
      {loading ? <ActivityIndicator size={14} color={theme.text} /> : item.icon}
      <Text
        style={{
          ...body.sm.medium,
          color: theme.text,
          flexGrow: 1,
        }}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );
};

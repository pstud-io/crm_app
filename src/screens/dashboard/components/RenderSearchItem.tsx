import { borderRadius, borderWidth } from "@/design/borders";
import { ystack } from "@/design/layout";
import { useTheme } from "@/hooks/useTheme";
import { RenderLeadItem } from "@/screens/Leads/components/RenderLeadItem";
import { Text, View } from "react-native";
import { RenderLeadSearchItem } from "./RenderLeadSearchItem";
import { RenderTaskSearchItem } from "./RenderTaskSearchItem";
import { RenderNoteSearchItem } from "./RenderNoteSearchItem";

export const RenderSearchItem = ({
  item,
  type,
}: {
  item: any;
  type: string;
}) => {
  const { theme } = useTheme();
  if (type === "task") {
    return <RenderTaskSearchItem item={item} />;
  }
  if (type === "lead") {
    return <RenderLeadSearchItem item={item} />;
  }
  if (type === "note") {
    return <RenderNoteSearchItem item={item} />;
  }
  return (
    <View
      style={[
        ystack,
        {
          boxShadow: theme.shadow.sm,
          padding: 16,
          borderRadius: borderRadius.lg,
          borderWidth: borderWidth.hw,
          borderColor: theme.border,
        },
      ]}
    >
      <Text>Hi from item</Text>
    </View>
  );
};

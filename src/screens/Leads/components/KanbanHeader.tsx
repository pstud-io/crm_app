import { Badge } from "@/components/UI/Badge/Badge";
import badgeColors from "@/components/UI/Badge/badgeColors";
import { borderWidth } from "@/design/borders";
import { xstack } from "@/design/layout";
import { spacing } from "@/design/spacing";
import { body } from "@/design/typography";
import { useTheme } from "@/hooks/useTheme";
import { Text, View } from "react-native";

export const KanbanHeader = ({
  title,
  count,
}: {
  title: string;
  count: number;
}) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        xstack,
        {
          justifyContent: "space-between",
          alignItems: "center",
          padding: spacing.lg,
          gap: spacing.lg,
          borderBottomWidth: borderWidth.hw,
          borderBottomColor: theme.border,
          boxShadow: theme.shadow.xxs,
        },
      ]}
    >
      <Text
        style={[body.sm.semiBold, { color: theme.text, flexShrink: 1 }]}
        numberOfLines={1}
        ellipsizeMode="middle"
      >
        {title}
      </Text>
      <Badge
        color={badgeColors.gray}
        text={`${count?.toString() ?? 0}`}
        size="lg"
      />
    </View>
  );
};

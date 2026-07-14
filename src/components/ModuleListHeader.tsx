import { spacing } from "@/design/spacing";
import { body } from "@/design/typography";
import { useTheme } from "@/hooks/useTheme";
import { View, Text } from "react-native";
import { Badge } from "./UI/Badge/Badge";
import badgeColors from "./UI/Badge/badgeColors";
import { alignCenter, spaceBetween, xstack } from "@/design/layout";

interface SectionHeaderProps {
  title: string;
  count: number;
}

export default function SectionHeader({ title, count }: SectionHeaderProps) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        xstack,
        alignCenter,
        spaceBetween,
        {
          paddingHorizontal: spacing.lg,
          paddingVertical: 0,
        },
      ]}
    >
      <View
        style={[
          alignCenter,
          xstack,
          {
            gap: spacing.xs,
          },
        ]}
      >
        <Text
          style={[
            body.lg.semiBold,
            {
              color: theme.text,
            },
          ]}
        >
          {title}
        </Text>
        <Badge
          color={badgeColors.gray}
          text={`${count.toString()}`}
          size="lg"
        />
      </View>
    </View>
  );
}

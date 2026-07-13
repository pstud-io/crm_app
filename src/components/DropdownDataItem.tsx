import { View, Text, StyleSheet } from "react-native";
import { primaryColors, secondaryColors } from "@/design/colors";
import { body } from "@/design/typography";
import Radio from "assets/icons/Radio";
import { useTheme } from "@/hooks/useTheme";

export const DropdownDataItem = ({
  itemName,
  isSelected,
}: {
  itemName: string;
  isSelected: boolean | undefined;
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 8,
        flex: 1,
        height: 44,
        gap: 8,
      }}
    >
      <Radio
        width={16}
        height={16}
        strokeWidth={1}
        stroke={theme.border}
        selected={isSelected}
      />
      <Text
        style={{
          ...body.md.regular,
          color: theme.text,
          flex: 1,
        }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {itemName}
      </Text>
    </View>
  );
};

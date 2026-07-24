import { ItemSeparator } from "@/components/ItemSeperator";
import { Badge } from "@/components/UI/Badge/Badge";
import badgeColors from "@/components/UI/Badge/badgeColors";
import { borderRadius, borderWidth } from "@/design/borders";
import { primaryColors } from "@/design/colors";
import { center, fullWidth, grow, xstack, ystack } from "@/design/layout";
import { spacing } from "@/design/spacing";
import { body } from "@/design/typography";
import { useTheme } from "@/hooks/useTheme";
import { UserNavigationProp } from "@/navigation/UserNavigation";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CallWhatsappPopover from "@/components/specific/CallWhatsappPopover";
export const RenderFollowupSearchItem = ({ item }: { item: any }) => {
  const { theme } = useTheme();
  const navigation = useNavigation<UserNavigationProp>();
  return (
    <Pressable
      style={[
        ystack,
        fullWidth,
        {
          padding: spacing.md,
          borderRadius: borderRadius.lg,
          backgroundColor: theme.header,
          borderColor: theme.border,
          boxShadow: theme.shadow.sm,
          marginBottom: spacing.sm,
          // maxWidth: 240,
        },
      ]}
      key={item.id}
      onPress={() =>
        navigation.push("Tasks", {
          screen: "TaskDetails",
          params: {
            task: item,
          } as any,
        })
      }
    >
      <View
        style={[
          xstack,
          {
            justifyContent: "space-between",
            alignItems: "center",
            gap: spacing.lg,
          },
        ]}
      >
        <Text
          style={[body.sm.semiBold, { color: theme.text, flexShrink: 1 }]}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {item.title}
        </Text>
        <Badge color={badgeColors.gray} text={item.project_name} size="sm" />
      </View>
      <ItemSeparator
        direction="horizontal"
        opacity={1}
        style={{ marginVertical: spacing.md, borderTopWidth: borderWidth.xs }}
      />
      <View
        style={[xstack, fullWidth, center, { justifyContent: "space-between" }]}
      >
        <View
          style={[
            ystack,
            {
              flexGrow: 1,
              maxWidth: "48%",
              minWidth: "48%",
              gap: spacing.tiny,
            },
          ]}
        >
          <Text
            style={[body.xs.regular, { color: theme.text, flexShrink: 1 }]}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            Client
          </Text>
          <Text
            style={[body.sm.semiBold, { color: theme.text, flexShrink: 1 }]}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {item?.client_name}
          </Text>
        </View>

        <View
          style={[
            ystack,
            {
              flexGrow: 1,
              maxWidth: "48%",
              minWidth: "48%",
              gap: spacing.tiny,
            },
          ]}
        >
          <Text
            style={[body.xs.regular, { color: theme.text, flexShrink: 1 }]}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            Contact
          </Text>
          <CallWhatsappPopover
            value={item?.client_phone}
            code={""}
            fromInfo={false}
          />
          {/* <Text
            style={[body.sm.semiBold, { color: theme.text, flexShrink: 1 }]}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {item?.client_details?.phone}
          </Text> */}
        </View>
      </View>
    </Pressable>
  );
};

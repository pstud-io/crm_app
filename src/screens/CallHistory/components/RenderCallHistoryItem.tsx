import { borderRadius, borderWidth } from "@/design/borders";
import { spacing } from "@/design/spacing";
import { body } from "@/design/typography";
import { useTheme } from "@/hooks/useTheme";
import { formatDate, formatDuration } from "@/utils";
import { Text, View } from "react-native";

export const RenderCallHistoryItem = ({
  callHistory,
}: {
  callHistory: any;
}) => {
  const { theme } = useTheme();
  return (
    <View
      style={{
        width: "100%",
        backgroundColor: theme.header,
        borderWidth: borderWidth.hw,
        borderColor: theme.border,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        gap: spacing.sm,
        boxShadow: theme.shadow.sm,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={[
            body.sm.medium,
            {
              color: theme.textSecondary,
            },
          ]}
        >
          Client
        </Text>
        <Text
          style={[
            body.sm.semiBold,
            {
              color: theme.text,
              flexShrink: 1,
              textAlign: "right",
            },
          ]}
        >
          {callHistory.client_details.name || "-"}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={[
            body.sm.medium,
            {
              color: theme.textSecondary,
            },
          ]}
        >
          Contaced On
        </Text>
        <Text
          style={[
            body.sm.medium,
            {
              color: theme.primary,
            },
          ]}
        >
          {callHistory.contacted_on
            ? formatDate(callHistory.contacted_on)
            : formatDate(callHistory.created_on)}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={[
            body.sm.medium,
            {
              color: theme.textSecondary,
            },
          ]}
        >
          Call Duration
        </Text>
        <Text
          style={[
            body.sm.medium,
            {
              color: theme.primary,
            },
          ]}
        >
          {formatDuration(callHistory.duration)}
        </Text>
      </View>

      <View
        style={{
          height: borderWidth.hw,
          backgroundColor: theme.border,
          marginVertical: spacing.xxs,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={[
            body.sm.medium,
            {
              color: theme.textSecondary,
            },
          ]}
        >
          Lead
        </Text>
        <Text
          style={[
            body.sm.medium,
            {
              color: theme.text,
              flex: 1,
              textAlign: "right",
              marginLeft: spacing.md,
            },
          ]}
        >
          {callHistory.project_name || "-"}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={[
            body.sm.medium,
            {
              color: theme.textSecondary,
            },
          ]}
        >
          Follow Up
        </Text>
        <Text
          style={[
            body.sm.medium,
            {
              color: theme.text,
              flex: 1,
              textAlign: "right",
              marginLeft: spacing.md,
            },
          ]}
        >
          {callHistory?.task_details?.title || "-"}
        </Text>
      </View>
    </View>
  );
};

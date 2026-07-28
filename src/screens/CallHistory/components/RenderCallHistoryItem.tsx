import CallWhatsappPopover from "@/components/specific/CallWhatsappPopover";
import { borderRadius, borderWidth } from "@/design/borders";
import { fullWidth, xstack } from "@/design/layout";
import { spacing } from "@/design/spacing";
import { body } from "@/design/typography";
import { useTheme } from "@/hooks/useTheme";
import { RootState } from "@/store/store";
import { formatDate, formatDuration } from "@/utils";
import { useState } from "react";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";

export const RenderCallHistoryItem = ({
  callHistory,
}: {
  callHistory: any;
}) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const project = useSelector((state: RootState) => state.project);
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
        style={[
          xstack,
          fullWidth,
          {
            justifyContent: "space-between",
          },
        ]}
      >
        <Text
          style={[
            body.sm.regular,
            { color: theme.textSecondary, flexShrink: 1 },
          ]}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          Phone
        </Text>
        <CallWhatsappPopover
          value={callHistory.client_details.phone || "-"}
          code={""}
          fromInfo={false}
          project_id={callHistory?.fk_project}
          project_name={callHistory?.project_name || ""}
          client_name={callHistory?.client_details?.name}
          task_id={callHistory?.task_details?.id || ""}
          task_name={callHistory?.task_details?.title || ""}
        />
      </View>

      <View
        style={{
          height: borderWidth.hw,
          backgroundColor: theme.border,
          marginVertical: spacing.tiny,
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

      {/* {project.id === "all_projects" && (
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
      )} */}

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
      {callHistory?.context_value === null ||
      callHistory?.context_value === "" ? (
        <></>
      ) : (
        <>
          <View
            style={{
              width: "100%",
              borderBottomWidth: 1,
              borderBottomColor: "#F2F2F2",
            }}
          />
          <View style={{ gap: 4, width: "100%" }}>
            <Text
              style={{
                ...body.sm.medium,
                color: theme.textSecondary,
              }}
            >
              Description
            </Text>

            <Text
              style={{
                ...body.sm.semiBold,
                color: theme.text,
              }}
              numberOfLines={expanded ? undefined : 2}
              ellipsizeMode="tail"
              onPress={() => {
                setExpanded(!expanded);
              }}
              suppressHighlighting
            >
              {callHistory?.context_value}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

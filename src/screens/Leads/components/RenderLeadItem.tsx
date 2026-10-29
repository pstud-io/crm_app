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
import { useDispatch, useSelector } from "react-redux";
import { setActiveLead } from "@/store/slices/activeLeadGlobal";
import { VisibleFieldsState } from "@/store/slices/visibleFields";
import { formatDate, formatDateWithoutTime } from "@/utils";
export const RenderLeadItem = ({
  item,
  index,
  preferences,
  fieldsToggle,
}: {
  item: any;
  index: number;
  preferences: string[];
  fieldsToggle: VisibleFieldsState;
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation<UserNavigationProp>();
  const dispatch = useDispatch();

  const displayFields = preferences
    .map((id) => {
      const field = fieldsToggle[id];
      if (!field) return null;

      let value: any = "";

      if (field.type === "standard") {
        value =
          field.name === "Assignee"
            ? item?.additional_fields?.[id][0]?.name
            : (item?.additional_fields?.[id] ?? "");
      } else {
        value =
          item?.all_custom_fields?.find(
            (customField: any) => customField.id === id,
          )?.value ?? "";
      }

      return {
        name: field.name,
        value:
          value == null || value === ""
            ? "NA"
            : field.name === "Created On"
              ? formatDateWithoutTime(value)
              : String(value),
      };
    })
    .filter((field) => field !== null);

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
        },
      ]}
      key={index}
      onPress={() => {
        dispatch(
          setActiveLead({ id: item.id, project_name: item.project_name }),
        );
        navigation.push("Leads", {
          screen: "LeadDetails",
          params: {
            screen: "Info",
            params: {
              project: { id: item.id, project_name: item.project_name },
            },
          },
        } as any);
      }}
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
          {item.project_name}
        </Text>
        <Badge color={badgeColors.gray} text={item.project_code} size="sm" />
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
            {item?.client_details?.name}
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
            value={item?.client_details?.phone}
            code={""}
            fromInfo={false}
            project_id={item?.id}
            project_name={item?.project_name}
            client_name={item?.client_details?.name}
            task_id={""}
            task_name={""}
          />
        </View>
      </View>
      {displayFields && displayFields.length > 0 && (
        <>
          <ItemSeparator
            direction="horizontal"
            opacity={1}
            style={{
              marginVertical: spacing.md,
              borderTopWidth: borderWidth.xs,
            }}
          />
          <View
            style={[
              xstack,
              fullWidth,
              center,
              { justifyContent: "space-between" },
            ]}
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
                {displayFields[0]?.name}
              </Text>
              <Text
                style={[body.sm.semiBold, { color: theme.text, flexShrink: 1 }]}
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                {displayFields[0]?.value}
              </Text>
            </View>

            {displayFields.length > 1 && (
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
                  style={[
                    body.xs.regular,
                    { color: theme.text, flexShrink: 1 },
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  {displayFields[1]?.name}
                </Text>
                <Text
                  style={[
                    body.sm.semiBold,
                    { color: theme.text, flexShrink: 1 },
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  {displayFields[1]?.value}
                </Text>
              </View>
            )}
          </View>
          {displayFields.length > 2 && (
            <>
              <ItemSeparator
                direction="horizontal"
                opacity={1}
                style={{
                  marginVertical: spacing.md,
                  borderTopWidth: borderWidth.xs,
                }}
              />
              <View
                style={[
                  xstack,
                  fullWidth,
                  center,
                  { justifyContent: "space-between" },
                ]}
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
                    style={[
                      body.xs.regular,
                      { color: theme.text, flexShrink: 1 },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="middle"
                  >
                    {displayFields[2]?.name}
                  </Text>
                  <Text
                    style={[
                      body.sm.semiBold,
                      { color: theme.text, flexShrink: 1 },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="middle"
                  >
                    {displayFields[2]?.value}
                  </Text>
                </View>

                {displayFields.length > 3 && (
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
                      style={[
                        body.xs.regular,
                        { color: theme.text, flexShrink: 1 },
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {displayFields[3]?.name}
                    </Text>
                    <Text
                      style={[
                        body.sm.semiBold,
                        { color: theme.text, flexShrink: 1 },
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {displayFields[3]?.value}
                    </Text>
                  </View>
                )}
              </View>
            </>
          )}
        </>
      )}
    </Pressable>
  );
};

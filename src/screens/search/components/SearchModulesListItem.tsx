import { ItemSeparator } from "@/components/ItemSeperator";
import CallWhatsappPopover from "@/components/specific/CallWhatsappPopover";
import { ItemSeparatorComponent } from "@/components/UI/GeneralComponents/ItemSeperatorComponent";
import { borderRadius, borderWidth } from "@/design/borders";
import { fullWidth, xstack, ystack } from "@/design/layout";
import { spacing } from "@/design/spacing";
import { body } from "@/design/typography";
import { useTheme } from "@/hooks/useTheme";
import { Dispatch, SetStateAction } from "react";
import { Text, View } from "react-native";
import { searchSubButtons, SubButtonId } from "../types/searchTypes";
import { primaryColors } from "@/design/colors";

export const SearchModulesListItem = ({
  id,
  label,
  data,
  setActiveSubButton,
}: {
  id: SubButtonId<typeof searchSubButtons>;
  label: string;
  data: any[];
  setActiveSubButton: Dispatch<
    SetStateAction<SubButtonId<typeof searchSubButtons>>
  >;
}) => {
  if (data.length === 0) return;
  const { theme } = useTheme();
  return (
    <View style={[ystack, fullWidth, { gap: spacing.md }]} key={id}>
      <View
        style={[
          xstack,
          fullWidth,
          {
            justifyContent: "space-between",
            paddingHorizontal: spacing.xs,
          },
        ]}
      >
        <Text
          style={[
            body.sm.medium,
            {
              color: theme.text,
            },
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
            body.xs.regular,
            {
              color: primaryColors.brand[600],
            },
          ]}
          onPress={() => setActiveSubButton(id)}
          suppressHighlighting
        >
          View all
        </Text>
      </View>
      <View
        style={[
          ystack,
          fullWidth,
          {
            backgroundColor: theme.header,
            padding: 16,
            borderWidth: borderWidth.hw,
            borderRadius: borderRadius.lg,
            boxShadow: theme.shadow.sm,
            borderColor: theme.border,
          },
        ]}
      >
        {data.slice(0, 3).map((item, index) => {
          return (
            <View key={item.id}>
              {index !== 0 && (
                <ItemSeparatorComponent
                  direction="horizontal"
                  style={{
                    marginVertical: spacing.md,
                  }}
                />
              )}
              <View style={[ystack, fullWidth, { gap: spacing.xxs }]}>
                <Text style={[body.sm.semiBold, { color: theme.text }]}>
                  {item.title || item.project_name}
                </Text>
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
                      { color: theme.text, flexShrink: 1 },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="middle"
                  >
                    {item.client_name}
                  </Text>
                  <CallWhatsappPopover
                    value={item?.client_phone || "-"}
                    code={""}
                    fromInfo={false}
                  />
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

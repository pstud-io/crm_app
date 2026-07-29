import { ItemSeparator } from "@/components/ItemSeperator";
import { borderRadius, borderWidth } from "@/design/borders";
import { primaryColors } from "@/design/colors";
import { height, width } from "@/design/distance";
import { center, grow, xstack, ystack } from "@/design/layout";
import { spacing } from "@/design/spacing";
import { body } from "@/design/typography";
import { useTheme } from "@/hooks/useTheme";
import { capitalizeEachWord, formatAdjustedDate } from "@/utils";
import { Text, View } from "react-native";
import { formatEventType, getDayAndMonth } from "../utils/leadsFunctions";

export const RenderTimelineItem = ({
  timeline,
  index,
  isLast,
}: {
  timeline: any;
  index: number;
  isLast: boolean;
}) => {
  console.log("This is the timeline item", timeline);
  const { theme } = useTheme();
  return (
    <View key={timeline.date} style={[xstack, { gap: spacing.lg }]}>
      <View
        style={[
          ystack,
          center,
          {
            height: height[40],
            width: width[36],
            backgroundColor: primaryColors.brand[500],
            borderRadius: borderRadius.md,
          },
        ]}
      >
        <Text style={[body.xs.bold, { color: theme.textInverse }]}>
          {getDayAndMonth(timeline.date).day}
        </Text>
        <Text style={[body.xxs.bold, { color: theme.textInverse }]}>
          {getDayAndMonth(timeline.date).month}
        </Text>
      </View>
      <View key={timeline.date} style={[ystack, grow]}>
        {timeline.items.map((item: any, itemIndex: number) => {
          const isMostLast = itemIndex === timeline.items.length - 1;
          return (
            <View key={item.id} style={[xstack, { gap: spacing.lg }]}>
              <View
                style={[
                  ystack,
                  {
                    width: width[12],
                    backgroundColor: "transparent",
                    borderRadius: borderRadius.md,
                    justifyContent: "flex-start",
                    gap: spacing.xs,
                    paddingTop: spacing.sm,
                  },
                ]}
              >
                <View
                  style={[
                    xstack,
                    center,
                    {
                      height: height[12],
                      width: width[12],
                      backgroundColor: theme.border,
                      borderRadius: borderRadius.full,
                      borderWidth: borderWidth.thick,
                      borderColor: primaryColors.brand[500],
                    },
                  ]}
                ></View>
                {!(isLast && isMostLast) && (
                  <View
                    style={[
                      xstack,
                      {
                        width: 1,
                        backgroundColor: theme.border,
                        borderColor: primaryColors.brand[500],
                        flexGrow: 1,
                        alignSelf: "center",
                      },
                    ]}
                  ></View>
                )}
              </View>
              <View
                style={[
                  ystack,
                  {
                    width: width[12],
                    backgroundColor: theme.header,
                    borderRadius: borderRadius.md,
                    borderWidth: borderWidth.hw,
                    borderColor: theme.border,
                    justifyContent: "flex-start",
                    gap: spacing.xs,
                    padding: spacing.md,
                    flexGrow: 1,
                    boxShadow: theme.shadow.xs,
                    marginBottom: spacing.lg,
                  },
                ]}
              >
                <View key={item.id} style={[xstack, { gap: 3 }]}>
                  <Text
                    style={[body.sm.medium, { color: theme.text }]}
                    numberOfLines={2}
                  >
                    {formatEventType(item.event_type)} by{" "}
                    {item.actor_details.name}
                  </Text>
                  {/* <Text style={[body.sm.regular, { color: theme.text }]}>
                    by
                  </Text>
                  <Text style={[body.sm.regular, { color: theme.text }]}>
                    {item.actor_details.name}
                  </Text> */}
                </View>
                {/* {item.changes?.fk_lead_source && (
                  <View style={[xstack, { gap: spacing.lg }]}>
                    <Text style={[body.xs.light, { color: theme.text }]}>
                      {item.changes.fk_lead_source.old
                        ? `${item.changes.fk_lead_source.old} - to `
                        : ""}
                      {capitalizeEachWord(item.changes.fk_lead_source.new)}
                    </Text>
                  </View>
                )} */}
                <View style={[xstack, { gap: spacing.lg }]}>
                  <Text style={[body.xs.light, { color: theme.text }]}>
                    {formatAdjustedDate(item.created_on)}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

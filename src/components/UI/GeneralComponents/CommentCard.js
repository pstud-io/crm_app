import { View, Text, StyleSheet, FlatList } from "react-native";
import {
  badFormatDate,
  formatAdjustedDate,
  formatDate,
  SH,
  SW,
} from "../../../utils";
import { Badge } from "../Badge/Badge";
import { body } from "../DesignSystem/typography";
import { primaryColors } from "../DesignSystem/colorPalette";
import { UserOutline } from "../../../svg";
import badgeColors from "../Badge/badgeColors";
import { RenderComment } from "../../specific";
import { RenderAssets } from "./RenderAssets";
export const CommentCard = ({ commentData }) => {
  console.log("This si the commentData received", commentData);
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: SH(12),
        paddingHorizontal: SW(16),
        paddingVertical: SH(16),
        backgroundColor: "white",
        borderRadius: SW(16),
        borderWidth: SW(0.5),
        borderColor: primaryColors.gray[200],
        marginBottom: SH(12),
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: SW(8),
          }}
        >
          <Badge
            size={"sm"}
            iconLeft={
              <UserOutline
                width={SW(16)}
                height={SH(16)}
                strokeWidth={SW(2.5)}
                stroke={badgeColors.outline.text}
              />
            }
            color={badgeColors.outline}
          />
          <Text
            style={{ ...body.sm.semiBold, color: primaryColors.brand[1000] }}
          >
            {commentData.contact_details?.name}
          </Text>
        </View>
        <Text style={{ ...body.xs.regular, color: primaryColors.gray[500] }}>
          {formatDate(commentData.created_at || commentData.created_on)}
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "flex-Start",
          width: "100%",
          backgroundColor: primaryColors.gray[100],
          paddingVertical: SH(12),
          paddingHorizontal: SW(12),
          borderRadius: SW(12),
          borderTopLeftRadius: SW(0),
        }}
      >
        <RenderComment
          comment={commentData.text}
          onMentionPress={(id, name) => {
            console.log("Mention clicked:", name, id);
          }}
          textStyle={{ ...body.sm.regular, color: primaryColors.brand[1000] }}
        />
      </View>
      {commentData.asset_details.length > 0 && (
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-Start",
            gap: SW(4),
            width: "100%",
          }}
        >
          <Text style={{ ...body.xs.regular, color: primaryColors.gray[700] }}>
            Files Attached
          </Text>
          <RenderAssets
            imageSize={SW(32)}
            assets={commentData.asset_details}
            isCircular={true}
            marginRight={SW(-8)}
            contentContainerStyle={{
              paddingRight: SW(8),
            }}
            style={{ borderRadius: SW(32) }}
          />
        </View>
      )}
    </View>
  );
};

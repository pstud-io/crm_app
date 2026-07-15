import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors, SH, SW, SF, badFormatDate, formatDate } from "../../../utils";
import { NoteOutlineIcon, UserOutline } from "../../../svg";
import { htmlToPlainString } from "../../../utils/HTMLToPlainString";
import { body } from "../../../components/UI/DesignSystem/typography";
import { primaryColors } from "../../../components/UI/DesignSystem/colorPalette";
import { stripMarkdown } from "../utils/noteUtils";
import badgeColors from "../../../components/UI/Badge/badgeColors";
import { Badge } from "../../../components/UI/Badge/Badge";
import { ItemSeparatorComponent } from "../../../components/UI/GeneralComponents/ItemSeperatorComponent";
import { ExpandableNoteDescription } from "./ExpandableNoteDescription";
import CommentCircle from "../../../svg/comment-circle";
import { Spacing } from "../../../components";

const NoteCard = ({ note, onPress, showNoteText = true }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
      disabled={!showNoteText}
    >
      <View style={styles.titleRow}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: SH(36),
            height: SH(36),
            borderRadius: SW(36),
            backgroundColor: primaryColors.gray[100],
            borderColor: primaryColors.gray[200],
            borderWidth: StyleSheet.hairlineWidth,
          }}
        >
          <UserOutline
            width={SW(18)}
            height={SH(18)}
            stroke={primaryColors.brand[1000]}
            strokeWidth={SW(1.5)}
          />
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            gap: SH(4),
            flexGrow: 1,
            flexShrink: 1,
          }}
        >
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {note?.creator_contact_details?.name}
          </Text>
          <Text style={styles.date} numberOfLines={1}>
            {formatDate(note?.created_on)}
          </Text>
        </View>
        {showNoteText && (
          <TouchableOpacity onPress={onPress}>
            <CommentCircle
              width={SH(18)}
              height={SH(18)}
              stroke={primaryColors.brand[1000]}
              strokeWidth={SW(1)}
            />
          </TouchableOpacity>
        )}
      </View>

      {showNoteText && (
        <>
          <View style={styles.footer}>
            <Text
              style={styles.footerText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Title: {note?.title || "Unknown"}
            </Text>
            <Badge
              color={badgeColors.gray}
              text={`${note.asset_count} Files`}
              size={"sm"}
              alignSelf="center"
            />
          </View>
          <Text style={styles.description} numberOfLines={2}>
            {stripMarkdown(note.description)}
          </Text>
        </>
      )}

      {!showNoteText && (
        <>
          {/* <ItemSeparatorComponent
            direction={"horizontal"}
            style={{
              borderTopWidth: StyleSheet.hairlineWidth,
              marginVertical: 0,
              marginTop: SH(12),
            }}
          /> */}
          <ExpandableNoteDescription description={note.description} />
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    borderRadius: SW(16),
    overflow: "hidden",
    marginBottom: SH(16),
    borderWidth: SW(1),
    borderColor: primaryColors.gray[200],
    shadowColor: "#0A0D12",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: SH(12),
  },
  titleRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flexGrow: 1,
    paddingHorizontal: SW(8),
    gap: SW(8),
    backgroundColor: primaryColors.gray[50],
    paddingVertical: SH(12),
    borderBottomColor: primaryColors.gray[300],
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    ...body.sm.semiBold,
    color: primaryColors.brand[1000],
  },
  date: {
    ...body.xs.semiBold,
    color: primaryColors.gray[500],
  },
  badge: {
    backgroundColor: primaryColors.gray[50],
    paddingHorizontal: SW(8),
    paddingVertical: SH(2),
    borderRadius: SW(6),
  },
  badgeText: {
    ...body.sm.semiBold,
    color: primaryColors.gray[700],
  },
  description: {
    ...body.sm.regular,
    color: primaryColors.gray[600],
    width: "100%",
    paddingHorizontal: SH(12),
    paddingBottom: SH(16),
  },
  footer: {
    paddingHorizontal: SH(12),
    paddingVertical: SH(12),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    gap: SW(8),
    // borderBottomColor: primaryColors.gray[200],
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // marginBottom: SH(8),
  },
  footerText: {
    ...body.sm.regular,
    maxWidth: "90%",
    color: primaryColors.brand[1000],
    flexShrink: 1,
  },
});

export default NoteCard;

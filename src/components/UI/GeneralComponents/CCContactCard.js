import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SH, SW, SF } from "../../../utils";
import { UserOutline } from "../../../svg";
import { body } from "../../../components/UI/DesignSystem/typography";
import { primaryColors } from "../../../components/UI/DesignSystem/colorPalette";
import badgeColors from "../../../components/UI/Badge/badgeColors";
import { Badge } from "../Badge/Badge";

export const CCContactCard = ({ contact }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.profileGroup}>
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
          <Text style={styles.nameText}>{contact.name}</Text>
        </View>
        <Text style={styles.subText}>Contact</Text>
      </View>

      {contact.email && (
        <>
          <View style={styles.separator} />

          <View style={styles.body}>
            <Text style={styles.labelText}>Details</Text>
            <Text style={styles.infoText}>{contact.email}</Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: SH(12),
    paddingHorizontal: SW(16),
    paddingVertical: SH(16),
    backgroundColor: "white",
    borderRadius: SW(16),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: primaryColors.gray[200],
    marginBottom: SH(16),
    elevation: 1,
    shadowColor: "#0A0D12",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  profileGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badgeContainer: {
    width: SW(32),
    height: SW(32),
    borderRadius: SW(16),
    backgroundColor: badgeColors.blueGray.background,
    justifyContent: "center",
    alignItems: "center",
  },
  nameText: {
    ...body.sm.semiBold,
    color: primaryColors.brand[1000],
  },
  subText: {
    ...body.xs.regular,
    color: primaryColors.gray[500],
  },
  separator: {
    width: "100%",
    borderTopWidth: 1,
    borderColor: primaryColors.gray[200],
  },
  body: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 4,
    width: "100%",
  },
  labelText: {
    ...body.sm.regular,
    color: primaryColors.gray[700],
  },
  infoText: {
    ...body.sm.medium,
    color: primaryColors.brand[1000],
  },
});

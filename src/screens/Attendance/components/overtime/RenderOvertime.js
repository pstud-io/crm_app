import { View, Text, StyleSheet } from "react-native";
import { SW, SH, formatDateWithoutTime, formatTime } from "../../../../utils";
import { primaryColors } from "../../../../components/UI/DesignSystem/colorPalette";
import { body } from "../../../../components/UI/DesignSystem/typography";
import { Badge } from "../../../../components/UI/Badge/Badge";
import { getOvertimeStatusColor } from "../../utils/leaveUtils";
import { RenderAssets } from "@/components/UI/GeneralComponents/RenderAssets";

export const RenderOvertime = ({ overtime, onRefresh }) => {
  const statusColor = getOvertimeStatusColor(overtime?.status);
  const statusDisplayText =
    overtime?.status.charAt(0).toUpperCase() + overtime?.status.slice(1);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.reasonText}>
          {formatDateWithoutTime(overtime?.overtime_date)}
        </Text>
        <Badge text={statusDisplayText} color={statusColor} size="md" />
      </View>
      <View style={styles.dateDetailsRow}>
        <View
          style={{
            ...styles.detailColumn,
            maxWidth: "50%",
            flexGrow: 1,
          }}
        >
          <Text style={styles.columnTitle}>From</Text>
          <Text style={styles.columnValue}>
            {formatTime(overtime?.start_time)}
          </Text>
        </View>
        <View
          style={{
            ...styles.detailColumn,
            maxWidth: "50%",
            flexGrow: 1,
          }}
        >
          <Text style={styles.columnTitle}>To</Text>
          <Text style={styles.columnValue}>
            {formatTime(overtime?.end_time)}
          </Text>
        </View>
      </View>
      <>
        <View
          style={{
            width: "100%",
            borderBottomWidth: 1,
            borderBottomColor: "#F2F2F2",
          }}
        />
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              display: "flex",
              gap: SH(8),
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              flexGrow: 1,
              maxWidth: "50%",
            }}
          >
            <Text
              style={{
                ...body.sm.medium,
                color: primaryColors.gray[700],
              }}
            >
              Total Hours
            </Text>
            <Text
              style={{ ...body.sm.semiBold, color: primaryColors.brand[1000] }}
            >
              {overtime?.hours || "Unknown"}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              gap: SH(8),
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              flexGrow: 1,
              maxWidth: "50%",
            }}
          >
            <Text
              style={{
                ...body.sm.medium,
                color: primaryColors.gray[700],
              }}
            >
              Overtime Amount
            </Text>
            <Text
              style={{ ...body.sm.semiBold, color: primaryColors.brand[1000] }}
            >
              {overtime?.amount_paid}
            </Text>
          </View>
        </View>
      </>
      {overtime.remarks !== "" && overtime.remarks && (
        <>
          <View
            style={{
              width: "100%",
              borderBottomWidth: 1,
              borderBottomColor: "#F2F2F2",
            }}
          />
          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                display: "flex",
                gap: SH(8),
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                flexGrow: 1,
              }}
            >
              <Text
                style={{
                  ...body.sm.medium,
                  color: primaryColors.gray[700],
                }}
              >
                Remarks
              </Text>
              <Text
                style={{
                  ...body.sm.semiBold,
                  color: primaryColors.brand[1000],
                }}
              >
                {overtime?.remarks || ""}
              </Text>
            </View>
          </View>
        </>
      )}
      {overtime.asset_details && (
        <>
          <View
            style={{
              width: "100%",
              borderBottomWidth: 1,
              borderBottomColor: "#F2F2F2",
            }}
          />
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
            <Text
              style={{
                ...body.sm.medium,
                color: primaryColors.gray[700],
              }}
            >
              Files Attached
            </Text>
            <RenderAssets
              imageSize={SW(32)}
              assets={[overtime.asset_details]}
              isCircular={true}
              marginRight={SW(-8)}
              contentContainerStyle={{
                paddingRight: SW(8),
              }}
              style={{ borderRadius: SW(32) }}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: SH(16),
    backgroundColor: "white",
    borderRadius: SW(16),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: primaryColors.gray[200],
    marginBottom: SH(16),
    gap: SH(12),
    shadowColor: "#0A0D12",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  reasonText: {
    ...body.sm.semiBold,
    color: primaryColors.brand[1000],
  },
  dateDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingTop: SH(8),
    borderTopWidth: 1,
    borderTopColor: primaryColors.gray[200],
  },
  detailColumn: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  punchDetailsGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingTop: SH(8),
    borderTopWidth: 1,
    borderTopColor: primaryColors.gray[200],
  },
  punchItem: {
    width: "50%",
    marginBottom: SH(12),
    alignItems: "flex-start",
    paddingRight: SW(8),
  },
  columnTitle: {
    ...body.sm.medium,
    color: primaryColors.gray[700],
    marginBottom: SH(4),
    fontSize: SH(12),
  },
  columnValue: {
    ...body.sm.semiBold,
    color: primaryColors.brand[1000],
  },
  actionRow: {
    width: "100%",
    alignItems: "flex-end",
    paddingTop: SH(8),
    borderTopWidth: 1,
    borderTopColor: primaryColors.gray[200],
  },
  cancelButton: {
    paddingHorizontal: SW(16),
    paddingVertical: SH(10),
    borderRadius: SW(8),
    backgroundColor: primaryColors.gray[100] || "#F9FAFB",
    borderWidth: 1,
    borderColor: primaryColors.gray[200] || "#E5E7EB",
  },
  cancelButtonText: {
    ...body.sm.medium,
    color: primaryColors.brand[1000],
  },
});

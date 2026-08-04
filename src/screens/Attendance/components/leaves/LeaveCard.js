import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SW, SH, badFormatDate } from "../../../../utils";
import {
  primaryColors,
  secondaryColors,
} from "../../../../components/UI/DesignSystem/colorPalette";
import { body } from "../../../../components/UI/DesignSystem/typography";
import { Badge } from "../../../../components/UI/Badge/Badge";
import badgeColors from "../../../../components/UI/Badge/badgeColors";
import { LocationOutline } from "../../../../svg";
import {
  isFutureOrToday,
  calculateDays,
  getLeaveStatusColor,
  getLeaveTypeDisplayText,
} from "../../utils/leaveUtils";
import { useLeaveEndpoints } from "../../hooks/useLeavesEndpoints";

export const LeaveCard = ({ leave, onRefresh }) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const { updateLeaveStatus } = useLeaveEndpoints();

  const statusColor = getLeaveStatusColor(leave.status);
  const typeDisplayText = getLeaveTypeDisplayText(leave.type);
  const statusDisplayText =
    leave.status.charAt(0).toUpperCase() + leave.status.slice(1);
  // const typeColor =
  //   leave.type === "casual"
  //     ? badgeColors.blue
  //     : leave.type === "sick"
  //       ? badgeColors.error
  //       : leave.type === "paid"
  //         ? badgeColors.purple
  //         : badgeColors.gray;

  const typeColor = badgeColors.outline;

  const isLeaveRequest = leave.type !== "Absent";
  const isFuture = isFutureOrToday(leave.start_date);
  const showCancelButton =
    isFuture && leave.status !== "approved" && leave.status !== "rejected";
  const totalDays = calculateDays(leave.start_date, leave.end_date);

  const handleCancel = () => {
    Alert.alert(
      "Confirm Cancellation",
      "Are you sure you want to cancel this leave request? This action cannot be undone.",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, Cancel It",
          style: "destructive",
          onPress: async () => {
            await updateLeaveStatus(
              setIsCancelling,
              leave.id,
              "cancelled",
              () => {
                onRefresh && onRefresh();
              },
            );
          },
        },
      ],
      { cancelable: false },
    );
  };

  const getAppliedFor = (duration) => {
    if (duration === "full_day") {
      return "Full Day";
    } else if (duration === "half_day") {
      return "Half Day";
    } else {
      return "Unknown";
    }
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <Badge text={typeDisplayText} color={typeColor} size="md" />
        <Badge text={statusDisplayText} color={statusColor} size="md" />
      </View>

      <Text style={styles.reasonText}>
        {leave.title || leave.reason || leave.type}
      </Text>

      {isLeaveRequest ? (
        <View style={styles.dateDetailsRow}>
          <View style={{ ...styles.detailColumn, maxWidth: "40%" }}>
            <Text style={styles.columnTitle}>From Date</Text>
            <Text style={styles.columnValue}>
              {badFormatDate(leave.start_date)}
            </Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={styles.columnTitle}>To date</Text>
            <Text style={styles.columnValue}>
              {badFormatDate(leave.end_date)}
            </Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={styles.columnTitle}>Total Days</Text>
            <Text style={styles.columnValue}>{totalDays}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.punchDetailsGrid}>
          <View style={styles.punchItem}>
            <Text style={styles.columnTitle}>Punch in Time</Text>
            <Text style={styles.columnValue}>{leave.punchIn}</Text>
          </View>
          <View style={styles.punchItem}>
            <Text style={styles.columnTitle}>Punch in Location</Text>
            <LocationOutline
              width={SW(16)}
              height={SH(16)}
              fill={primaryColors.gray[400]}
            />
          </View>
          <View style={styles.punchItem}>
            <Text style={styles.columnTitle}>Punch Out Time</Text>
            <Text style={styles.columnValue}>{leave.punchOut}</Text>
          </View>
          <View style={styles.punchItem}>
            <Text style={styles.columnTitle}>Punch Out Location</Text>
            <LocationOutline
              width={SW(16)}
              height={SH(16)}
              fill={primaryColors.gray[400]}
            />
          </View>
        </View>
      )}
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
            }}
          >
            <Text
              style={{
                ...body.sm.medium,
                color: primaryColors.gray[700],
              }}
            >
              Applied For
            </Text>
            <Text
              style={{ ...body.sm.semiBold, color: primaryColors.brand[1000] }}
            >
              {getAppliedFor(leave?.day_length) || "Unknown"}
            </Text>
            {/* <Badge
              text={getAppliedFor(leave?.day_length) || "Unknown"}
              size={"md"}
              color={badgeColors.outline}
            /> */}
          </View>
          <View
            style={{
              display: "flex",
              gap: SH(8),
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                ...body.sm.medium,
                color: primaryColors.gray[700],
              }}
            >
              Applied On
            </Text>
            <Text
              style={{ ...body.sm.semiBold, color: primaryColors.brand[1000] }}
            >
              {badFormatDate(leave?.created_on)}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              gap: SH(8),
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              opacity: 0,
            }}
          >
            <Text
              style={{
                ...body.xs.medium,
                color: primaryColors.gray[600],
              }}
            >
              Total Days
            </Text>
            <Text style={{ ...body.sm.medium, color: primaryColors.gray[900] }}>
              {totalDays}
            </Text>
          </View>
        </View>
      </>

      {showCancelButton && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            disabled={isCancelling}
          >
            <Text style={styles.cancelButtonText}>
              Cancel Request
              {isCancelling && (
                <ActivityIndicator
                  size="small"
                  color={primaryColors.brand[1000]}
                />
              )}
            </Text>
          </TouchableOpacity>
        </View>
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

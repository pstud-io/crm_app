import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import {
  formatTime12Hour,
  getDateAndMonth,
  newDateToYYYYMMDD,
  SH,
  SW,
} from "../../../../utils";
import { primaryColors } from "../../../../components/UI/DesignSystem/colorPalette";
import { ItemSeparatorComponent } from "../../../../components/UI/GeneralComponents/ItemSeperatorComponent";
import { Badge } from "../../../../components/UI/Badge/Badge";
import {
  getAttendanceStatusColor,
  getBadgeColoForAttendance,
  getTotalWorkingHours,
  isDateWeekend,
  openMapForAttendance,
} from "../../utils/attendance/attendanceGeneralFunctions";
import {
  body,
  body as typography,
} from "../../../../components/UI/DesignSystem/typography";
import GoogleMaps from "../../../../svg/google-maps";
import badgeColors from "../../../../components/UI/Badge/badgeColors";
import {
  openPunchOutBottomSheet,
  openRegularizationBottomSheet,
  regularizationBottomSheetRef,
} from "../../utils/attendance/punchoutBottomSheetService";
import { RenderAssets } from "../../../../components/UI/GeneralComponents/RenderAssets";

export const RenderAttendance = ({ item, weekendsData }) => {
  const hasNotPunchedIn = item.punch_in_time === null;
  const hasNotPunchedOut = item.punch_out_time === null;
  const hasRequestedRegularization =
    item.status === "Regularization Pending" ||
    item.status === "Regularization Rejected";

  const ispresentDate = newDateToYYYYMMDD(new Date().toString()) === item.date;
  const isWeekend = isDateWeekend(item.date, weekendsData);

  const leaves = ["company leave", "casual leave", "sick leave"];
  const isPastDate = !ispresentDate;
  const forgotToPunchOut = !hasNotPunchedIn && hasNotPunchedOut && isPastDate;

  const openSheet = (item, isPunchOut) => {
    openRegularizationBottomSheet({
      item,
      isPunchOut: isPunchOut,
      date: item.date,
    });
  };

  if (isWeekend || leaves.includes(item?.status?.toLowerCase())) {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.rowBetween}>
          <Text style={styles.dateText}>{getDateAndMonth(item.date)}</Text>
          <Badge
            text={isWeekend ? "Weekend" : item.status}
            color={getAttendanceStatusColor(
              isWeekend ? "weekend" : item.status,
            )}
            size={"sm"}
          />
        </View>
      </View>
    );
  }

  if (ispresentDate && hasNotPunchedIn) return null;

  return (
    <View style={styles.cardContainer}>
      <View style={styles.rowBetween}>
        <Text style={styles.dateTextMedium}>{getDateAndMonth(item.date)}</Text>
        <Badge
          text={item?.status ? item.status : "Pending"}
          color={getAttendanceStatusColor(item?.status?.toLowerCase())}
          size={"sm"}
        />
      </View>

      {item.status === "Present" && (
        <View style={[styles.rowBetween, { marginTop: SH(8) }]}>
          <Text style={styles.labelSmall}>Total Working Hours</Text>
          <Badge
            text={getTotalWorkingHours(
              item.punch_in_time,
              item.punch_out_time,
              item.date,
            )}
            alignSelf="center"
            color={getBadgeColoForAttendance(
              item.punch_in_time,
              item.punch_out_time,
              item.date,
            )}
            size={"sm"}
          />
        </View>
      )}

      {!isWeekend && (!hasRequestedRegularization || !hasNotPunchedIn) && (
        <ItemSeparatorComponent direction={"horizontal"} />
      )}

      {hasNotPunchedIn ? (
        ispresentDate ? (
          <TouchableOpacity
            onPress={() => console.log("Marking attendance")}
            style={styles.fullWidth}
          >
            <Badge
              text="Punch In"
              size={"lg"}
              color={badgeColors.blueGray}
              border={true}
              alignSelf="flex-end"
            />
          </TouchableOpacity>
        ) : !hasRequestedRegularization && !isWeekend ? (
          <TouchableOpacity
            onPress={() =>
              openRegularizationBottomSheet({
                item,
                isPunchOut: false,
                date: item.date,
              })
            }
            style={styles.fullWidth}
          >
            <Text
              style={{ ...body.sm.semiBold, color: primaryColors.gray[25] }}
            >
              Request Punch In
            </Text>
          </TouchableOpacity>
        ) : null
      ) : (
        <>
          <View style={styles.rowBetweenStart}>
            <View style={styles.infoColumn}>
              <Text style={styles.labelMedium}>Punch In Time</Text>
              <Text style={styles.valueMedium}>
                {formatTime12Hour(item.punch_in_time)}
              </Text>
            </View>

            <View style={styles.infoColumn}>
              <Text style={styles.labelMedium}>Punch In Location</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  gap: SW(8),
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    openMapForAttendance(
                      item.punch_in_location.latitude,
                      item.punch_in_location.longitude,
                    )
                  }
                  disabled={!item?.punch_in_location?.latitude}
                >
                  {item?.punch_in_location?.latitude ? (
                    <GoogleMaps width={SH(24)} height={SH(24)} />
                  ) : (
                    <Text style={styles.valueMedium}>Location Unavailable</Text>
                  )}
                </TouchableOpacity>
                {item?.punch_in_self_asset_details &&
                  Object.keys(item.punch_in_self_asset_details).length > 0 &&
                  item?.punch_in_location?.latitude && (
                    <RenderAssets
                      imageSize={SH(24)}
                      assets={[item.punch_in_self_asset_details]}
                    />
                  )}
              </View>
            </View>
          </View>

          <ItemSeparatorComponent direction={"horizontal"} />

          {ispresentDate && hasNotPunchedOut ? (
            <TouchableOpacity
              onPress={() => {
                console.log("Hi from open punch out");
                openPunchOutBottomSheet();
              }}
              style={styles.fullWidth}
            >
              <Text
                style={{ ...body.sm.semiBold, color: primaryColors.gray[25] }}
              >
                Punch Out
              </Text>
            </TouchableOpacity>
          ) : forgotToPunchOut && !hasRequestedRegularization ? (
            <TouchableOpacity
              onPress={() => openSheet(item, true)}
              style={styles.fullWidth}
            >
              <Text
                style={{ ...body.sm.semiBold, color: primaryColors.gray[25] }}
              >
                Request Punch Out
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.rowBetweenStart}>
              <View style={styles.infoColumn}>
                <Text style={styles.labelMedium}>Punch Out Time</Text>
                <Text style={styles.valueMedium}>
                  {formatTime12Hour(item.punch_out_time)}
                </Text>
              </View>

              <View style={styles.infoColumn}>
                <Text style={styles.labelMedium}>Punch Out Location</Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    gap: SW(8),
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      openMapForAttendance(
                        item.punch_out_location.latitude,
                        item.punch_out_location.longitude,
                      )
                    }
                    disabled={!item?.punch_out_location?.latitude}
                  >
                    {item?.punch_out_location?.latitude ? (
                      <GoogleMaps width={SH(24)} height={SH(24)} />
                    ) : (
                      <Text style={styles.valueMedium}>
                        Location Unavailable
                      </Text>
                    )}
                  </TouchableOpacity>
                  {item?.punch_out_self_asset_details &&
                    Object.keys(item.punch_out_self_asset_details).length > 0 &&
                    item?.punch_out_location?.latitude && (
                      <RenderAssets
                        imageSize={SH(24)}
                        assets={[item.punch_out_self_asset_details]}
                      />
                    )}
                </View>
              </View>
            </View>
          )}
        </>
      )}

      {item.punch_out_remarks && (
        <>
          <ItemSeparatorComponent direction={"horizontal"} />
          <View style={styles.remarksContainer}>
            <Text style={styles.labelSmall}>Punch Out Remarks</Text>
            <Text style={styles.valueDark}>{item.punch_out_remarks}</Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "column",
    padding: SH(16),
    borderRadius: SW(16),
    borderColor: primaryColors.gray[200],
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: SH(16),
    backgroundColor: "#fff",
    elevation: 1,
    shadowColor: "#0A0D12",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  rowBetweenStart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
  },
  fullWidth: {
    width: "45%",
    backgroundColor: primaryColors.brand[1000],
    borderRadius: SW(8),
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SH(8),
    alignSelf: "flex-end",
  },
  infoColumn: { flex: 1, gap: SH(4), alignItems: "flex-start" },
  remarksContainer: { width: "100%", gap: SH(8), alignItems: "flex-start" },

  dateText: {
    ...typography.md.regular,
    color: primaryColors.gray[800],
    includeFontPadding: false,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },

  dateTextMedium: {
    ...typography.sm.semiBold,
    color: primaryColors.brand[1000],
    includeFontPadding: false,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },

  labelSmall: {
    ...typography.sm.medium,
    color: primaryColors.gray[700],
    includeFontPadding: false,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },

  labelMedium: {
    ...typography.sm.medium,
    color: primaryColors.gray[700],
    includeFontPadding: false,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },

  valueMedium: {
    ...typography.sm.semiBold,
    color: primaryColors.brand[1000],
    includeFontPadding: false,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },

  valueDark: {
    ...typography.md.medium,
    color: primaryColors.gray[800],
    includeFontPadding: false,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
});

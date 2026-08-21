import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Platform,
  I18nManager,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { Shadow } from "react-native-shadow-2";
import DateTimePicker from "@react-native-community/datetimepicker";

import {
  Colors,
  SH,
  SW,
  SCREEN_WIDTH,
  formatDateWithoutTime,
} from "../../utils";
// import { Button, Spacing } from "../../components/common";
import Spacing from "@/components/Spacing";
import { primaryColors } from "../../components/UI/DesignSystem/colorPalette";
import { body as typography } from "../../components/UI/DesignSystem/typography";
import { Tab } from "../../components/UI/Tab/Tab";
import { useAttendanceEndpoints } from "./hooks/useAttendanceEndpoints";
import { usePayrollEndpoints } from "./hooks/usePayrollEndpoints";
import { ListAttendance } from "./ListAttendance";
import { Leaves } from "./Leaves";
import { Payroll } from "./Payroll";
import PunchOutBottomSheet from "./components/attendance/PunchOutBottomSheet";
import RegularlizationBottomSheet from "./components/attendance/RegularizationBottomSheet";
import { isDateWeekend } from "./utils/attendance/attendanceGeneralFunctions";
import { SubTabChip } from "../../components/UI/GeneralComponents/SubTabChip";
// import { setCustomAddButton } from "../../store/slices/customAddButtonSlice";
import { setActiveSubButtonGlobal } from "../../store/slices/activeSubButtonGlobal";
import { Button } from "@/components/Button";

const Attendance = ({ navigation }) => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project.selectedProject);
  const organizationDetails = useSelector(
    (state) => state.profile.organization_details,
  );
  console.log("Organization details are", organizationDetails);
  const [selectedMedia, setSelectedMedia] = useState([]);
  // Tab configuration using static text
  const subButtons = useMemo(() => {
    const buttons = [{ id: "attendance", title: "Attendance" }];
    if (organizationDetails.leave_show) {
      buttons.push({ id: "leaves", title: "Leaves" });
      if (organizationDetails.payroll_show) {
        buttons.push({ id: "payroll", title: "Payroll" });
      }
    }
    return buttons;
  }, [organizationDetails]);

  const [activeSubButton, setActiveSubButton] = useState("attendance");
  const [refreshing, setRefreshing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceSummaryData, setAttendanceSummaryData] = useState([]);
  const [requestsData, setRequestsData] = useState([]);
  const latestAttendance = attendanceData[0];

  const [payrollSummaryData, setPayrollSummaryData] = useState(null);
  const [payrollData, setPayrollData] = useState(null);
  const [weekendsData, setWeekendsData] = useState([]);
  const excludedStatuses = [
    "company leave",
    "casual leave",
    "sick leave",
    "absent",
  ];

  const { getPayrollSummary, getPayroll } = usePayrollEndpoints();
  const {
    getAttendance,
    handlePunchInPress,
    getRequests,
    getAttendanceSummary,
    getCustomWeekends,
  } = useAttendanceEndpoints();

  const [loading, setLoading] = useState({
    getAttendance: false,
    getAttendanceSummary: false,
    fetchingPayrollSummary: false,
    fetchingPayroll: false,
    markingAttendance: false,
    loadingText: "",
    getRequests: false,
    getCustomWeekends: false,
  });

  const [initialLoading, setInitialLoading] = useState({
    getAttendance: false,
    getAttendanceSummary: false,
  });

  const month = selectedDate.getMonth();
  const year = selectedDate.getFullYear();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (token) {
          await Promise.all([
            getAttendance(
              setInitialLoading,
              setAttendanceData,
              month + 1,
              year,
            ),
            getAttendanceSummary(
              setInitialLoading,
              setAttendanceSummaryData,
              month + 1,
              year,
            ),
            getPayrollSummary(setLoading, setPayrollSummaryData),
            getPayroll(setLoading, setPayrollData),
            getRequests(setLoading, setRequestsData),
            getCustomWeekends(setLoading, (res) => {
              setWeekendsData(res?.weekend_days || ["Sunday"]);
            }),
          ]);
        }
      };

      fetchData();
    }, [token, project, month, year]),
  );

  useFocusEffect(
    useCallback(() => {
      if (activeSubButton === "attendance") {
        dispatch(setActiveSubButtonGlobal("attendance"));
      } else if (activeSubButton === "leaves") {
        dispatch(setActiveSubButtonGlobal("leaves"));
      } else if (activeSubButton === "payroll") {
        dispatch(setActiveSubButtonGlobal("payroll"));
      }
    }, [activeSubButton]),
  );

  // useFocusEffect(
  //   useCallback(() => {
  //     if (activeSubButton !== "leaves") {
  //       dispatch(
  //         setCustomAddButton({
  //           cannotAdd: true,
  //           onPress: "DO_NOTHING",
  //         }),
  //       );
  //     }
  //     if (activeSubButton === "leaves") {
  //       dispatch(
  //         setCustomAddButton({
  //           cannotAdd: false,
  //           onPress: "ADD_LEAVE",
  //         }),
  //       );
  //     }
  //   }, [activeSubButton]),
  // );

  // useFocusEffect(
  //   useCallback(() => {
  //     console.log(
  //       "This is the active tab and focused",
  //       activeTabButtonID,
  //       isFocused,
  //     );
  //     if (isFocused) {
  //       setTimeout(() => {
  //         dispatch(setActiveSubButtonGlobal("hmrs"));
  //       }, 0);
  //     }
  //   }, []),
  // );

  const refreshCurrentData = async () => {
    setRefreshing(true);
    await getAttendance(setLoading, setAttendanceData, month + 1, year);
    (await getAttendanceSummary(
      setLoading,
      setAttendanceSummaryData,
      month + 1,
      year,
    ),
      setRefreshing(false));
  };

  // Helper to provide static headers based on active tab
  const getHeaderTitle = (id) => {
    switch (id) {
      case "attendance":
        return "Attendance";
      case "leaves":
        return "Leaves";
      case "payroll":
        return "Payroll";
      default:
        return "";
    }
  };

  const handleCaptureMedia = async (mode) => {
    if (loading.markingAttendance) return;
    navigation.navigate("CameraScreen", {
      mode: "picture",
      maxMediaLength: 1,
      onSave: async (mediaArray) => {
        setSelectedMedia(async (prev) => {
          const updated = [...prev, ...mediaArray];

          await handlePunchInPress(setLoading, updated, refreshCurrentData);

          return updated;
        });
      },
    });
  };

  return (
    <View style={styles.mainContainer}>
      <Spacing space={SH(8)} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {getHeaderTitle(activeSubButton)}
        </Text>
        {Platform.OS === "android" &&
          activeSubButton === "attendance" &&
          false && (
            <TouchableOpacity
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: SW(8),
                backgroundColor: "#EFEFF0",
                borderRadius: 8,
                gap: SW(6),
              }}
              onPress={() => setShowDatePicker(true)}
            >
              <Text
                style={{
                  ...typography.md.medium,
                  color: primaryColors.gray[900],
                }}
              >
                {formatDateWithoutTime(selectedDate)}
              </Text>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={"calendar"}
                  onValueChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) {
                      setSelectedDate(date);
                    }
                  }}
                />
              )}
            </TouchableOpacity>
          )}
        {Platform.OS === "ios" && activeSubButton === "attendance" && false && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={"default"}
            onValueChange={(event, date) => {
              if (date) {
                setSelectedDate(date);
              }
            }}
          />
        )}
      </View>

      <View style={styles.content}>
        <FlatList
          horizontal={true}
          data={subButtons}
          contentContainerStyle={{
            height: SH(40),
          }}
          style={{ maxHeight: SH(40), minHeight: SH(40) }}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const isActive = item.id === activeSubButton;
            return (
              <SubTabChip
                title={item.title}
                index={index}
                onPress={() => {
                  setActiveSubButton(item.id);
                }}
                type={isActive ? "default" : "outlined"}
              />
            );
          }}
        />
        <Spacing space={SH(12)} />
      </View>
      {activeSubButton === "attendance" && (
        <ListAttendance
          attendanceData={attendanceData}
          attendanceSummaryData={attendanceSummaryData}
          refreshing={refreshing}
          refreshCurrentData={refreshCurrentData}
          weekendsData={weekendsData}
          loadingAttendance={initialLoading.getAttendance}
          loadingSummary={
            initialLoading.getAttendanceSummary || loading.getAttendanceSummary
          }
        />
      )}
      {activeSubButton === "leaves" && <Leaves />}
      {activeSubButton === "payroll" && (
        <Payroll
          payrollSummaryData={payrollSummaryData}
          payrollData={payrollData}
          loading={loading}
        />
      )}

      <View style={styles.floatingContainer}>
        {activeSubButton === "attendance" &&
          latestAttendance?.punch_in_time === null &&
          !isDateWeekend(latestAttendance.date, weekendsData) &&
          !excludedStatuses.includes(
            latestAttendance?.status?.toLowerCase(),
          ) && (
            <Shadow
              style={{ borderRadius: SW(16) }}
              distance={SW(10)}
              startColor="rgba(0, 0, 0, 0.05)"
              offset={[0, SH(4)]}
            >
              <View style={styles.pendingCard}>
                <View style={styles.pendingCardContent}>
                  <View style={styles.pendingIndicator} />
                  <View style={styles.pendingTextWrapper}>
                    <Text style={styles.pendingTitle}>Attendance Pending</Text>
                    <Text style={styles.pendingSubtitle} numberOfLines={1}>
                      Please mark your attendance
                    </Text>
                  </View>
                </View>
                <Button
                  label={
                    loading?.markingAttendance
                      ? loading?.loadingText
                      : "Punch In"
                  }
                  loading={loading.markingAttendance}
                  onPress={async () => {
                    if (organizationDetails.attendance_self_asset_show) {
                      await handleCaptureMedia("picture");
                      setSelectedMedia([]);
                      return;
                    }
                    if (!loading.markingAttendance) {
                      await handlePunchInPress(
                        setLoading,
                        selectedMedia,
                        refreshCurrentData,
                      );
                      return;
                    }
                  }}
                />
              </View>
            </Shadow>
          )}
      </View>

      <PunchOutBottomSheet
        loading={loading}
        setLoading={setLoading}
        onRefresh={refreshCurrentData}
        latestAttendance={latestAttendance}
      />
      <RegularlizationBottomSheet onRefresh={refreshCurrentData} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: primaryColors.gray[50] },
  header: {
    paddingHorizontal: SW(12),
    height: SH(36),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    ...typography.md.semiBold,
    color: primaryColors.gray[700],
    includeFontPadding: false,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  datePickerTrigger: {
    flexDirection: "row",
    alignItems: "center",
    padding: SW(8),
    backgroundColor: "#EFEFF0",
    borderRadius: 8,
    gap: SW(6),
  },
  dateText: {
    ...typography.md.medium,
    color: primaryColors.gray[900],
    includeFontPadding: false,
  },
  content: {
    width: "100%",
    alignItems: "flex-start",
    paddingHorizontal: SW(12),
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: SH(36),
    borderColor: Colors.gray_line_color,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: SW(6),
    alignSelf: "stretch",
    backgroundColor: "white",
    marginHorizontal: SW(12),
  },
  tabDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: Colors.gray_line_color,
    marginVertical: SH(4),
    height: "50%",
  },
  floatingContainer: {
    position: "absolute",
    bottom: SH(80),
    left: SW(12),
    right: SW(12),
    zIndex: 999,
  },
  pendingCard: {
    backgroundColor: "#fff",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: SW(16),
    borderColor: primaryColors.gray[200],
    borderWidth: SW(1),
    padding: SH(16),
  },
  pendingCardContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: SW(12),
  },
  pendingIndicator: {
    width: SW(4),
    height: SH(32),
    borderRadius: SW(6),
    backgroundColor: primaryColors.button.active,
  },
  pendingTextWrapper: { flex: 1, gap: SH(2) },
  pendingTitle: {
    ...typography.sm.semiBold,
    color: primaryColors.gray[900],
    includeFontPadding: false,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  pendingSubtitle: {
    ...typography.xs.regular,
    color: primaryColors.gray[600],
    includeFontPadding: false,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  punchBtn: {
    height: SH(36),
    paddingHorizontal: SW(14),
    borderRadius: SW(10),
    minWidth: SW(100),
  },
  punchBtnText: { ...typography.xs.semiBold, includeFontPadding: false },
});

export default Attendance;

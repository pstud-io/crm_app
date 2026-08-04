import React, {
  useState,
  useCallback,
  useMemo,
  useImperativeHandle,
  useRef,
} from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { useKeyboard } from "@react-native-community/hooks";
import Toast from "react-native-toast-message";
import { SH, SW, Colors } from "../../../../utils";
import { primaryColors } from "../../../../components/UI/DesignSystem/colorPalette";
import { body } from "../../../../components/UI/DesignSystem/typography";
import { CloseOutlineIcon } from "../../../../svg";
import { BottomButton } from "../../../../components/UI/GeneralComponents/BottomButton";
import {
  requestLeaveBottomSheetRef,
  closeRequestLeaveBottomSheet,
} from "../../utils/requestLeaveBottomSheetRef";
import { useLeaveEndpoints } from "../../hooks/useLeavesEndpoints";
import { DatePicker } from "../../../../components/UI/GeneralComponents/DatePicker";
import { formElementsStyles } from "../../../../components/UI/Dropdown/formElementStyles";
import { Spacing, TranscriptionInput } from "../../../../components";
import { RadioSelect } from "../../../../components/UI/GeneralComponents/RadioSelect";

export const RequestLeaveBottomSheet = ({
  onApplySuccess,
  availableBalance,
}) => {
  const [leaveType, setLeaveType] = useState("casual");
  const [leaveDuration, setLeaveDuration] = useState("full_day");
  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState({ addLeave: false });
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const keyboard = useKeyboard();
  const isKeyboardVisible = keyboard.keyboardShown;
  const snapPoints = useMemo(
    () => [isKeyboardVisible ? "100%" : "90%"],
    [isKeyboardVisible],
  );

  const { handleAddLeave } = useLeaveEndpoints();

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const calculateLeaveDays = useMemo(() => {
    if (fromDate && toDate && fromDate <= toDate) {
      const start = new Date(
        Date.UTC(
          fromDate.getFullYear(),
          fromDate.getMonth(),
          fromDate.getDate(),
        ),
      );
      const end = new Date(
        Date.UTC(toDate.getFullYear(), toDate.getMonth(), toDate.getDate()),
      );
      const diffTime = end.getTime() - start.getTime();
      const MS_PER_DAY = 1000 * 60 * 60 * 24;
      const diffDays = Math.round(diffTime / MS_PER_DAY);
      const total = diffDays + 1;
      return leaveDuration === "half_day" ? 0.5 : total;
    }
    return 0;
  }, [fromDate, toDate, leaveDuration]);

  const durationTypes = [
    { id: "full_day", value: "Full day" },
    { id: "half_day", value: "Half day" },
  ];

  const leaveTypes = [
    { id: "casual", value: "Causal leave" },
    { id: "sick", value: "Sick leave" },
    { id: "paid", value: "Paid leave" },
  ];

  const resetForm = () => {
    setLeaveType("casual");
    setLeaveDuration("full_day");
    setReason("");
    setFromDate(new Date());
    setToDate(new Date());
    setRemarks("");
    setLoading({ addLeave: false });
  };

  const handleApplyLeave = async () => {
    if (!reason.trim()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Reason for leave is required.",
      });
      return;
    }

    if (availableBalance !== null && calculateLeaveDays > availableBalance) {
      Toast.show({
        type: "error",
        text1: "Limit Exceeded",
        text2: `You only have ${availableBalance} available days.`,
      });
      return;
    }

    await handleAddLeave(
      setLoading,
      fromDate,
      toDate,
      reason,
      leaveType,
      leaveDuration,
      remarks,
      () => {
        closeRequestLeaveBottomSheet();
        onApplySuccess && onApplySuccess();
        resetForm();
      },
    );
  };

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={requestLeaveBottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      onDismiss={resetForm}
      enableDynamicSizing={false}
      enableHandlePanningGesture={true}
      enableContentPanningGesture={false}
      onAnimate={(fromIndex, toIndex) => {
        if (availableBalance === 0) {
          closeRequestLeaveBottomSheet();
          Toast.show({
            type: "error",
            text1: "No Leaves Available",
            text2: "You have exhausted your leave balance.",
            visibilityTime: 1500,
            autoHide: true,
          });
        }
      }}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Request Leave</Text>
          {availableBalance !== null && (
            <Text style={styles.balanceText}>
              Available: {availableBalance} Days
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={closeRequestLeaveBottomSheet}>
          <CloseOutlineIcon
            fill={Colors.black_text_color}
            width={SW(16)}
            height={SH(16)}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.separator} />

      <BottomSheetScrollView
        style={styles.scrollView}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          isKeyboardVisible && {
            paddingBottom: keyboard.keyboardHeight + SH(20),
          },
        ]}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View>
            <Text style={formElementsStyles.titleStyle}>
              Applying for leave
            </Text>
            <Spacing space={SH(16)} />
            <RadioSelect
              data={durationTypes}
              orientation={"horizontal"}
              value={leaveDuration}
              setValue={setLeaveDuration}
              scrollEnabled={false}
              justify={false}
              size={16}
            />

            <Spacing space={SH(16)} />

            <Text style={formElementsStyles.titleStyle}>Leave Type</Text>
            <Spacing space={SH(16)} />
            <RadioSelect
              data={leaveTypes}
              orientation={"horizontal"}
              value={leaveType}
              setValue={setLeaveType}
              scrollEnabled={false}
              justify={false}
              size={16}
            />

            <Spacing space={SH(16)} />

            <Text style={formElementsStyles.titleStyle}>
              Reason for leave *
            </Text>
            <Spacing space={SH(8)} />
            <TextInput
              placeholder="Enter reason or task title"
              onChangeText={setReason}
              defaultValue={reason}
              style={[
                formElementsStyles.triggerStyle,
                formElementsStyles.valueStyle,
                formElementsStyles.inputContainerStyle,
                formElementsStyles.placeholderColor,
                formElementsStyles.bottomSheetInput,
              ]}
            />

            <Spacing space={SH(16)} />

            <View style={styles.formTitleRow}>
              <Text style={formElementsStyles.titleStyle}>Leave Period</Text>
              {calculateLeaveDays > 0 && (
                <Text style={styles.daysCountText}>
                  {calculateLeaveDays}{" "}
                  {calculateLeaveDays === 1 ? "Day" : "Days"} Leave
                </Text>
              )}
            </View>
            <Spacing space={SH(8)} />
            <View style={styles.dateRangeRow}>
              <View style={styles.dateRangeColumn}>
                <Text style={styles.dateRangeLabel}>From</Text>
                <DatePicker
                  selectedDate={fromDate}
                  setSelectedDate={setFromDate}
                  placeholder="Start Date"
                  minDate={today}
                  showDatePicker={showStartDatePicker}
                  setShowDatePicker={setShowStartDatePicker}
                />
              </View>

              <View style={styles.dateRangeColumn}>
                <Text style={styles.dateRangeLabel}>To</Text>
                <DatePicker
                  selectedDate={toDate}
                  setSelectedDate={setToDate}
                  placeholder="End Date"
                  minDate={fromDate || today}
                  showDatePicker={showEndDatePicker}
                  setShowDatePicker={setShowEndDatePicker}
                />
              </View>
            </View>

            <Spacing space={SH(16)} />

            <Text style={formElementsStyles.titleStyle}>Remarks</Text>
            <Spacing space={SH(8)} />
            <TranscriptionInput
              value={remarks}
              usesBottomSheet={false}
              onChangeText={setRemarks}
              placeholder="Type Here"
              placeholderTextColor={formElementsStyles.placeholderColor}
              containerStyle={formElementsStyles.descriptionTriggerStyle}
              inputContainerStyle={formElementsStyles.inputContainerStyle}
              inputStyle={formElementsStyles.valueStyle}
              hasIcon={true}
              onTranscriptionStart={() => {
                console.log("Transcription started");
              }}
              onTranscriptionEnd={(transcribedText) => {
                console.log("Transcription completed:", transcribedText);
                // You can show a toast here if needed
              }}
              onTranscriptionError={(error) => {
                console.error("Transcription error:", error);
              }}
            />
            <Spacing space={SH(30)} />
          </View>
        </TouchableWithoutFeedback>
      </BottomSheetScrollView>

      <View style={formElementsStyles.bottomButtonContainer}>
        <BottomButton
          title={"Cancel"}
          onPress={closeRequestLeaveBottomSheet}
          type={"outlined"}
        />
        <BottomButton
          title={"Apply Leave"}
          onPress={handleApplyLeave}
          type={"default"}
          disabled={loading.addLeave}
          icon={
            loading.addLeave && (
              <ActivityIndicator size={SW(12)} color={Colors.white} />
            )
          }
        />
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: primaryColors.gray[900],
    ...body.md.semiBold,
  },
  balanceText: {
    color: primaryColors.gray[500],
    ...body.xs.regular,
  },
  separator: {
    marginVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.gray_line_color,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: SH(20),
  },
  formTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  daysCountText: {
    ...body.sm.medium,
    color: primaryColors.brand[1000],
    backgroundColor: primaryColors.gray[100],
    paddingHorizontal: SW(8),
    paddingVertical: SH(2),
    borderRadius: SW(4),
  },
  dateRangeRow: {
    flexDirection: "row",
    gap: SW(12),
  },
  dateRangeColumn: {
    flex: 1,
  },
  dateRangeLabel: {
    ...body.xs.medium,
    color: primaryColors.gray[600],
    marginBottom: 4,
  },
});

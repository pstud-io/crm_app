import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { useState, useEffect } from "react";
import { Colors, SW, SH, SF } from "../../../../utils";
import { CloseOutlineIcon, UploadCloudOutline } from "../../../../svg";
import { body } from "../../../../components/UI/DesignSystem/typography";
import { primaryColors } from "../../../../components/UI/DesignSystem/colorPalette";
import { formElementsStyles } from "../../../../components/UI/Dropdown/formElementStyles";
import { Spacing, TranscriptionInput } from "../../../../components";
import { BottomButton } from "../../../../components/UI/GeneralComponents/BottomButton";
import { Input } from "react-native-elements";
import useKeyboardStatus from "../../../../hooks/useKeyboardStatus";
import Toast from "react-native-toast-message";
import { useAttendanceEndpoints } from "../../hooks/useAttendanceEndpoints";
import { InputTextStyles } from "@/styles/InputTextStyles";
import { DatePicker } from "@/components/UI/GeneralComponents/DatePicker";
import { TimePicker } from "@/components/UI/GeneralComponents/TimePicker";
import { useCameraScreen } from "@/hooks/useCameraScreen";
import { RenderMedia } from "@/components/UI/GeneralComponents/RenderMedia";
import { useGeneralEndpoints } from "@/hooks/useGeneralEndpoints";
import { useDispatch } from "react-redux";
import { setIsSheetOpen } from "@/store/slices/isSheetOpenSlice";
import {
  overtimeBottomSheetRef,
  closeOvertimeBottomSheet,
} from "../../utils/overtimeBottomSheeetService";

const getMidnight = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const getMinutes = (date) => date.getHours() * 60 + date.getMinutes();

const getTimeSegments = (start, end) => {
  if (end > start) {
    return [[start, end]];
  }

  if (end < start) {
    return [
      [start, 1440],
      [0, end],
    ];
  }

  return [];
};

const timeStringToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const isTimeOverlapping = (
  overtimeStart,
  overtimeEnd,
  workingStart,
  workingEnd,
) => {
  const overtimeSegments = getTimeSegments(
    getMinutes(overtimeStart),
    getMinutes(overtimeEnd),
  );

  const workingSegments = getTimeSegments(
    timeStringToMinutes(workingStart),
    timeStringToMinutes(workingEnd),
  );

  return overtimeSegments.some(([start1, end1]) =>
    workingSegments.some(([start2, end2]) => start1 < end2 && end1 > start2),
  );
};

const AddOvertimeBottomSheet = ({ onRefresh, overtimePolicy, projectId }) => {
  const dispatch = useDispatch();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [selectedFromTime, setSelectedFromTime] = useState(getMidnight);
  const [showFromTimePicker, setShowFromTimePicker] = useState(false);

  const [selectedToTime, setSelectedToTime] = useState(getMidnight);
  const [showToTimePicker, setShowToTimePicker] = useState(false);

  const [hours, setHours] = useState(0);
  const [amount, setAmount] = useState(0);
  const [remark, setRemark] = useState("");
  const [selectedMedia, setSelectedMedia] = useState([]);

  const [hasWorkingHoursOverlap, setHasWorkingHoursOverlap] = useState(false);

  const { handleSelectMedia, handleDeleteMedia } = useCameraScreen({
    setSelectedMedia,
    maxMediaLength: 1,
  });

  const [loading, setLoading] = useState({
    addingOvertime: false,
  });

  const { addOvertime } = useAttendanceEndpoints();
  const { uploadMedia } = useGeneralEndpoints();

  const isKeyboardVisible = useKeyboardStatus();
  const snapPoints = isKeyboardVisible ? "100%" : "80%";

  const resetOvertimeBottomSheet = () => {
    setShowDatePicker(false);
    setSelectedDate(new Date());

    setSelectedFromTime(getMidnight());
    setShowFromTimePicker(false);

    setSelectedToTime(getMidnight());
    setShowToTimePicker(false);

    setAmount(0);
    setHours(0);
    setRemark("");
    setSelectedMedia([]);
    setHasWorkingHoursOverlap(false);

    setLoading({
      addingOvertime: false,
    });
  };

  useEffect(() => {
    return () => {
      console.log("Run cleanup of add leave");
      dispatch(setIsSheetOpen(false));
    };
  }, []);

  // Validate working-hour overlap and calculate overtime.
  useEffect(() => {
    const isFromSelected = getMinutes(selectedFromTime) !== 0;
    const isToSelected = getMinutes(selectedToTime) !== 0;

    // Calculate only after both times have been selected.
    if (!isFromSelected || !isToSelected) {
      setHours(0);
      setAmount(0);
      return;
    }

    const workingStart = overtimePolicy?.start_time;
    const workingEnd = overtimePolicy?.end_time;

    if (!workingStart || !workingEnd) return;

    const hasOverlap = isTimeOverlapping(
      selectedFromTime,
      selectedToTime,
      workingStart,
      workingEnd,
    );

    if (hasOverlap) {
      setHasWorkingHoursOverlap(true);

      Toast.show({
        type: "error",
        text1: "Invalid Overtime",
        text2: "Overtime hours should not overlap with working hours",
      });

      setSelectedFromTime(getMidnight());
      setSelectedToTime(getMidnight());

      setHours(0);
      setAmount(0);

      return;
    }

    setHasWorkingHoursOverlap(false);

    // Calculate overtime duration in minutes.
    let durationMinutes =
      getMinutes(selectedToTime) - getMinutes(selectedFromTime);

    // Support overnight overtime.
    if (durationMinutes < 0) {
      durationMinutes += 1440;
    }

    const calculatedHours = Number((durationMinutes / 60).toFixed(2));

    setHours(calculatedHours);

    // Calculate amount using the hourly overtime rate.
    const hourlyRate = Number(overtimePolicy?.overtime_pay || 0);

    const calculatedAmount = Number((calculatedHours * hourlyRate).toFixed(2));

    setAmount(calculatedAmount);
  }, [selectedFromTime, selectedToTime, overtimePolicy]);

  const handleAddOvertime = async () => {
    if (!selectedDate) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Date is required",
      });
      return;
    }

    // Check overlap before proceeding.
    if (
      hasWorkingHoursOverlap ||
      (getMinutes(selectedFromTime) !== 0 &&
        getMinutes(selectedToTime) !== 0 &&
        overtimePolicy?.start_time &&
        overtimePolicy?.end_time &&
        isTimeOverlapping(
          selectedFromTime,
          selectedToTime,
          overtimePolicy.start_time,
          overtimePolicy.end_time,
        ))
    ) {
      Toast.show({
        type: "error",
        text1: "Invalid Overtime",
        text2: "Overtime hours should not overlap with working hours",
      });
      return;
    }

    // Require both times.
    if (
      getMinutes(selectedFromTime) === 0 ||
      getMinutes(selectedToTime) === 0
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please select overtime start and end time",
      });
      return;
    }

    if (hours <= 0) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Overtime hours must be greater than zero",
      });
      return;
    }

    const formatTime = (date) => {
      return `${String(date.getHours()).padStart(2, "0")}:${String(
        date.getMinutes(),
      ).padStart(2, "0")}:00`;
    };

    const formatDate = (date) => {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0",
      )}-${String(date.getDate()).padStart(2, "0")}`;
    };
    let fk_asset = "";
    if (selectedMedia.length > 0) {
      try {
        const assetResponse = await uploadMedia(selectedMedia, projectId);
        if (assetResponse.status >= 200 && assetResponse.status < 300) {
          console.log("This is the assetResponse", assetResponse);
          fk_asset = assetResponse.data.result[0].id;
        }
      } catch (error) {
        if (error.response) {
          console.error("Response error:", error.response.data);
        } else if (error.request) {
          console.error("Network error:", error.request);
        } else {
          console.error("Request error:", error.message);
        }
        Toast.show({
          type: "error",
          text1: "Upload Failed",
          text2: "Failed to upload media",
        });
        return;
      }
    }

    const payload = {
      amount_paid: amount,
      end_time: formatTime(selectedToTime),
      hours: hours,
      overtime_date: formatDate(selectedDate),
      remarks: remark,
      start_time: formatTime(selectedFromTime),
    };
    if (selectedMedia.length > 0) {
      payload.fk_asset = fk_asset;
    }
    console.log("THese are the payload", payload);
    await addOvertime(setLoading, payload, onRefresh);
  };

  return (
    <BottomSheetModal
      ref={overtimeBottomSheetRef}
      snapPoints={[snapPoints]}
      enablePanDownToClose={true}
      enableBlurKeyboardOnGesture={false}
      enableContentPanningGesture={false}
      enableOverDrag={false}
      enableHandlePanningGesture={true}
      enableDynamicSizing={false}
      onAnimate={(fromIndex, toIndex) => {
        if (fromIndex === -1 && toIndex === 0) {
          dispatch(setIsSheetOpen(true));
        }
        if (fromIndex === 0 && toIndex === -1) {
          setTimeout(() => {
            console.log("Set to false from add leave");
            dispatch(setIsSheetOpen(false));
          }, [250]);
        }
      }}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.5}
          pressBehavior={"none"}
        />
      )}
      onDismiss={resetOvertimeBottomSheet}
    >
      <View
        style={{
          width: "100%",
          paddingHorizontal: SW(20),
          paddingTop: SH(12),
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            color: primaryColors.gray[900],
            ...body.sm.semiBold,
          }}
        >
          Add Overtime
        </Text>

        <TouchableOpacity onPress={closeOvertimeBottomSheet}>
          <CloseOutlineIcon
            fill={Colors.black_text_color}
            width={SW(16)}
            height={SH(16)}
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          marginVertical: 16,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderColor: Colors.gray_line_color,
        }}
      />

      <BottomSheetScrollView
        style={{
          flex: 1,
          paddingHorizontal: 20,
        }}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          paddingBottom: SH(60),
        }}
      >
        <View style={styles.dateRangeRow}>
          <View style={styles.dateRangeColumn}>
            <Text style={styles.dateRangeLabel}>Overtime Date</Text>

            <DatePicker
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              placeholder="Due Date"
              showDatePicker={showDatePicker}
              setShowDatePicker={setShowDatePicker}
            />
          </View>
        </View>

        <Spacing space={SH(16)} />

        <View style={styles.dateRangeRow}>
          <View style={styles.dateRangeColumn}>
            <Text style={styles.dateRangeLabel}>Start Time</Text>

            <TimePicker
              selectedTime={selectedFromTime}
              setSelectedTime={setSelectedFromTime}
              placeholder="Due Time"
              showTimePicker={showFromTimePicker}
              setShowTimePicker={setShowFromTimePicker}
            />
          </View>

          <View style={styles.dateRangeColumn2}>
            <Text style={styles.dateRangeLabel}>End Time</Text>

            <TimePicker
              selectedTime={selectedToTime}
              setSelectedTime={setSelectedToTime}
              placeholder="Due Time"
              showTimePicker={showToTimePicker}
              setShowTimePicker={setShowToTimePicker}
            />
          </View>
        </View>

        <Spacing space={SH(16)} />

        <Text style={formElementsStyles.titleStyle}>Total Hours *</Text>

        <Spacing space={SH(6)} />

        <Input
          placeholder="Enter Hours"
          onChangeText={() => {}}
          value={String(hours)}
          readOnly={true}
          placeholderTextColor={formElementsStyles.placeholderColor}
          containerStyle={formElementsStyles.triggerStyle}
          inputContainerStyle={formElementsStyles.inputContainerStyle}
          inputStyle={formElementsStyles.valueStyle}
          keyboardType="numeric"
        />

        <Spacing space={SH(16)} />

        <Text style={formElementsStyles.titleStyle}>Overtime Amount *</Text>

        <Spacing space={SH(6)} />

        <Input
          placeholder="Enter Amount"
          value={String(amount)}
          readOnly={true}
          placeholderTextColor={formElementsStyles.placeholderColor}
          containerStyle={formElementsStyles.triggerStyle}
          inputContainerStyle={formElementsStyles.inputContainerStyle}
          inputStyle={formElementsStyles.valueStyle}
          keyboardType="numeric"
        />

        <Spacing space={SH(16)} />

        <Text style={formElementsStyles.titleStyle}>Remarks</Text>

        <Spacing space={SH(5)} />

        <TranscriptionInput
          value={remark}
          usesBottomSheet={false}
          onChangeText={setRemark}
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
          }}
          onTranscriptionError={(error) => {
            console.error("Transcription error:", error);
          }}
        />

        {selectedMedia.length < 1 && (
          <>
            <Spacing space={SH(16)} />

            <Text style={formElementsStyles.titleStyle}>Attach Files</Text>

            <Spacing space={SH(8)} />

            <TouchableOpacity
              style={formElementsStyles.attachFilesTriggerStyle}
              onPress={handleSelectMedia}
            >
              <UploadCloudOutline
                width={SW(24)}
                height={SH(24)}
                stroke={primaryColors.button.active}
                strokeWidth={SW(2)}
              />

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: SW(6),
                }}
              >
                <Text style={formElementsStyles.attachFilesPlaceholderStyle1}>
                  Click here
                </Text>

                <Text style={formElementsStyles.attachFilesPlaceholderStyle2}>
                  to upload
                </Text>
              </View>
            </TouchableOpacity>
          </>
        )}

        <Spacing space={SH(16)} />

        <RenderMedia
          selectedMedia={selectedMedia}
          imageSize={SW(80)}
          handleDeleteMedia={handleDeleteMedia}
        />

        <Spacing space={SH(16)} />
      </BottomSheetScrollView>

      <View style={formElementsStyles.bottomButtonContainer}>
        <BottomButton
          title="Cancel"
          onPress={closeOvertimeBottomSheet}
          type="outlined"
        />

        <BottomButton
          icon={
            loading.addingOvertime && (
              <ActivityIndicator size={12} color={Colors.white} />
            )
          }
          disabled={loading.addingOvertime}
          title="Add Overtime"
          onPress={handleAddOvertime}
          type="default"
        />
      </View>
    </BottomSheetModal>
  );
};

export default AddOvertimeBottomSheet;

const styles = StyleSheet.create({
  taskTypeContainer: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
    borderColor: primaryColors.gray[300],
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  container: {
    width: "100%",
    borderWidth: 0,
  },
  dropdown: {
    height: 50,
    ...InputTextStyles.input,
  },
  placeholderStyle: {
    fontSize: SF(12),
    backgroundColor: Colors.theme_background,
    color: Colors.gray_text_color,
  },
  selectedTextStyle: {
    fontSize: SF(12),
    color: Colors.gray_text_color,
    fontFamily: "Inter-Regular",
    backgroundColor: Colors.theme_background,
  },
  selectedStyle: {
    backgroundColor: "transparent",
    borderRadius: 16,
    overflow: "hidden",
  },
  containerStyle: {
    borderRadius: 16,
    backgroundColor: Colors.white,
    borderWidth: 0,
  },
  item: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    paddingVertical: SH(10),
    paddingHorizontal: SW(10),
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray_line_color,
    backgroundColor: Colors.theme_background,
  },
  searchStyle: {
    borderRadius: 10,
    borderColor: Colors.primary,
    height: 40,
    fontSize: SF(12),
    color: Colors.gray_text_color,
    fontFamily: "Inter-Regular",
  },
  uploadButtonText: {
    fontSize: SF(12),
    color: Colors.gray_text_color,
    fontFamily: "Inter-Regular",
  },
  fileContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.gray_line_color,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  selectedFileText: {
    marginTop: SH(5),
    fontSize: SF(14),
    color: Colors.black,
  },
  fileList: {
    marginTop: 0,
  },
  fileName: {
    fontSize: SF(12),
    color: Colors.primary,
    fontFamily: "Inter-Regular",
    marginTop: 0,
    flex: 1,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 0,
    marginBottom: 4,
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F3FD",
    borderColor: Colors.primary,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 2,
    marginRight: 2,
    gap: 8,
    height: 28,
    display: "flex",
  },
  chipText: {
    fontSize: 11,
    color: Colors.primary,
    fontFamily: "Inter-Regular",
  },
  chipClose: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "bold",
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dropdownItemText: {
    fontSize: 14,
  },
  checkMark: {
    fontSize: 14,
    color: "green",
  },
  imagex: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  dateRangeRow: {
    flexDirection: "row",
    gap: SW(12),
  },
  dateRangeColumn: {
    flex: 1,
    position: "relative",
    zIndex: 1000,
  },
  dateRangeColumn2: {
    flex: 1,
    position: "relative",
    zIndex: 100,
  },
  dateRangeLabel: {
    ...body.sm.medium,
    color: primaryColors.gray[700],
    marginBottom: 4,
  },
});

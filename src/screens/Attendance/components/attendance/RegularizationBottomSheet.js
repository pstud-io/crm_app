import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  TextInput,
  Alert,
  I18nManager,
} from "react-native";
import {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { useState, useCallback, useEffect } from "react";
import { Colors, SW, SH, formatTime12Hour } from "../../../../utils";
import { CloseOutlineIcon } from "../../../../svg";
import {
  regularizationBottomSheetRef,
  closeRegularizationBottomSheet,
  dateRefForRegularization,
  regularizationDataRef,
} from "../../utils/attendance/punchoutBottomSheetService";
import { body as typography } from "../../../../components/UI/DesignSystem/typography";
import { primaryColors } from "../../../../components/UI/DesignSystem/colorPalette";
import { formElementsStyles } from "../../../../components/UI/Dropdown/formElementStyles";
import { Spacing } from "../../../../components/common";
import { BottomButton } from "../../../../components/UI/GeneralComponents/BottomButton";
import { useAttendanceEndpoints } from "../../hooks/useAttendanceEndpoints";
import useKeyboardStatus from "../../../../hooks/useKeyboardStatus";
import { useKeyboard } from "@react-native-community/hooks";
import Toast from "react-native-toast-message";
import { Badge } from "../../../../components/UI/Badge/Badge";
import badgeColors from "../../../../components/UI/Badge/badgeColors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TranscriptionInput } from "../../../../components";
import { TimePicker } from "../../../../components/UI/GeneralComponents/TimePicker";
import { useDispatch } from "react-redux";
import { setIsSheetOpen } from "@/store/slices/isSheetOpenSlice";

const RegularlizationBottomSheet = ({ onRefresh }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      console.log("Run cleanup of regularization");
      dispatch(setIsSheetOpen(false));
    };
  }, []);
  const [item, setSheetItem] = useState(null);
  const [isPunchOut, setSheetIsPunchOut] = useState(false);
  const [date, setSheetDate] = useState(null);

  const [punchOutTime, setPunchOutTime] = useState(null);
  const [punchInTime, setPunchInTime] = useState(null);
  const [originalPunchInTime, setOriginalPunchInTime] = useState(null);
  const [showPunchInTimePicker, setShowPunchInTimePicker] = useState(false);
  const [showPunchOutTimePicker, setShowPunchOutTimePicker] = useState(false);
  const [timeDifference, setTimeDifference] = useState(null);
  const [requestDate, setRequestDate] = useState(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const { handleRegularlizationRequest } = useAttendanceEndpoints();
  const isKeyboardVisible = useKeyboardStatus();
  const keyboard = useKeyboard();

  const getOrdinalDate = (date) => {
    if (!date || isNaN(new Date(date).getTime())) return "";

    const d = new Date(date);
    const day = d.getDate();
    const year = d.getFullYear();
    const month = d.toLocaleDateString("en-GB", { month: "long" });

    const suffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${day}${suffix(day)} ${month} ${year}`;
  };

  const mergeDateAndTime = (baseDate, time) => {
    const merged = new Date(baseDate);
    merged.setHours(time.getHours());
    merged.setMinutes(time.getMinutes());
    merged.setSeconds(0);
    merged.setMilliseconds(0);
    return merged;
  };

  const calculateTimeDifference = (start, end) => {
    if (!start || !end) return null;
    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0) return null;
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const isPunchOutValid = (punchIn, punchOut) => {
    if (!punchIn || !punchOut) return false;
    return punchOut.getTime() > punchIn.getTime();
  };

  const isSameDay = (start, end) => {
    if (!start) return;
    if (!end) return;
    return start.toDateString() === end.toDateString();
  };

  const resetRegularlizationBottomSheet = () => {
    setNote("");
    setPunchOutTime(null);
    setPunchInTime(null);
    setShowPunchInTimePicker(false);
    setShowPunchOutTimePicker(false);
    setLoading(false);
    setTimeDifference(null);
    setSheetItem(null);
    setSheetIsPunchOut(false);
    setSheetDate(null);
  };

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior={"none"}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={regularizationBottomSheetRef}
      snapPoints={[isKeyboardVisible ? "100%" : "75%"]}
      enableBlurKeyboardOnGesture={false}
      enableContentPanningGesture={false}
      enableOverDrag={false}
      enablePanDownToClose={true}
      enableHandlePanningGesture={true}
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      onDismiss={resetRegularlizationBottomSheet}
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
      onChange={(index) => {
        if (index === 0) {
          const data = regularizationDataRef?.current;
          setSheetItem(data?.item || null);
          setSheetIsPunchOut(data?.isPunchOut || false);
          setSheetDate(data?.date || null);
          setRequestDate(getOrdinalDate(data?.date));

          if (
            data?.isPunchOut &&
            data?.item?.punch_in_time &&
            data?.item?.date
          ) {
            const [hour, minute] = data.item.punch_in_time.split(":");
            const combinedDateTime = new Date(data.item.date);
            combinedDateTime.setHours(parseInt(hour));
            combinedDateTime.setMinutes(parseInt(minute));
            combinedDateTime.setSeconds(0);
            setPunchInTime(combinedDateTime);
            setOriginalPunchInTime(combinedDateTime);
          } else {
            const merged = mergeDateAndTime(data?.date, new Date());
            setPunchInTime(merged);
            setPunchOutTime(merged);
          }
        }
      }}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Attendance Regularization - {requestDate || ""}
        </Text>
        <TouchableOpacity onPress={() => closeRegularizationBottomSheet()}>
          <CloseOutlineIcon
            fill={Colors.black_text_color}
            width={SW(16)}
            height={SH(16)}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
      <BottomSheetScrollView
        style={styles.scroll}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: isKeyboardVisible
              ? keyboard.keyboardHeight - SH(60)
              : SH(20),
          },
        ]}
      >
        <View style={styles.timeRow}>
          <View style={styles.inputColumn}>
            <Text style={styles.fieldLabel}>Punch In Time</Text>
            {Platform.OS === "ios" ? (
              isPunchOut ? (
                <TouchableOpacity
                  onPress={() => {
                    Toast.show({
                      type: "info",
                      text1: "Information",
                      text2:
                        "Punch-in time is already recorded and cannot be changed for this request.",
                    });
                  }}
                  style={styles.triggerStyle}
                >
                  <Text
                    style={[
                      styles.triggerText,
                      { color: primaryColors.gray[500] },
                    ]}
                  >
                    {punchInTime
                      ? punchInTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TimePicker
                  onChange={(event, time) => {
                    setShowPunchInTimePicker(false);
                    if (!isPunchOutValid(time, punchOutTime)) {
                      Alert.alert(
                        "Invalid Time",
                        "Punch out time cannot be before punch in time. Please change punch out first",
                      );
                      setPunchInTime(punchInTime);
                      return;
                    }
                    if (time) {
                      const merged = mergeDateAndTime(date, time);
                      setPunchInTime(merged);
                    }
                  }}
                  isRegularization={true}
                  selectedTime={punchInTime ? punchInTime : new Date()}
                />
              )
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => {
                    if (isPunchOut) {
                      Toast.show({
                        type: "info",
                        text1: "Information",
                        text2:
                          "Punch-in time is already recorded and cannot be changed for this request.",
                      });
                    } else {
                      setShowPunchInTimePicker(true);
                    }
                  }}
                  style={[
                    styles.triggerStyle,
                    isPunchOut && { backgroundColor: primaryColors.gray[50] },
                  ]}
                >
                  <Text
                    style={[
                      styles.triggerText,
                      isPunchOut && { color: primaryColors.gray[500] },
                    ]}
                  >
                    {punchInTime
                      ? punchInTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Select Punch In"}
                  </Text>
                </TouchableOpacity>
                {showPunchInTimePicker && (
                  <DateTimePicker
                    value={punchInTime ? punchInTime : new Date()}
                    mode="time"
                    display="default"
                    onValueChange={(event, time) => {
                      setShowPunchInTimePicker(false);
                      if (!isPunchOutValid(time, punchOutTime)) {
                        Alert.alert(
                          "Invalid Time",
                          "Punch out time cannot be before punch in time. Please change punch out first",
                        );
                        setPunchInTime(punchInTime);
                        return;
                      }
                      if (time) {
                        const merged = mergeDateAndTime(date, time);
                        setPunchInTime(merged);
                      }
                    }}
                  />
                )}
              </>
            )}
          </View>

          <View style={styles.inputColumn}>
            <Text style={styles.fieldLabel}>Punch Out Time</Text>
            {Platform.OS === "ios" ? (
              <TimePicker
                isRegularization={true}
                onChange={(event, time) => {
                  setShowPunchOutTimePicker(false);
                  if (!punchInTime) {
                    Alert.alert(
                      "Punch In Required",
                      "Please select punch in time first.",
                    );
                    const merged = mergeDateAndTime(date, new Date());
                    setPunchInTime(merged);
                    setPunchOutTime(merged);
                    return;
                  }
                  if (time) {
                    const merged = mergeDateAndTime(date, time);
                    if (!isSameDay(punchInTime, merged)) {
                      Alert.alert(
                        "Invalid Time",
                        "Punch out must be within the same day.",
                      );
                      const merged = mergeDateAndTime(date, new Date());
                      setPunchInTime(merged);
                      setPunchOutTime(merged);
                      return;
                    }
                    if (!isPunchOutValid(punchInTime, merged)) {
                      Alert.alert(
                        "Invalid Time",
                        "Punch out time cannot be before punch in time.",
                      );
                      const merged = mergeDateAndTime(date, new Date());
                      if (!isPunchOut) {
                        setPunchInTime(merged);
                      }
                      setPunchOutTime(merged);
                      return;
                    }
                    setPunchOutTime(merged);
                    setTimeDifference(
                      calculateTimeDifference(punchInTime, merged),
                    );
                  }
                }}
                selectedTime={punchOutTime ?? new Date()}
              />
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => setShowPunchOutTimePicker(true)}
                  style={styles.triggerStyle}
                >
                  <Text
                    style={[
                      styles.triggerText,
                      !punchOutTime && styles.placeholderColor,
                    ]}
                  >
                    {punchOutTime
                      ? punchOutTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Select Punch Out"}
                  </Text>
                </TouchableOpacity>
                {showPunchOutTimePicker && (
                  <DateTimePicker
                    value={punchOutTime ?? new Date()}
                    mode="time"
                    display="default"
                    onValueChange={(event, time) => {
                      setShowPunchOutTimePicker(false);
                      if (time) {
                        const merged = mergeDateAndTime(date, time);
                        if (!isSameDay(punchInTime, merged)) {
                          Alert.alert(
                            "Invalid Time",
                            "Punch out must be within the same day.",
                          );
                          const merged = mergeDateAndTime(date, new Date());
                          setPunchInTime(merged);
                          setPunchOutTime(merged);
                          return;
                        }
                        if (!isPunchOutValid(punchInTime, merged)) {
                          Alert.alert(
                            "Invalid Time",
                            "Punch out time cannot be before punch in time.",
                          );
                          const merged = mergeDateAndTime(date, new Date());
                          setPunchInTime(merged);
                          setPunchOutTime(merged);
                          return;
                        }
                        setPunchOutTime(merged);
                        setTimeDifference(
                          calculateTimeDifference(punchInTime, merged),
                        );
                      }
                    }}
                  />
                )}
              </>
            )}
          </View>
        </View>
        <Spacing space={SH(16)} />
        <Text style={styles.fieldLabel}>Reason for Regularization</Text>
        <Spacing space={SH(8)} />
        <TranscriptionInput
          value={note}
          usesBottomSheet={false}
          onChangeText={setNote}
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
        <Spacing space={SH(16)} />
        <View style={styles.durationRow}>
          <Text style={styles.fieldLabel}>Total Working Hours</Text>
          <Badge
            color={badgeColors.blueGray}
            text={timeDifference || "0"}
            size={"lg"}
            border={true}
          />
        </View>
        <Spacing space={SH(16)} />
      </BottomSheetScrollView>
      <View style={formElementsStyles.bottomButtonContainer}>
        <BottomButton
          title="Cancel"
          onPress={() => closeRegularizationBottomSheet()}
          type={"outlined"}
        />
        <BottomButton
          icon={loading && <ActivityIndicator size={12} color={Colors.white} />}
          disabled={loading}
          title="Submit"
          onPress={async () => {
            if (!punchInTime || !punchOutTime) {
              Toast.show({
                type: "error",
                text1: "Validation Error",
                text2: !punchInTime
                  ? "Please enter punch in time"
                  : "Please enter punch out time",
              });
              return;
            }
            await handleRegularlizationRequest(
              setLoading,
              onRefresh,
              punchInTime,
              punchOutTime,
              date,
              note,
            );
          }}
          type={"default"}
        />
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: SW(20),
    paddingTop: SH(12),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: primaryColors.gray[900],
    ...typography.sm.semiBold,
    includeFontPadding: false,
  },
  divider: {
    marginVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.gray_line_color,
  },
  scroll: { flex: 1, paddingHorizontal: 20 },
  scrollContent: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  inputColumn: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: SH(8),
    minWidth: "48%",
  },
  fieldLabel: {
    ...formElementsStyles.titleStyle,
    includeFontPadding: false,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  triggerStyle: {
    ...formElementsStyles.triggerStyle,
    width: "100%",
    justifyContent: "center",
  },
  triggerText: {
    ...formElementsStyles.valueStyle,
    includeFontPadding: false,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  placeholderColor: { color: primaryColors.gray[400] },
  textInput: {
    width: "100%",
    includeFontPadding: false,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: SH(16),
    width: "100%",
  },
});

export default RegularlizationBottomSheet;

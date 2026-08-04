import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  TextInput,
} from "react-native";
import {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { useState, useEffect } from "react";
import { Colors, SW, SH, formatTime12Hour } from "../../../../utils";
import { CloseOutlineIcon, ReloadOutline } from "../../../../svg";
import {
  punchOutBottomSheetRef,
  closePunchOutBottomSheet,
} from "../../utils/attendance/punchoutBottomSheetService";
import { body } from "../../../../components/UI/DesignSystem/typography";
import { primaryColors } from "../../../../components/UI/DesignSystem/colorPalette";
import { formElementsStyles } from "../../../../components/UI/Dropdown/formElementStyles";
import { Spacing } from "../../../../components/common";
import { BottomButton } from "../../../../components/UI/GeneralComponents/BottomButton";
import { useAttendanceEndpoints } from "../../hooks/useAttendanceEndpoints";
import useKeyboardStatus from "../../../../hooks/useKeyboardStatus";
import { useKeyboard } from "@react-native-community/hooks";
import Toast from "react-native-toast-message";
import { timeToSeconds } from "../../utils/attendance/attendanceGeneralFunctions";
import { Badge } from "../../../../components/UI/Badge/Badge";
import badgeColors from "../../../../components/UI/Badge/badgeColors";
import { InputTextStyles } from "../../../../styles/InputTextStyles";
import { useSelector } from "react-redux";
import { TranscriptionInput } from "../../../../components";
import { useNavigation } from "@react-navigation/native";
import { useCameraScreen } from "../../../../hooks/useCameraScreen";
import { RenderMedia } from "../../../../components/UI/GeneralComponents/RenderMedia";

const PunchOutBottomSheet = ({
  loading,
  setLoading,
  onRefresh,
  latestAttendance,
}) => {
  const [punchOutTime, setPunchOutTime] = useState("");
  const [timeDifference, setTimeDifference] = useState("");
  const [note, setNote] = useState("");
  const { handlePunchOutPress } = useAttendanceEndpoints();
  const isKeyboardVisible = useKeyboardStatus();
  const token = useSelector((state) => state.auth.token);
  const organization_id = useSelector((state) => state.profile.organization_id);
  const keyboard = useKeyboard();
  const snapPoints = isKeyboardVisible ? "100%" : "80%";
  const organizationDetails = useSelector(
    (state) => state.profile.organization_details,
  );
  const [selectedMedia, setSelectedMedia] = useState([]);
  const navigation = useNavigation();
  const { handleCaptureMedia, handleDeleteMedia } = useCameraScreen({
    setSelectedMedia,
  });
  useEffect(() => {
    const punchInSeconds = timeToSeconds(latestAttendance?.punch_in_time);

    // ⛔ DO NOTHING until punchInTime is valid
    if (punchInSeconds === null) return;

    const updateTime = () => {
      const now = new Date();

      // ---- Punch out time (correct) ----
      const h = now.getHours();
      const m = now.getMinutes();
      const s = now.getSeconds();

      setPunchOutTime(
        `${h % 12 || 12}:${String(m).padStart(2, "0")}:${String(s).padStart(
          2,
          "0",
        )} ${h >= 12 ? "PM" : "AM"}`,
      );

      // ---- Time difference ----
      const currentSeconds = h * 3600 + m * 60 + s;
      const diff = Math.max(currentSeconds - punchInSeconds, 0);

      const dh = Math.floor(diff / 3600);
      const dm = Math.floor((diff % 3600) / 60);
      const ds = diff % 60;

      setTimeDifference(`${dh}h ${dm}m ${ds}s`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [latestAttendance]);

  const resetPunchOutBottomSheet = () => {
    console.log("In reset new Folder bottom sheet");
    setNote("");
    setPunchOutTime("");
    setTimeDifference("");
    setSelectedMedia([]);
  };

  return (
    <BottomSheetModal
      ref={punchOutBottomSheetRef}
      snapPoints={[snapPoints]}
      enablePanDownToClose={true}
      enableBlurKeyboardOnGesture={false}
      enableContentPanningGesture={false}
      enableOverDrag={false}
      enableHandlePanningGesture={true}
      enableDynamicSizing={false}
      onAnimate={(fromIndex, toIndex) => {
        if (fromIndex === -1 && toIndex === 0) {
          if (organizationDetails.attendance_self_asset_show) {
            handleCaptureMedia("picture");
          }
        }
      }}
      backdropComponent={(props) => {
        return (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0} // backdrop visible when sheet index >= 0
            disappearsOnIndex={-1} // hidden when index = -1
            opacity={0.5} // dim amount
          />
        );
      }}
      onDismiss={() => resetPunchOutBottomSheet()}
    >
      <View
        style={{
          width: "100%",
          paddingHorizontal: SW(20),
          paddingTop: SH(12),
          display: "flex",
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
          Punching Out
        </Text>
        <TouchableOpacity onPress={() => closePunchOutBottomSheet()}>
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
          topBorderColor: Colors.gray_line_color,
          topBorderWidth: StyleSheet.hairlineWidth,
        }}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          paddingBottom: isKeyboardVisible && keyboard.keyboardHeight - SH(60),
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              gap: SH(8),
              minWidth: "48%",
            }}
          >
            <Text style={formElementsStyles.titleStyle}>Punch In Time</Text>
            <TextInput
              value={formatTime12Hour(latestAttendance?.punch_in_time)}
              readOnly={true}
              style={[
                formElementsStyles.triggerStyle,
                formElementsStyles.valueStyle,
                formElementsStyles.inputContainerStyle,
                {
                  borderBottomWidth: SW(1),
                  backgroundColor: primaryColors.gray[100],
                  flexGrow: 1,
                },
              ]}
              placeholderTextColor={formElementsStyles.placeholderColor}
            />
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              gap: SH(8),
              minWidth: "48%",
            }}
          >
            <Text style={formElementsStyles.titleStyle}>Punch Out Time</Text>
            <TextInput
              value={punchOutTime}
              readOnly={true}
              style={[
                formElementsStyles.triggerStyle,
                formElementsStyles.valueStyle,
                formElementsStyles.inputContainerStyle,
                {
                  borderBottomWidth: SW(1),
                  backgroundColor: primaryColors.gray[100],
                },
              ]}
              placeholderTextColor={formElementsStyles.placeholderColor}
            />
          </View>
        </View>
        <Spacing space={SH(16)} />
        <Text style={formElementsStyles.titleStyle}>Work Completed</Text>
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
        {organizationDetails?.attendance_self_asset_show && (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              gap: SH(8),
              width: "100%",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: SH(16),
                width: "100%",
              }}
            >
              <Text style={formElementsStyles.titleStyle}>Selfie Attached</Text>
              <TouchableOpacity
                onPress={async () => {
                  setSelectedMedia([]);
                  await handleCaptureMedia("picture");
                  return;
                }}
              >
                <Badge
                  color={badgeColors.blueGray}
                  text={""}
                  iconRight={
                    <ReloadOutline
                      width={SH(12)}
                      height={SH(12)}
                      stroke={primaryColors.brand[1000]}
                      fill={primaryColors.brand[1000]}
                      strokeWidth={1}
                    />
                  }
                  size={"sm"}
                  border={true}
                />
              </TouchableOpacity>
            </View>
            <RenderMedia
              selectedMedia={selectedMedia}
              handleDeleteMedia={handleDeleteMedia}
              imageSize={SH(80)}
              hasDelete={false}
              style={{ flexGrow: 0 }}
            />
          </View>
        )}
        <Spacing space={SH(16)} />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: SH(16),
            width: "100%",
          }}
        >
          <Text style={formElementsStyles.titleStyle}>Total Working Hours</Text>
          <Badge
            color={badgeColors.blueGray}
            text={timeDifference}
            size={"lg"}
            border={true}
          />
        </View>
        <Spacing space={SH(16)} />
      </BottomSheetScrollView>
      <View style={formElementsStyles.bottomButtonContainer}>
        <BottomButton
          title={"Cancel"}
          onPress={() => closePunchOutBottomSheet()}
          type={"outlined"}
        />
        <BottomButton
          icon={
            loading.markingAttendance && (
              <ActivityIndicator size={12} color={Colors.white} />
            )
          }
          disabled={loading.markingAttendance}
          title={
            loading?.markingAttendance ? loading?.loadingText : "Punch Out"
          }
          onPress={async () => {
            // if (!note) {
            //   Toast.show({
            //     type: "error",
            //     text1: "Error",
            //     text2: "Please Enter progress",
            //     visibilityTime: 1000,
            //     autoHide: true,
            //   });
            //   return;
            // }
            await handlePunchOutPress(
              setLoading,
              onRefresh,
              note,
              selectedMedia,
            );
          }}
          type={"default"}
        />
      </View>
    </BottomSheetModal>
  );
};
export default PunchOutBottomSheet;

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  TextInput,
  Keyboard,
} from "react-native";
import {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { useState, useEffect } from "react";
import { Colors, SW, SH, formatTime12Hour } from "../../../../utils";
import {
  AttachOutlineIcon,
  CloseOutlineIcon,
  ReloadOutline,
} from "../../../../svg";
import {
  punchInBottomSheetRef,
  closePunchInBottomSheet,
  punchInBottomSheetExtraDataRef,
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
import { useDispatch, useSelector } from "react-redux";
import { TranscriptionInput } from "../../../../components";
import { useNavigation } from "@react-navigation/native";
import { useCameraScreen } from "../../../../hooks/useCameraScreen";
import { RenderMedia } from "../../../../components/UI/GeneralComponents/RenderMedia";
import { setIsSheetOpen } from "@/store/slices/isSheetOpenSlice";

const AfterPunchInBottomSheet = ({ loading, setLoading, onRefresh }) => {
  const [note, setNote] = useState("");
  const [attendanceID, setAttendanceID] = useState("");
  const isKeyboardVisible = useKeyboardStatus();
  const keyboard = useKeyboard();
  const snapPoints = isKeyboardVisible ? "100%" : "80%";
  const { savePunchInRemarks } = useAttendanceEndpoints();
  const [selectedMedia, setSelectedMedia] = useState([]);
  const { handleSelectMedia, handleDeleteMedia } = useCameraScreen({
    setSelectedMedia,
  });

  const resetPunchInBottomSheet = () => {
    setNote("");
    setSelectedMedia([]);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      console.log("Run cleanup of regularization");
      dispatch(setIsSheetOpen(false));
    };
  }, []);

  return (
    <BottomSheetModal
      ref={punchInBottomSheetRef}
      snapPoints={[snapPoints]}
      enablePanDownToClose={true}
      enableBlurKeyboardOnGesture={false}
      enableContentPanningGesture={false}
      enableOverDrag={false}
      enableHandlePanningGesture={true}
      enableDynamicSizing={false}
      onAnimate={(fromIndex, toIndex) => {
        if (fromIndex === -1 && toIndex === 0) {
          console.log("in on animate");
          const attendance_id = punchInBottomSheetExtraDataRef?.current;
          console.log("Attendace id is", attendance_id);
          setAttendanceID(attendance_id);
          dispatch(setIsSheetOpen(true));
        }
        if (fromIndex === 0 && toIndex === -1) {
          setTimeout(() => {
            console.log("Set to false from add leave");
            dispatch(setIsSheetOpen(false));
          }, [250]);
        }
      }}
      backdropComponent={(props) => {
        return (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0} // backdrop visible when sheet index >= 0
            disappearsOnIndex={-1} // hidden when index = -1
            opacity={0.5} // dim amount
            pressBehavior={"none"}
          />
        );
      }}
      onDismiss={() => resetPunchInBottomSheet()}
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
          Punch In remarks
        </Text>
        <TouchableOpacity onPress={() => closePunchInBottomSheet()}>
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
        <Text style={formElementsStyles.titleStyle}>Remarks</Text>
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
          rightIcon={
            <TouchableOpacity
              onPress={() => {
                handleSelectMedia();
                Keyboard.dismiss();
              }}
            >
              <AttachOutlineIcon
                width={SW(24)}
                height={SH(24)}
                stroke={primaryColors.brand[1000]}
                strokeWidth={0}
                color={primaryColors.brand[1000]}
              />
            </TouchableOpacity>
          }
        />
        {selectedMedia.length > 0 && (
          <>
            <Spacing space={SH(16)} />
            <RenderMedia
              selectedMedia={selectedMedia}
              imageSize={SW(80)}
              handleDeleteMedia={handleDeleteMedia}
            />
          </>
        )}
        <Spacing space={SH(16)} />
      </BottomSheetScrollView>
      <View style={formElementsStyles.bottomButtonContainer}>
        <BottomButton
          title={"Cancel"}
          onPress={() => closePunchInBottomSheet()}
          type={"outlined"}
        />
        <BottomButton
          icon={
            loading?.savingPunchInRemarks && (
              <ActivityIndicator size={12} color={Colors.white} />
            )
          }
          disabled={loading?.savingPunchInRemarks}
          title={loading?.savingPunchInRemarks ? "Saving" : "Save"}
          onPress={async () => {
            await savePunchInRemarks(
              setLoading,
              onRefresh,
              note,
              selectedMedia,
              attendanceID,
            );
            closePunchInBottomSheet();
          }}
          type={"default"}
        />
      </View>
    </BottomSheetModal>
  );
};
export default AfterPunchInBottomSheet;

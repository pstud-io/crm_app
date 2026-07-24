import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Keyboard,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { SW, SH, newDateToYYYYMMDD, dateToYYYYMMDD } from "../../../../utils";
import { body } from "../../DesignSystem/typography";
import { primaryColors } from "../../DesignSystem/colorPalette";
import { Spacing } from "../../../common";
import { BottomButton } from "../BottomButton";
import {
  CloseOutlineIcon,
  Checkbox,
  DownArrowOutlineIcon,
} from "../../../../svg";
import SelectionPopover from "./SelectionPopover";
import { formElementsStyles } from "../../Dropdown/formElementStyles";
import Toast from "react-native-toast-message";
import { DatePicker2 } from "../DatePicker2";
import { TranscriptionInput } from "@/components/specific";
import { borderRadius } from "@/design/borders";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const FollowUpCompletModal = ({
  visible,
  tasks,
  onClose,
  onConfirm,
  loading,
  setComment,
}) => {
  const [note, setNote] = useState("");
  const [pressed, setPressed] = useState("a");

  useEffect(() => {
    setComment(note);
  }, [note]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop} onPress={Keyboard.dismiss}>
        <View style={styles.popoverContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Extra Details</Text>
            <TouchableOpacity
              onPress={async () => {
                console.log("Run onclose from close icon");
                await onClose();
              }}
            >
              <CloseOutlineIcon
                fill={primaryColors.gray[400]}
                width={SW(18)}
                height={SH(18)}
              />
            </TouchableOpacity>
          </View>

          {/* BODY */}
          <ScrollView
            style={styles.listContainer}
            contentContainerStyle={{
              paddingHorizontal: SW(20),
              paddingBottom: SH(16),
              justifyContent: "center",
              height: "100%",
            }}
            keyboardShouldPersistTaps="handled"
          >
            <Spacing space={SH(16)} />
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
            />
          </ScrollView>

          {/* FOOTER */}
          <View style={styles.footer}>
            <BottomButton
              title="Submit and create new Follow Up"
              onPress={async () => {
                console.log("Run save and create button");
                setPressed("a");
                await onConfirm(true);
              }}
              type="outlined"
              style={{ paddingVertical: 8 }}
              icon={
                loading && pressed === "a" ? (
                  <ActivityIndicator size="small" color="black" />
                ) : null
              }
            />
            <BottomButton
              title="Submit"
              onPress={async () => {
                setPressed("b");
                await onConfirm(false);
              }}
              type="default"
              style={{ paddingVertical: 8 }}
              loading={loading}
              disabled={loading}
              icon={
                loading && pressed === "b" ? (
                  <ActivityIndicator size="small" color="white" />
                ) : null
              }
            />
          </View>
        </View>
      </View>
      {/* <Toast /> */}
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  popoverContainer: {
    width: SCREEN_WIDTH * 0.9,
    maxHeight: SCREEN_HEIGHT * 0.8,
    height: SCREEN_HEIGHT * 0.45,
    borderRadius: SW(16),
    backgroundColor: "white",
    overflow: "hidden",
  },
  innerContent: { width: "100%" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SW(20),
    paddingVertical: SH(16),
    backgroundColor: primaryColors.gray[25],
    borderBottomWidth: 1,
    borderBottomColor: primaryColors.gray[100],
  },
  headerTitle: { ...body.md.bold, color: primaryColors.gray[900] },
  instructionText: { ...body.sm.regular, color: primaryColors.gray[500] },
  listContainer: { flexShrink: 1 },
  fieldLabel: { ...body.sm.medium, color: primaryColors.gray[700] },
  inputField: {
    ...body.sm.regular,
    color: primaryColors.gray[900],
    height: SH(44),
    backgroundColor: primaryColors.gray[25],
  },
  percentageContainer: {
    alignItems: "center",
    backgroundColor: primaryColors.gray[25],
  },
  percentageSign: {
    ...body.sm.medium,
    color: primaryColors.gray[500],
    paddingHorizontal: SW(8),
  },
  selectTrigger: {
    flexDirection: "row",
    alignItems: "center",
    height: SH(44),
    backgroundColor: primaryColors.gray[25],
  },
  checkboxWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SH(8),
  },
  footer: {
    flexDirection: "column",
    gap: SW(12),
    padding: SW(20),
    borderTopWidth: 1,
    height: 160,
    borderTopColor: primaryColors.gray[100],
  },
});

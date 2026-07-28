import { RefObject, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import useKeyboardStatus from "@/hooks/useKeyboardStatus";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  callHistoryInitialState,
  setCallHistory,
} from "@/store/slices/callHistorySlice";
import { BottomButton } from "@/components/UI/GeneralComponents/BottomButton";
import { useTheme } from "@/hooks/useTheme";
import { useFormElementsStyles } from "@/hooks/useFormElementsStyles";
import { spacing } from "@/design/spacing";
import { body } from "@/design/typography";
import { CloseOutlineIcon } from "@/svg";
import { borderWidth } from "@/design/borders";
import { useKeyboard } from "@react-native-community/hooks";
import { formatDate, formatDuration } from "@/utils";
import { Spacing, TranscriptionInput } from "@/components";
import { useCallHistoryEndpoints } from "../hooks/useCallHistoryEndpoints";
import { callHistoryRefreshRef } from "../utils/callHistoryFunctions";

interface CallLogBottomSheetProps {
  callLogBottomSheetRef: RefObject<BottomSheetModal | null>;
  closeCallLogBottomSheet: () => void;
}

export default function CallLogBottomSheet({
  callLogBottomSheetRef,
  closeCallLogBottomSheet,
}: CallLogBottomSheetProps) {
  const { postCallHistory, callHistoryLoading } = useCallHistoryEndpoints();
  const keyboardVisible = useKeyboardStatus();
  const snapPoints = keyboardVisible ? ["100%"] : ["70%"];
  const [note, setNote] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const { theme } = useTheme();
  const keyboard = useKeyboard();
  const formElementsStyles = useFormElementsStyles();
  const dispatch = useDispatch();
  const callHistory = useSelector((state: RootState) => state.callHistory);
  console.log("Call history in bottom sheeet is", callHistory);

  const resetCallLogBottomSheet = () => {
    setNote("");
    setSubject("");
  };

  return (
    <BottomSheetModal
      snapPoints={snapPoints}
      ref={callLogBottomSheetRef}
      enableDynamicSizing={false}
      enableOverDrag={false}
      enablePanDownToClose={true}
      detached={false}
      enableContentPanningGesture={false}
      enableBlurKeyboardOnGesture={false}
      enableHandlePanningGesture={false}
      backdropComponent={(props) => {
        return (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0} // backdrop visible when sheet index >= 0
            disappearsOnIndex={-1} // hidden when index = -1
            opacity={0.5} // dim amount
            pressBehavior="none"
          />
        );
      }}
      onDismiss={async () => {
        resetCallLogBottomSheet();
        dispatch(setCallHistory({ ...callHistoryInitialState }));
        if (callHistoryRefreshRef.current) {
          await callHistoryRefreshRef.current.onRefresh();
          callHistoryRefreshRef.current = null;
        }
      }}
    >
      <View
        style={{
          width: "100%",
          paddingHorizontal: spacing.xl,
          paddingTop: spacing.md,
          paddingBottom: spacing.lg,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            color: theme.text,
            ...body.md.medium,
          }}
        >
          Add Call Log - {callHistory.client_phone}
        </Text>
        {/* <TouchableOpacity onPress={() => closeCallLogBottomSheet()}>
          <CloseOutlineIcon fill={theme.text} width={14} height={14} />
        </TouchableOpacity> */}
      </View>
      <BottomSheetScrollView
        style={{
          flex: 1,
          paddingHorizontal: spacing.xl,
          borderTopColor: theme.border,
          borderTopWidth: borderWidth.hw,
        }}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          paddingBottom: keyboardVisible ? keyboard.keyboardHeight - 60 : 0,
        }}
      >
        <Spacing
          space={16}
          horizontal={false}
          backgroundColor={"transparent"}
        />
        <View
          style={{
            width: "100%",
            backgroundColor: theme.background,
            borderWidth: borderWidth.hw,
            borderColor: theme.border,
            borderRadius: 12,
            padding: spacing.md,
            gap: spacing.sm,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={[
                body.sm.medium,
                {
                  color: theme.textSecondary,
                },
              ]}
            >
              Client
            </Text>
            <Text
              style={[
                body.sm.semiBold,
                {
                  color: theme.text,
                  flexShrink: 1,
                  textAlign: "right",
                },
              ]}
            >
              {callHistory.client_name || "-"}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={[
                body.sm.medium,
                {
                  color: theme.textSecondary,
                },
              ]}
            >
              Contaced On
            </Text>
            <Text
              style={[
                body.sm.medium,
                {
                  color: theme.primary,
                },
              ]}
            >
              {callHistory.contacted_on
                ? formatDate(callHistory.contacted_on)
                : "-"}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={[
                body.sm.medium,
                {
                  color: theme.textSecondary,
                },
              ]}
            >
              Call Duration
            </Text>
            <Text
              style={[
                body.sm.medium,
                {
                  color: theme.primary,
                },
              ]}
            >
              {formatDuration(callHistory.duration)}
            </Text>
          </View>

          <View
            style={{
              height: borderWidth.hw,
              backgroundColor: theme.border,
              marginVertical: spacing.xxs,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={[
                body.sm.medium,
                {
                  color: theme.textSecondary,
                },
              ]}
            >
              Lead
            </Text>
            <Text
              style={[
                body.sm.medium,
                {
                  color: theme.text,
                  flex: 1,
                  textAlign: "right",
                  marginLeft: spacing.md,
                },
              ]}
            >
              {callHistory.project_name || "-"}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={[
                body.sm.medium,
                {
                  color: theme.textSecondary,
                },
              ]}
            >
              Follow Up
            </Text>
            <Text
              style={[
                body.sm.medium,
                {
                  color: theme.text,
                  flex: 1,
                  textAlign: "right",
                  marginLeft: spacing.md,
                },
              ]}
            >
              {callHistory.task_name || "-"}
            </Text>
          </View>
        </View>
        {/* <Spacing
          space={16}
          horizontal={false}
          backgroundColor={"transparent"}
        />
        <Text style={formElementsStyles.titleStyle}>Subject *</Text>
        <Spacing space={8} horizontal={false} backgroundColor={"transparent"} />
        <TextInput
          defaultValue={subject}
          onChangeText={setSubject}
          placeholder="Enter Call Purpose"
          style={[
            formElementsStyles.triggerStyle,
            formElementsStyles.valueStyle,
            formElementsStyles.inputContainerStyle,
            {
              borderBottomWidth: 1,
            },
          ]}
          placeholderTextColor={formElementsStyles.placeholderColor}
        /> */}
        <Spacing
          space={16}
          horizontal={false}
          backgroundColor={"transparent"}
        />
        <Text style={formElementsStyles.titleStyle}>Details</Text>
        <Spacing space={8} horizontal={false} backgroundColor={"transparent"} />
        {/* @ts-ignore */}
        <TranscriptionInput
          value={note}
          usesBottomSheet={true}
          onChangeText={setNote}
          placeholder="Enter Call Details"
          placeholderTextColor={formElementsStyles.placeholderColor}
          containerStyle={formElementsStyles.descriptionTriggerStyle}
          inputStyle={formElementsStyles.valueStyle}
          hasIcon={true}
        />
        <Spacing space={16} horizontal={true} backgroundColor={"transparent"} />
      </BottomSheetScrollView>
      <View style={formElementsStyles.bottomButtonContainer}>
        {/* <BottomButton
          title={"Cancel"}
          onPress={() => {
            closeCallLogBottomSheet();
          }}
          type={"outlined"}
          disabled={callHistoryLoading.postCallHistory}
        /> */}
        <BottomButton
          title={
            callHistoryLoading.postCallHistory
              ? "Add call log..."
              : "Add Call Log"
          }
          onPress={async () => {
            const payload = {
              fk_project: callHistory.project_id,
              fk_task: callHistory.task_id,
              duration: callHistory.duration,
              context_value: note,
              subject: subject,
              contacted_on: callHistory.contacted_on,
            };
            await postCallHistory(payload);
            closeCallLogBottomSheet();
          }}
          type={"default"}
          disabled={callHistoryLoading.postCallHistory}
          style={{}}
          icon={
            callHistoryLoading.postCallHistory ? (
              <ActivityIndicator size={12} color={theme.textInverse} />
            ) : undefined
          }
        />
      </View>
    </BottomSheetModal>
  );
}

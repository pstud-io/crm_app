import {
  createRef,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  StyleSheet,
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
import { CloseOutlineIcon, DownArrowOutlineIcon } from "@/svg";
import { borderWidth } from "@/design/borders";
import { useKeyboard } from "@react-native-community/hooks";
import { Colors, formatDate, formatDuration, SF, SH, SW } from "@/utils";
import { Spacing, TranscriptionInput } from "@/components";
import { useCallHistoryEndpoints } from "../hooks/useCallHistoryEndpoints";
import { callHistoryRefreshRef } from "../utils/callHistoryFunctions";
import { setIsSheetOpen } from "@/store/slices/isSheetOpenSlice";
import { primaryColors } from "@/design/colors";
import { InputTextStyles } from "@/styles";
import { DatePicker } from "@/components/UI/GeneralComponents/DatePicker";
import { TimePicker } from "@/components/UI/GeneralComponents/TimePicker";
import { Dropdown } from "react-native-element-dropdown";
import { useGeneralEndpoints } from "@/hooks/useGeneralEndpoints";
import { RenderDataForDropdown } from "@/components/UI/GeneralComponents/RenderDataForDropdown";
import Toast from "react-native-toast-message";

export const callLogBottomSheetManualRef = createRef<BottomSheetModal>();
export const openCallLogBottomSheetManual = () => {
  callLogBottomSheetManualRef.current?.present();
};
export const closeCallLogBottomSheetManual = () => {
  callLogBottomSheetManualRef.current?.dismiss();
};

interface CallLogBottomSheetManualProps {
  onRefresh: () => Promise<void>;
}

export default function CallLogBottomSheetManual({
  onRefresh,
}: CallLogBottomSheetManualProps) {
  const { postCallHistory, callHistoryLoading } = useCallHistoryEndpoints();
  const selectedProject = useSelector((state: RootState) => state.project);
  const keyboardVisible = useKeyboardStatus();
  const snapPoints = keyboardVisible ? ["100%"] : ["70%"];
  const [project, setProject] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [client, setClient] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [hours, setHours] = useState<string>("");
  const [minutes, setMinutes] = useState<string>("");
  const [seconds, setSeconds] = useState<string>("");
  const { theme } = useTheme();
  const keyboard = useKeyboard();
  const formElementsStyles = useFormElementsStyles();
  const dispatch = useDispatch();
  const { getAllProjects } = useGeneralEndpoints();
  const [loading, setLoading] = useState({
    addingCallLog: false,
    fetchingProjects: false,
  });

  const resetCallLogBottomSheet = () => {
    setProject("");
    setClient("");
    setPhone("");
    setShowDatePicker(false);
    setShowTimePicker(false);
    setSelectedDate(new Date());
    setSelectedTime(new Date());
    setNote("");
    setSubject("");
    setAllProjects([]);
    setHours("");
    setMinutes("");
    setSeconds("");
  };

  useEffect(() => {
    return () => {
      console.log("Run cleanup of add project");
      dispatch(setIsSheetOpen(false));
    };
  }, []);

  return (
    <BottomSheetModal
      snapPoints={snapPoints}
      ref={callLogBottomSheetManualRef}
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
      onAnimate={async (fromIndex, toIndex) => {
        if (fromIndex === -1 && toIndex === 0) {
          dispatch(setIsSheetOpen(true));
          if (selectedProject?.id !== "all_projects") {
            setProject(selectedProject?.id!);
          }
          await getAllProjects(setLoading, setAllProjects);
        }
        if (fromIndex === 0 && toIndex === -1) {
          setTimeout(() => {
            console.log("Set to false from add project");
            dispatch(setIsSheetOpen(false));
          }, 250);
        }
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
          Add Call Log
        </Text>
        <TouchableOpacity onPress={() => closeCallLogBottomSheetManual()}>
          <CloseOutlineIcon fill={theme.text} width={14} height={14} />
        </TouchableOpacity>
      </View>
      <BottomSheetScrollView
        style={{
          flex: 1,
          paddingHorizontal: spacing.xl,
          borderTopColor: theme.border,
          borderTopWidth: borderWidth.hw,
        }}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          paddingBottom: keyboardVisible ? keyboard.keyboardHeight - 60 : 16,
        }}
      >
        {/* <Spacing
          space={16}
          horizontal={false}
          backgroundColor={"transparent"}
        /> */}
        {/* <View
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
        </View> */}
        <Spacing
          space={16}
          horizontal={false}
          backgroundColor={"transparent"}
        />
        <Text style={formElementsStyles.titleStyle}>Select Lead *</Text>
        <Spacing space={8} horizontal={false} backgroundColor={"transparent"} />
        <Dropdown
          mode="modal"
          iconStyle={{ display: "none" }}
          style={formElementsStyles.triggerStyle}
          placeholderStyle={formElementsStyles.placeholderStyle} // Placeholder font
          itemContainerStyle={
            formElementsStyles.dropdownOptionsItemContainerStyle
          }
          selectedTextStyle={formElementsStyles.valueStyle}
          searchPlaceholderTextColor={formElementsStyles.placeholderColor}
          containerStyle={formElementsStyles.dropdownOptionsContainerStyle}
          showsVerticalScrollIndicator={false}
          autoScroll={false}
          activeColor="transparent"
          inputSearchStyle={formElementsStyles.dropdownOptionsSearchStyle}
          labelField="project_name"
          data={allProjects}
          valueField="id"
          placeholder={
            loading.fetchingProjects ? "Fetching Leads..." : "Select Lead"
          }
          value={project}
          search
          searchPlaceholder="Find Lead"
          renderItem={(item, isSelected) => (
            <RenderDataForDropdown
              isSelected={isSelected}
              itemName={item.project_name}
            />
          )}
          onChange={(item) => {
            setProject(item.id);
          }}
          renderRightIcon={() =>
            loading.fetchingProjects ? (
              <ActivityIndicator size={12} color={Colors.gray_text_color} />
            ) : (
              <DownArrowOutlineIcon width={SH(16)} height={SH(16)} />
            )
          }
        />
        {/* <Spacing
          space={16}
          horizontal={false}
          backgroundColor={"transparent"}
        />
        <Text style={formElementsStyles.titleStyle}>Client Name *</Text>
        <Spacing space={8} horizontal={false} backgroundColor={"transparent"} />
        <TextInput
          defaultValue={client}
          onChangeText={setClient}
          placeholder="Enter Client Name"
          style={[
            formElementsStyles.triggerStyle,
            formElementsStyles.valueStyle,
            formElementsStyles.inputContainerStyle,
            {
              borderBottomWidth: 1,
            },
          ]}
          placeholderTextColor={formElementsStyles.placeholderColor}
        />
        <Spacing
          space={16}
          horizontal={false}
          backgroundColor={"transparent"}
        />
        <Text style={formElementsStyles.titleStyle}>Client Phone *</Text>
        <Spacing space={8} horizontal={false} backgroundColor={"transparent"} />
        <TextInput
          defaultValue={phone}
          onChangeText={setPhone}
          placeholder="Enter client phone"
          style={[
            formElementsStyles.triggerStyle,
            formElementsStyles.valueStyle,
            formElementsStyles.inputContainerStyle,
            {
              borderBottomWidth: 1,
            },
          ]}
          keyboardType="numeric"
          placeholderTextColor={formElementsStyles.placeholderColor}
        /> */}
        <Spacing
          space={16}
          horizontal={false}
          backgroundColor={"transparent"}
        />
        <View style={styles.dateRangeRow}>
          <View style={styles.dateRangeColumn}>
            <Text style={styles.dateRangeLabel}>Call Date</Text>
            <DatePicker
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              showDatePicker={showDatePicker}
              setShowDatePicker={setShowDatePicker}
              maxDate={undefined}
              minDate={undefined}
            />
          </View>
          <View style={styles.dateRangeColumn2}>
            <Text style={styles.dateRangeLabel}>Call Time</Text>
            <TimePicker
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              showTimePicker={showTimePicker}
              setShowTimePicker={setShowTimePicker}
              isRegularization={false}
              onChange={undefined}
              disabled={false}
            />
          </View>
        </View>
        <Spacing
          space={16}
          horizontal={false}
          backgroundColor={"transparent"}
        />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: SH(8),
              minWidth: "30%",
              maxWidth: "30%",
            }}
          >
            <Text
              style={{
                ...body.sm.medium,
                color: primaryColors.gray[600],
              }}
            >
              Duration
            </Text>
            <TextInput
              value={hours}
              onChangeText={setHours}
              keyboardType="numeric"
              placeholder="Hours"
              placeholderTextColor={formElementsStyles.placeholderColor}
              style={[
                formElementsStyles.triggerStyle,
                formElementsStyles.valueStyle,
                formElementsStyles.inputContainerStyle,
                formElementsStyles.bottomSheetInput,
              ]}
            />
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: SH(8),
              minWidth: "30%",
              maxWidth: "30%",
            }}
          >
            <Text
              style={{
                ...body.sm.medium,
                color: primaryColors.gray[600],
              }}
            ></Text>
            <TextInput
              value={minutes}
              onChangeText={(text) => {
                const num = parseInt(text, 10);

                if (text === "") {
                  setMinutes("");
                  return;
                }

                if (isNaN(num)) {
                  return;
                }

                if (num > 60) {
                  Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: "Minutes cannot be more than 60",
                  });
                  return;
                }

                setMinutes(text);
              }}
              keyboardType="numeric"
              placeholder="Minutes"
              placeholderTextColor={formElementsStyles.placeholderColor}
              style={[
                formElementsStyles.triggerStyle,
                formElementsStyles.valueStyle,
                formElementsStyles.inputContainerStyle,
                formElementsStyles.bottomSheetInput,
              ]}
            />
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: SH(8),
              minWidth: "30%",
              maxWidth: "30%",
            }}
          >
            <Text
              style={{
                ...body.sm.medium,
                color: primaryColors.gray[600],
              }}
            ></Text>
            <TextInput
              value={seconds}
              onChangeText={(text) => {
                const num = parseInt(text, 10);

                if (text === "") {
                  setSeconds("");
                  return;
                }

                if (isNaN(num)) {
                  return;
                }

                if (num > 60) {
                  Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: "Seconds cannot be more than 60",
                  });
                  return;
                }

                setSeconds(text);
              }}
              keyboardType="numeric"
              placeholder="Seconds"
              placeholderTextColor={formElementsStyles.placeholderColor}
              style={[
                formElementsStyles.triggerStyle,
                formElementsStyles.valueStyle,
                formElementsStyles.inputContainerStyle,
                formElementsStyles.bottomSheetInput,
              ]}
            />
          </View>
        </View>
        <Spacing
          space={16}
          horizontal={false}
          backgroundColor={"transparent"}
        />
        <Text style={formElementsStyles.titleStyle}>Subject</Text>
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
        />
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
        <BottomButton
          title={"Cancel"}
          onPress={() => {
            closeCallLogBottomSheetManual();
          }}
          type={"outlined"}
          disabled={callHistoryLoading.postCallHistory}
        />
        <BottomButton
          title={
            callHistoryLoading.postCallHistory
              ? "Add call log..."
              : "Add Call Log"
          }
          onPress={async () => {
            if (!project) {
              Toast.show({
                type: "error",
                text1: "Error",
                text2: "Lead is required",
              });
            }
            const date = new Date(selectedDate);
            const time = new Date(selectedTime);

            date.setHours(
              time.getHours(),
              time.getMinutes(),
              time.getSeconds(),
              time.getMilliseconds(),
            );
            const payload = {
              fk_project: project,
              fk_task: "",
              duration:
                Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds),
              context_value: note,
              subject: subject,
              contact_on: date.toISOString(),
            };
            await postCallHistory(payload);
            closeCallLogBottomSheetManual();
            await onRefresh();
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

const styles = StyleSheet.create({
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

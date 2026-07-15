import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  I18nManager,
  StyleSheet,
  Platform,
  Keyboard,
  FlatList,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";
import axios from "axios";

// --- HOOKS & HELPERS ---
import { useAddTaskEndpoints } from "./useAddTaskEndpoints";
import { useCustomFieldEndpoints } from "../../hooks/useCustomFieldEndpoints";
import apiEndpoint from "../../config/apiConfig";

// --- UI COMPONENTS ---
import SelectionPopover from "../../components/UI/GeneralComponents/PopUps/SelectionPopover";
import { Spacing } from "../../components/common";
import { BottomButton } from "../../components/UI/GeneralComponents/BottomButton";
import { formElementsStyles } from "../../components/UI/Dropdown/formElementStyles";
import { Badge } from "../../components/UI/Badge/Badge";
import badgeColors from "../../components/UI/Badge/badgeColors";
import {
  AttachOutlineIcon,
  CloseOutlineIcon,
  DownArrowOutlineIcon,
} from "../../svg";
import { SW, SH } from "../../utils";
import { primaryColors } from "../../components/UI/DesignSystem/colorPalette";
import { CustomFiledEditVersion } from "../../components/UI/GeneralComponents/CustomFiledEditVersion";
import { TranscriptionInput } from "../../components";
import { TimePicker } from "../../components/UI/GeneralComponents/TimePicker";
import { DatePicker } from "../../components/UI/GeneralComponents/DatePicker";
import { body } from "../../components/UI/DesignSystem/typography";
import { useCameraScreen } from "../../hooks/useCameraScreen";
import { RenderMedia } from "../../components/UI/GeneralComponents/RenderMedia";
import { RenderMediaItem } from "../../components/UI/GeneralComponents/RenderMediaItem";
import { useGeneralEndpoints } from "../../hooks/useGeneralEndpoints";
import { setActiveSubButtonGlobal } from "@/store/slices/activeSubButtonGlobal";

const EditTask = ({ navigation, route }) => {
  const { task, onRefresh } = route.params;
  const dispatch = useDispatch();
  console.log("Task to edit is ", task);
  const token = useSelector((state) => state.auth.token);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const { organization_id } = useSelector((state) => state.profile);
  const { handleSelectMedia, handleDeleteMedia } = useCameraScreen({
    setSelectedMedia,
  });
  const { uploadMedia } = useGeneralEndpoints();
  const { getContacts } = useAddTaskEndpoints();
  const {
    getCustomFields,
    saveCustomFieldItemValue,
    updateCustomFieldItemValue,
  } = useCustomFieldEndpoints();

  // --- 1. FORM STATES ---
  const [noteTitle, setNoteTitle] = useState(task?.title || "");
  const [note, setNote] = useState(task?.description || "");
  const apiDate = task?.due_date ? new Date(task.due_date) : new Date();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const mediaCarouselRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date(
      apiDate.getUTCFullYear(),
      apiDate.getUTCMonth(),
      apiDate.getUTCDate(),
    ),
  );

  const [selectedTime, setSelectedTime] = useState(
    new Date(
      apiDate.getUTCFullYear(),
      apiDate.getUTCMonth(),
      apiDate.getUTCDate(),
      apiDate.getUTCHours(),
      apiDate.getUTCMinutes(),
    ),
  );
  const [assignee, setAssignee] = useState(
    task?.fk_organization_contact || null,
  );
  const [cc, setCC] = useState(task?.additional_contacts || []);
  const [priority, setPriority] = useState({
    id: task?.priority || "medium",
    name: task?.priority
      ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
      : "Medium",
  });

  const [customFields, setCustomFields] = useState([]);
  const [customFieldValues, setCustomFieldValues] = useState({});

  // --- 2. UI CONTROL STATES ---
  const [contacts, setContacts] = useState([]);
  const [popover, setPopover] = useState({ visible: false, type: "" });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState({
    fetchingInitial: false,
    updatingTask: false,
  });

  const priorityData = useMemo(
    () => [
      { id: "high", name: "High" },
      { id: "medium", name: "Medium" },
      { id: "low", name: "Low" },
    ],
    [],
  );

  // --- 3. DATA FETCHING ---
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading((prev) => ({ ...prev, fetchingInitial: true }));
        try {
          const [contactRes] = await Promise.all([
            getContacts(),
            getCustomFields(() => {}, "task", setCustomFields),
          ]);

          const formattedContacts = contactRes.data.result.map((c) => ({
            id: c.id,
            name: c.contact_details?.name || "Unknown ",
          }));
          setContacts(formattedContacts);
          if (task?.custom_field_item_details) {
            const values = {};
            const fieldsFromTask = [];

            task.custom_field_item_details.forEach((item) => {
              values[item.id] = item.value;
              fieldsFromTask.push({
                id: item.id,
                name: item.custom_field_details.name,
                type: item.custom_field_details.type,
                input_type: item.custom_field_details.input_type,
                select_options: item.custom_field_details.select_options,
              });
            });

            setCustomFieldValues(values);
            setCustomFields(fieldsFromTask);
          }
        } finally {
          setLoading((prev) => ({ ...prev, fetchingInitial: false }));
        }
      };
      fetchData();
    }, [task]),
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(setActiveSubButtonGlobal("add-task"));
    }, []),
  );

  const hasChanges = () => {
    console.log("In has changes");

    if (noteTitle !== task.title) return true;

    console.log("before note");
    if (note !== task.description) return true;

    console.log("before assignee");
    if (assignee !== task.fk_organization_contact) return true;

    console.log("before priority");
    if (priority.id !== task.priority) return true;

    if (selectedMedia.length > 0) return true;

    console.log("before cc");
    if (JSON.stringify(cc) !== JSON.stringify(task.additional_contacts))
      return true;

    console.log("before date");
    if (selectedDate.toDateString() !== new Date(task.due_date).toDateString())
      return true;

    const dueDate = new Date(task.due_date);

    const dueTime = new Date(
      dueDate.getUTCFullYear(),
      dueDate.getUTCMonth(),
      dueDate.getUTCDate(),
      dueDate.getUTCHours(),
      dueDate.getUTCMinutes(),
    );

    console.log("before time", selectedTime.getTime(), dueTime.getTime());

    if (selectedTime.getTime() !== dueTime.getTime()) {
      return true;
    }

    const originalCustomFields = task?.custom_field_details || [];
    const currentFieldKeys = Object.keys(customFieldValues);

    for (const key of currentFieldKeys) {
      const original = originalCustomFields.find((f) => f.id === key);
      if (customFieldValues[key] !== original?.value) return true;
    }

    return false;
  };

  const handleUpdateTask = async () => {
    if (!noteTitle.trim()) {
      Toast.show({ type: "error", text1: "Error", text2: "Title is required" });
      return;
    }
    console.log("Before second if");
    if (!hasChanges() && Object.keys(customFieldValues).length === 0) {
      Toast.show({ type: "info", text1: "Info", text2: "No changes detected" });
      return;
    }

    setLoading((prev) => ({ ...prev, updatingTask: true }));

    try {
      const localDue = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes(),
      );
      // compute offset in ms and shift so ISO uses local time as UTC
      const tzOffsetMs = localDue.getTimezoneOffset() * 60000;
      const dueDateIsoForWeb = new Date(
        localDue.getTime() - tzOffsetMs,
      ).toISOString();
      const payload = {
        title: noteTitle,
        description: note,
        due_date: dueDateIsoForWeb,
        priority: priority.id,
        fk_organization_contact: assignee,
        additional_contacts: cc,
        task_type: task.task_type || "task",
        parent_id: task.parent_id || null,
        context_id: null,
        context_name: null,
        context_type: null,
      };

      const response = await axios.put(
        `${apiEndpoint}/crm/tasks/?task_id=${task.id}`,
        payload,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        if (Object.keys(customFieldValues).length > 0) {
          const cleanValues = Object.entries(customFieldValues).filter(
            ([key]) => !key.endsWith("_modal") && !key.endsWith("_showPicker"),
          );

          await Promise.all(
            cleanValues.map(([fieldId, value]) => {
              const exists = task.custom_field_item_details?.some(
                (f) => f.id === fieldId,
              );

              const payload = {
                value: value === null ? "" : String(value),
                context_id: task.id,
              };

              if (exists) {
                return updateCustomFieldItemValue(null, fieldId, payload);
              } else {
                return saveCustomFieldItemValue(() => {}, fieldId, payload);
              }
            }),
          );
        }

        const assetResponse = await uploadMedia(
          selectedMedia,
          task?.project_details?.id,
        );
        if (assetResponse.status >= 200 && assetResponse.status < 300) {
          const folderAssetsPayload = assetResponse.data.result.map(
            (asset) => ({
              fk_asset: asset.id,
              fk_task: task?.id,
            }),
          );

          const taskAssetStatusResponse = await axios.post(
            `${apiEndpoint}/crm/multitaskassets/?task_id=${task?.id}`,
            folderAssetsPayload,
            {
              headers: {
                Authorization: `token ${token}`,
                "X-OrganizationID": organization_id,
              },
            },
          );

          if (
            taskAssetStatusResponse.status >= 200 &&
            taskAssetStatusResponse.status < 300
          ) {
            // if (showToast) {
            Toast.show({
              type: "success",
              text1: "Success",
              text2: "Task updated successfully",
            });
            navigation.pop();
            if (onRefresh) await onRefresh();
            // }
          }
        }
      }
    } catch (error) {
      console.error(
        "Update Task Error:",
        error.response?.data || error.message,
      );
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.detail || "Failed to update task",
      });
    } finally {
      setLoading((prev) => ({ ...prev, updatingTask: false }));
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollPadding}
      >
        <Spacing space={SH(16)} />

        {/* Title */}
        <Text style={styles.inputLabel}>Title</Text>
        <Spacing space={SH(8)} />
        <Input
          placeholder="Enter task title"
          onChangeText={setNoteTitle}
          value={noteTitle}
          containerStyle={formElementsStyles.triggerStyle}
          inputContainerStyle={styles.noBorder}
          inputStyle={styles.valueInput}
        />
        <Spacing space={SH(16)} />

        {/* Priority */}
        <Text style={styles.inputLabel}>Priority</Text>
        <Spacing space={SH(8)} />
        <TouchableOpacity
          style={formElementsStyles.triggerStyle}
          onPress={() => setPopover({ visible: true, type: "priority" })}
        >
          <Text style={styles.flexValueInput}>{priority.name}</Text>
          <DownArrowOutlineIcon
            width={SH(16)}
            height={SH(16)}
            color={primaryColors.button.active}
          />
        </TouchableOpacity>
        <Spacing space={SH(16)} />

        {/* Assignee */}
        <Text style={styles.inputLabel}>Assignee</Text>
        <Spacing space={SH(8)} />
        <TouchableOpacity
          style={formElementsStyles.triggerStyle}
          onPress={() => setPopover({ visible: true, type: "assignee" })}
        >
          <Text style={styles.flexValueInput}>
            {contacts.find((c) => c.id === assignee)?.name || "Select Assignee"}
          </Text>
          {!loading.fetchingInitial ? (
            <DownArrowOutlineIcon
              width={SH(16)}
              height={SH(16)}
              color={primaryColors.brand[1000]}
            />
          ) : (
            <ActivityIndicator size="small" color={primaryColors.brand[1000]} />
          )}
        </TouchableOpacity>
        <Spacing space={SH(16)} />

        {/* CC */}
        <Text style={styles.inputLabel}>CC</Text>
        <Spacing space={SH(8)} />
        <TouchableOpacity
          style={formElementsStyles.triggerStyle}
          onPress={() => setPopover({ visible: true, type: "cc" })}
        >
          <Text style={styles.flexValueInput}>
            {cc.length > 0
              ? `${cc.length} Contacts Selected`
              : "Select CC contacts"}
          </Text>
          {!loading.fetchingInitial ? (
            <DownArrowOutlineIcon
              width={SH(16)}
              height={SH(16)}
              color={primaryColors.brand[1000]}
            />
          ) : (
            <ActivityIndicator size="small" color={primaryColors.brand[1000]} />
          )}
        </TouchableOpacity>
        {cc.length > 0 && !loading.fetchingInitial && (
          <View style={styles.badgeRow}>
            {cc.map((id) => (
              <Badge
                key={id}
                text={contacts.find((c) => c.id === id)?.name}
                color={badgeColors.blueGray}
                iconRight={
                  <TouchableOpacity
                    onPress={() => setCC(cc.filter((i) => i !== id))}
                  >
                    <CloseOutlineIcon width={SW(10)} height={SH(10)} />
                  </TouchableOpacity>
                }
              />
            ))}
          </View>
        )}
        <Spacing space={SH(16)} />

        <View style={styles.dateRangeRow}>
          <View style={styles.dateRangeColumn}>
            <Text style={styles.dateRangeLabel}>Due Date</Text>
            <DatePicker
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              placeholder="Due Date"
              showDatePicker={showDatePicker}
              setShowDatePicker={setShowDatePicker}
            />
          </View>

          <View style={styles.dateRangeColumn}>
            <Text style={styles.dateRangeLabel}>Due Time</Text>
            <TimePicker
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              placeholder="Due Time"
              showTimePicker={showTimePicker}
              setShowTimePicker={setShowTimePicker}
            />
          </View>
        </View>

        <Spacing space={SH(16)} />

        {/* Description */}
        <Text style={styles.inputLabel}>Description</Text>
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
            <Spacing space={SH(8)} />
            <Text style={formElementsStyles.titleStyle}>Attached Files:</Text>
            <Spacing space={SH(8)} />
            <FlatList
              horizontal
              data={selectedMedia}
              renderItem={({ item, index }) => {
                return (
                  <RenderMediaItem
                    mediaCarouselRef={mediaCarouselRef}
                    setSelectedIndex={setSelectedIndex}
                    item={item}
                    index={index}
                    key={index}
                    handleDeleteMedia={() => handleDeleteMedia(item.uri)}
                  />
                );
              }}
              keyExtractor={(_, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
            />
          </>
        )}

        <Spacing space={SH(16)} />

        {!loading.fetchingInitial && (
          <CustomFiledEditVersion
            customFields={customFields}
            formValues={customFieldValues}
            setFormValues={setCustomFieldValues}
          />
        )}

        <Spacing space={SH(16)} />
      </ScrollView>

      <SelectionPopover
        visible={popover.visible}
        title="Select"
        isMultiSelect={popover.type === "cc"}
        data={popover.type === "priority" ? priorityData : contacts}
        selectedIds={
          popover.type === "cc"
            ? cc
            : popover.type === "priority"
              ? priority.id
              : assignee
        }
        onClose={() => setPopover({ visible: false, type: "" })}
        onConfirm={(val) => {
          if (popover.type === "cc") setCC(val);
          else if (popover.type === "priority")
            setPriority(priorityData.find((p) => p.id === val));
          else setAssignee(val);
        }}
        loading={loading.fetchingInitial}
      />

      <View style={formElementsStyles.bottomButtonContainer}>
        <BottomButton
          title={loading.updatingTask ? "Updating..." : "Update Task"}
          onPress={handleUpdateTask}
          disabled={loading.updatingTask}
          icon={
            loading.updatingTask && (
              <ActivityIndicator size={12} color="white" />
            )
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "white" },
  scrollPadding: { paddingHorizontal: SW(16), paddingBottom: SH(120) },
  inputLabel: {
    ...formElementsStyles.titleStyle,
    includeFontPadding: false,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  valueInput: {
    ...formElementsStyles.valueStyle,
    includeFontPadding: false,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  flexValueInput: {
    ...formElementsStyles.valueStyle,
    includeFontPadding: false,
    flex: 1,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  noBorder: { borderBottomWidth: 0, paddingVertical: SH(10) },
  alignTop: { textAlignVertical: "top" },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SW(8),
    marginTop: SH(8),
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  halfWidth: { width: "48%" },
  disabledInput: {
    backgroundColor: primaryColors.gray[50],
    borderColor: primaryColors.gray[200],
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    ...formElementsStyles.valueStyle,
    color: primaryColors.gray[500],
    fontFamily: "Inter-Medium",
    includeFontPadding: false,
    marginTop: SH(12),
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

export default EditTask;

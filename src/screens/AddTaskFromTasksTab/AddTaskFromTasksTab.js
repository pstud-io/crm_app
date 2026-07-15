import React, { useState, useCallback, useEffect, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Text,
  View,
  ScrollView,
  Modal,
  StyleSheet,
  Platform,
  Alert,
  FlatList,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { Colors, SH, SW, SF } from "../../utils";
import { Button, Spacing } from "../../components/common";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native";
import {
  AddOutlineIcon,
  ChevronDown,
  CloseOutlineIcon,
  DownArrowOutlineIcon,
  UploadCloudOutline,
} from "../../svg";
import { MediaCarousel, TranscriptionInput } from "../../components";
import Toast from "react-native-toast-message";
import { InputTextStyles } from "../../styles/InputTextStyles";
import { Dropdown } from "react-native-element-dropdown";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import apiEndpoint from "../../config/apiConfig";
import { Input } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";
import { ActionSheetIOS } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { MultiSelect } from "react-native-element-dropdown";
import VoiceRecording from "./VoiceRecording";
import { body } from "../../components/UI/DesignSystem/typography";
import { primaryColors } from "../../components/UI/DesignSystem/colorPalette";
import { formElementsStyles } from "../../components/UI/Dropdown/formElementStyles";
import { Badge } from "../../components/UI/Badge/Badge";
import badgeColors from "../../components/UI/Badge/badgeColors";
import { generateTimestampString } from "../../utils";
import { RenderMediaItem } from "../../components/UI/GeneralComponents/RenderMediaItem";
import { useCameraScreen } from "../../hooks/useCameraScreen";
import { RenderDataForDropdown } from "../../components/UI/GeneralComponents/RenderDataForDropdown";
import { RenderDataForMultiselect } from "../../components/UI/GeneralComponents/RenderDataForMultiselect";
import { BottomButton } from "../../components/UI/GeneralComponents/BottomButton";
import { useKeyboard } from "@react-native-community/hooks";
import useKeyboardStatus from "../../hooks/useKeyboardStatus";
import { useGeneralEndpoints } from "../../hooks/useGeneralEndpoints";
import { CustomFieldsRenderer } from "../../components/UI/GeneralComponents/CustomFieldsRenderer";
import { useCustomFieldEndpoints } from "../../hooks/useCustomFieldEndpoints";
import { DatePicker } from "../../components/UI/GeneralComponents/DatePicker";
import { TimePicker } from "../../components/UI/GeneralComponents/TimePicker";
import { useAddTaskEndpoints } from "./useAddTaskEndpoints";
import { SlowNetworkCard } from "../../components/UI/GeneralComponents/SlowNetworkCard";
import { useCheckNetworkPerformance } from "@/hooks/useCheckNetworkPerformance";
import { setActiveSubButtonGlobal } from "@/store/slices/activeSubButtonGlobal";
import { api } from "@/api/client";
const IMAGE_SIZE = SW(100);

const AddTaskFromTasksTab = ({ route }) => {
  const dispatch = useDispatch();
  const { voiceInput, onRefresh, task_type, fk_checkpoint } = route.params;
  console.log("Route is", route);
  const { showActionSheetWithOptions } = useActionSheet();
  const selectedProject = useSelector((state) => state.project);
  const organization_id = useSelector((state) => state.profile.organization_id);
  const { handleAddTask } = useAddTaskEndpoints();
  const [selectedMedia, setSelectedMedia] = useState([]);
  const {
    latency,
    setLatency,
    checkNetworkSpeed,
    isSlow,
    setIsSlow,
    addToSyncQueue,
  } = useCheckNetworkPerformance();
  const [note, setNote] = useState(null);
  const [noteTitle, setNoteTitle] = useState(null);
  const [priority, setPriority] = useState({ id: "medium", name: "Medium" });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [ccData, setCCData] = useState([]);
  const [cc, setCC] = useState([]);
  const [assigneesData, setAssigneesData] = useState([]);
  const [assignee, setAssignee] = useState(null);
  const [taskType, setTaskType] = useState(
    task_type ? { id: "issue", name: "Issue" } : { id: "task", name: "Task" },
  );

  const [allProjects, setAllProjects] = useState([]);
  const [projectTitle, setProjectTitle] = useState(null);

  const [customFields, setCustomFields] = useState([]);
  const [customFieldValues, setCustomFieldValues] = useState({});

  const [selectedIndex, setSelectedIndex] = useState(null);
  const mediaCarouselRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      dispatch(setActiveSubButtonGlobal("add-task"));
    }, []),
  );

  const [loading, setLoading] = useState({
    AddTaskFromTasksTab: false,
    getCCForDropdown: false,
    fetchingProjects: false,
  });

  const { handleSelectMedia, handleDeleteMedia } = useCameraScreen({
    setSelectedMedia,
  });

  const { getAllProjects } = useGeneralEndpoints();
  const { getCustomFields } = useCustomFieldEndpoints();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        console.log("In fetch data of add task");
        const promises = [
          getCCForDropdown(),
          getCustomFields(() => {}, "task", setCustomFields),
        ];

        if (selectedProject.id === "all_projects") {
          promises.push(getAllProjects(setLoading, setAllProjects));
        }

        try {
          await Promise.all(promises);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }, [selectedProject.id]),
  );
  // useFocusEffect(
  //   useCallback(() => {
  //     checkNetworkSpeed(setLatency, setIsSlow);
  //   }, []),
  // );

  const handleSelectTaksType = async () => {
    try {
      const taksTypes = [
        { id: "task", name: "Task" },
        { id: "request", name: "Request" },
        { id: "followup", name: "Followup" },
        { id: "hindrance", name: "Hindrance" },
        { id: "snag", name: "Snags" },
        { id: "issue", name: "Issue" },
      ];

      const options = ["Cancel", ...taksTypes.map((option) => option.name)];
      const cancelButtonIndex = 0;

      const handleSelection = (buttonIndex) => {
        if (buttonIndex === 1) {
          setTaskType({ id: "task", name: "Task" });
        } else if (buttonIndex === 2) {
          setTaskType({ id: "request", name: "Request" });
        } else if (buttonIndex === 3) {
          setTaskType({ id: "followup", name: "Followup" });
        } else if (buttonIndex === 4) {
          setTaskType({ id: "hindrance", name: "Hindrance" });
        } else if (buttonIndex === 5) {
          setTaskType({ id: "snag", name: "Snags" });
        } else if (buttonIndex === 6) {
          setTaskType({ id: "issue", name: "Issue" });
        }
      };

      if (Platform.OS === "ios") {
        ActionSheetIOS.showActionSheetWithOptions(
          { options, cancelButtonIndex },
          handleSelection,
        );
      } else {
        showActionSheetWithOptions(
          { options, cancelButtonIndex, useModal: true },
          handleSelection,
        );
      }
    } catch (err) {
      console.error("Task Type selection error", err.message);
      Alert.alert(
        "Error",
        "An error occurred while selecting Task Type. Please try again.",
      );
    }
  };

  const handleSelectTaksPriority = async () => {
    try {
      const priorityData = [
        { id: "high", name: "High" },
        { id: "medium", name: "Medium" },
        { id: "low", name: "Low" },
      ];

      const options = ["Cancel", ...priorityData.map((option) => option.name)];
      const cancelButtonIndex = 0;

      const handleSelection = (buttonIndex) => {
        if (buttonIndex === 1) {
          setPriority({ id: "high", name: "High" });
        } else if (buttonIndex === 2) {
          setPriority({ id: "medium", name: "Medium" });
        } else if (buttonIndex === 3) {
          setPriority({ id: "low", name: "Low" });
        }
      };

      if (Platform.OS === "ios") {
        ActionSheetIOS.showActionSheetWithOptions(
          { options, cancelButtonIndex },
          handleSelection,
        );
      } else {
        showActionSheetWithOptions(
          { options, cancelButtonIndex, useModal: true },
          handleSelection,
        );
      }
    } catch (err) {
      console.error("Task Type selection error:", err.message);
      Alert.alert(
        "Error",
        "An error occurred while selecting Task Type. Please try again.",
      );
    }
  };

  const handleAddTaskFromTasksTab = async () => {
    console.log("In handle add task from task tab");
    const fk_project =
      selectedProject.id === "all_projects" ? projectTitle : selectedProject.id;

    if (selectedProject.id === "all_projects" && !fk_project) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please select a Project.",
      });
      return;
    }
    if (!noteTitle) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Title cannot be empty",
      });
      return;
    }
    if (!assignee) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "No Assignee selected",
      });
      return;
    }
    console.log("Before handle add task");
    // let networkCheck = null;
    // if (!isSlow) {
    //   setLoading((prev) => ({ ...prev, AddTaskFromTasksTab: true }));
    //   networkCheck = await checkNetworkSpeed(setLatency, setIsSlow);
    // }
    // if (isSlow || networkCheck?.isSlow || networkCheckGlobal?.isSlow) {
    //   setLoading((prev) => ({ ...prev, AddTaskFromTasksTab: true }));
    //   await addToSyncQueue("task", {
    //     fk_project,
    //     setLoading,
    //     selectedDate,
    //     selectedTime,
    //     note,
    //     assignee,
    //     noteTitle,
    //     taskType,
    //     cc,
    //     priority,
    //     fk_checkpoint,
    //     customFieldValues,
    //     selectedMedia,
    //   });
    //   setLoading((prev) => ({ ...prev, AddTaskFromTasksTab: false }));
    //   navigation.pop();
    //   return;
    // }
    await handleAddTask({
      fk_project,
      setLoading,
      selectedDate,
      selectedTime,
      note,
      assignee,
      noteTitle,
      taskType,
      cc,
      priority,
      fk_checkpoint,
      customFieldValues,
      selectedMedia,
      onRefresh,
    });
  };

  const getCCForDropdown = async () => {
    setLoading({ ...loading, getCCForDropdown: true });
    console.log("In get cc for dripdown");
    try {
      const response = await api.get(
        `${apiEndpoint}/core/organization/contacts/lite/`,
      );

      //console.log("response:", response.data.result);

      if (response.status >= 200 && response.status < 300) {
        // Create a Set to store unique IDs and filter out duplicates
        // const seenIds = new Set();
        // const orgContacts = response.data.result || response.data;
        // orgContacts.forEach((item) => {
        //   data.push(formatContacts(item));
        // });
        // setCCData(data);

        const assignees = response.data.result.map((item) => ({
          id: item.id,
          name: item.contact_details?.name || "Unknown", // Fallback for missing name
        }));
        console.log("Assignees", assignees);

        const uniqueAssignees = Array.from(
          new Map(assignees.map((a) => [a.id, a])).values(),
        );
        setCCData(uniqueAssignees);

        setAssigneesData(uniqueAssignees);
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
        type: "Error",
        text1: "Error",
        text2:
          error.response?.data?.result ||
          "Failed to fetch user details. Check your network connection.",
      });
    } finally {
      setLoading({ ...loading, getCCForDropdown: false });
    }
  };

  const handleRemoveCC = (idToRemove) => {
    setCC((prev) => prev.filter((id) => id !== idToRemove));
  };

  const createTaskFromVoice = async (data) => {
    const details = data.result;
    console.log("entered ctfv", details);
    try {
      if (details) {
        if (details.assignee) {
          const found = assigneesData.find(
            (assignee) => assignee.name === details.assignee,
          );
          found && setAssignee(found.id);
        }
        details.description && setNote(details.description);
        details.due_date && setSelectedDate(new Date(details.due_date));
        details.title && setNoteTitle(details.title);
        if (details?.due_time) {
          const [hours, minutes] = details.due_time.split(":");
          const timeDate = new Date();
          timeDate.setHours(parseInt(hours, 10));
          timeDate.setMinutes(parseInt(minutes, 10));
          setSelectedTime(timeDate);
        }
      }
    } catch (error) {
      console.log("Error in creating task from voice", error);
    }
  };

  const keyboard = useKeyboard();
  const isKeyboardVisible = useKeyboardStatus();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        borderWidth: 0,
        borderColor: Colors.blue_color,
      }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: SW(16),
          width: "100%",
          paddingBottom: isKeyboardVisible && keyboard.keyboardHeight - SH(60),
        }}
      >
        {/* {(isSlow || networkCheckGlobal?.isSlow) && (
          <>
            <SlowNetworkCard module={"Quick Update"} />
          </>
        )} */}
        {voiceInput && (
          <>
            <Spacing space={SH(10)} />
            <VoiceRecording
              createTaskFromVoice={createTaskFromVoice}
              voiceInput={voiceInput}
            />
          </>
        )}
        <Spacing space={SH(16)} />
        <Text style={formElementsStyles.titleStyle}>Type:</Text>
        <Spacing space={SH(6)} />
        <TouchableOpacity
          onPress={() => handleSelectTaksType()}
          style={formElementsStyles.triggerStyle}
        >
          <Text style={formElementsStyles.valueStyle}>{taskType.name}</Text>
          <DownArrowOutlineIcon width={16} height={16} />
        </TouchableOpacity>
        <Spacing space={SH(16)} />
        <Text style={formElementsStyles.titleStyle}>Title *</Text>
        <Spacing space={SH(6)} />
        <Input
          placeholder="Enter Task Title"
          onChangeText={setNoteTitle}
          placeholderTextColor={formElementsStyles.placeholderColor}
          containerStyle={formElementsStyles.triggerStyle}
          inputContainerStyle={formElementsStyles.inputContainerStyle}
          inputStyle={formElementsStyles.valueStyle}
          value={noteTitle}
        />

        <Spacing space={SH(16)} />

        {/* Select Project  */}

        {selectedProject.id === "all_projects" && (
          <>
            <Text style={formElementsStyles.titleStyle}>Select Project *</Text>
            <Spacing space={SH(6)} />
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
                loading.fetchingProjects
                  ? "Fetching Projects..."
                  : "Select Project"
              }
              value={projectTitle}
              search
              searchPlaceholder="Find Project"
              renderItem={(item, isSelected) => (
                <RenderDataForDropdown
                  isSelected={isSelected}
                  itemName={item.project_name}
                />
              )}
              onChange={(item) => {
                setProjectTitle(item.id);
              }}
              renderRightIcon={() =>
                loading.fetchingProjects ? (
                  <ActivityIndicator size={12} color={Colors.gray_text_color} />
                ) : (
                  <DownArrowOutlineIcon width={SH(16)} height={SH(16)} />
                )
              }
            />
            <Spacing space={SH(16)} />
          </>
        )}
        <Text
          style={{
            ...body.sm.medium,
            color: primaryColors.gray[700],
          }}
        >
          Priority *
        </Text>
        <Spacing space={SH(6)} />
        <TouchableOpacity
          onPress={() => handleSelectTaksPriority()}
          style={formElementsStyles.triggerStyle}
        >
          <Text style={formElementsStyles.valueStyle}>{priority.name}</Text>
          <DownArrowOutlineIcon width={16} height={16} />
        </TouchableOpacity>
        <Spacing space={SH(16)} />
        <Text
          style={{
            ...body.sm.medium,
            color: primaryColors.gray[700],
          }}
        >
          Select Assignee *
        </Text>
        <Spacing space={SH(6)} />
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
          labelField={!loading.getCCForDropdown && "name"}
          valueField="id"
          searchField="name"
          placeholder={
            loading.getCCForDropdown
              ? "Fetching Assignees..."
              : "Select Assignee"
          }
          value={loading.getCCForDropdown ? "" : assignee}
          search
          searchPlaceholder="Search Assignee"
          data={assigneesData}
          renderItem={(item, isSelected) => (
            <RenderDataForDropdown
              itemName={item.name}
              isSelected={isSelected}
            />
          )}
          onChange={(item) => {
            setAssignee(item.id);
          }}
          renderRightIcon={() =>
            loading.getCCForDropdown ? (
              <ActivityIndicator size={12} color={Colors.gray_text_color} />
            ) : (
              <DownArrowOutlineIcon width={SH(16)} height={SH(16)} />
            )
          }
        />
        <Spacing space={SH(8)} />
        <MultiSelect
          iconStyle={{ display: "none" }}
          mode="modal"
          style={formElementsStyles.multiselectTriggerStyle}
          placeholderStyle={formElementsStyles.multiSelectPlaceholderStyle}
          selectedTextStyle={formElementsStyles.valueStyle}
          itemContainerStyle={
            formElementsStyles.dropdownOptionsItemContainerStyle
          }
          containerStyle={formElementsStyles.dropdownOptionsContainerStyle}
          // selectedStyle={formElementsStyles.dropdownOptionsItemContainerStyle}
          showsVerticalScrollIndicator={false}
          activeColor="transparent"
          data={ccData}
          labelField={!loading.getCCForDropdown && "name"}
          valueField="id"
          placeholder={"Add CC"}
          value={loading.getCCForDropdown ? "" : cc}
          search
          searchField="name"
          searchPlaceholder="Search For CC"
          searchPlaceholderTextColor={formElementsStyles.placeholderColor}
          inputSearchStyle={formElementsStyles.dropdownOptionsSearchStyle}
          renderItem={(item, isSelected) => (
            <RenderDataForMultiselect item={item} isSelected={isSelected} />
          )}
          renderSelectedItem={() => {
            return <></>;
          }}
          renderLeftIcon={() =>
            loading.getCCForDropdown ? (
              <ActivityIndicator size={12} color={primaryColors.brand[1000]} />
            ) : (
              <AddOutlineIcon
                width={SW(16)}
                height={SH(16)}
                fill={primaryColors.button.active}
              />
            )
          }
          renderRightIcon={() => (
            <ChevronDown
              width={SW(14)}
              height={SH(14)}
              stroke={primaryColors.button.active}
              strokeWidth={SW(2)}
            />
          )}
          onChange={(items) => {
            setCC(items); // items is an array of selected IDs
          }}
        />
        {cc.length > 0 && (
          <>
            <Spacing space={SH(8)} />
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                gap: SW(8),
              }}
            >
              {cc.map((id, index) => {
                const contact = ccData.find((item) => item.id === id);
                if (!contact) return null;
                return (
                  <Badge
                    key={index}
                    size={"md"}
                    text={contact.name}
                    color={badgeColors.blueGray}
                    border={true}
                    iconRight={
                      <TouchableOpacity
                        onPress={() => handleRemoveCC(id)}
                        style={{ marginLeft: 2 }}
                      >
                        <CloseOutlineIcon width={SW(10)} height={SH(10)} />
                      </TouchableOpacity>
                    }
                  />
                );
              })}
            </View>
          </>
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
          <View style={styles.dateRangeColumn2}>
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
        <Text style={formElementsStyles.titleStyle}>Description:</Text>
        <Spacing space={SH(6)} />
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
        <Text style={formElementsStyles.titleStyle}>Attachments:</Text>
        <Spacing space={SH(6)} />
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
              display: "flex",
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

        <Spacing space={SH(16)} />
        {selectedMedia.length > 0 && (
          <>
            <Text style={formElementsStyles.titleStyle}>Attached Files:</Text>
            <Spacing space={SH(6)} />
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
        <Spacing space={SH(32)} />

        <CustomFieldsRenderer
          customFields={customFields}
          formValues={customFieldValues}
          setFormValues={setCustomFieldValues}
        />

        <Spacing space={SH(16)} />
      </ScrollView>
      <View style={formElementsStyles.bottomButtonContainer}>
        <BottomButton
          disabled={loading.AddTaskFromTasksTab}
          title={loading.AddTaskFromTasksTab ? "Creating Task" : "Create Task"}
          onPress={handleAddTaskFromTasksTab}
          type={loading.postComment ? "disabled" : "default"}
          icon={
            loading.AddTaskFromTasksTab && (
              <ActivityIndicator size={12} color={primaryColors.gray[25]} />
            )
          }
        />
      </View>

      {selectedIndex !== null && (
        <MediaCarousel
          mediaFiles={selectedMedia}
          ref={mediaCarouselRef}
          onClose={async () => {
            setSelectedIndex(null);
            await mediaCarouselRef.current?.dismiss();
          }}
          initialIndex={selectedIndex}
        />
      )}
      {/* <Toast /> */}
    </View>
  );
};

export default AddTaskFromTasksTab;

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
  container: { width: "100%", borderWidth: 0 },
  dropdown: {
    height: 50,
    ...InputTextStyles.input,
  },
  placeholderStyle: {
    fontSize: SF(12),
    // fontFamily: 'Inter-Regular',
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
    marginBottom: SH(0), // Adjust this to your liking
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
  imageBox: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    marginRight: 10,
    backgroundColor: "#eee",
    borderRadius: 4,
    overflow: "hidden",
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

import React, { useState, useCallback, useEffect, useRef } from "react";
import { marked } from "marked";
import { useFocusEffect } from "@react-navigation/native";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
  ActionSheetIOS,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Colors, SH, SW, SF } from "../../utils";
import { Spacing, Modal as ErrorModal } from "../../components/common";
import {
  DownArrowOutlineIcon,
  UploadCloudOutline,
  CloseOutlineIcon,
  AddOutlineIcon,
  ChevronDown,
} from "../../svg";
import Toast from "react-native-toast-message";
import { InputTextStyles } from "../../styles/InputTextStyles";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import apiEndpoint from "../../config/apiConfig";
import { Input } from "react-native-elements";
import * as DocumentPicker from "expo-document-picker";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useActionSheet } from "@expo/react-native-action-sheet";
import TranscriptionInputFormatted from "../../components/specific/TranscriptionInputFormatted";
import { MultiSelect } from "react-native-element-dropdown";
import { useNoteEndpoints } from "./hooks/useNoteEndPoints";
import { handleDeleteImage } from "./utils/noteUtils";
// import { useRecorder } from "./utils/useAudioRecorder";
import { primaryColors } from "../../components/UI/DesignSystem/colorPalette";
import { formElementsStyles } from "../../components/UI/Dropdown/formElementStyles";
import { Badge } from "../../components/UI/Badge/Badge";
import badgeColors from "../../components/UI/Badge/badgeColors";
import { RenderMediaItem } from "../../components/UI/GeneralComponents/RenderMediaItem";
import { RenderDataForMultiselect } from "../../components/UI/GeneralComponents/RenderDataForMultiselect";
import { BottomButton } from "../../components/UI/GeneralComponents/BottomButton";
import { useCameraScreen } from "../../hooks/useCameraScreen";
import { useCheckNetworkPerformance } from "../../hooks/useCheckNetworkPerformance";
import { SlowNetworkCard } from "../../components/UI/GeneralComponents/SlowNetworkCard";
import { setActiveSubButtonGlobal } from "@/store/slices/activeSubButtonGlobal";

const AddNote = ({ route }) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const dispatch = useDispatch();
  const { project_id, project } = route.params;
  console.log("This is the project id and project in add note", project);
  const token = useSelector((state) => state.auth.token);
  const organization_id = useSelector((state) => state.profile.organization_id);
  const networkCheckGlobal = useSelector(
    (state) => state.networkCheckGlobal.networkCheckGlobal,
  );
  const { handleAddNote: submitNote } = useNoteEndpoints();

  const {
    latency,
    setLatency,
    checkNetworkSpeed,
    isSlow,
    setIsSlow,
    addToSyncQueue,
  } = useCheckNetworkPerformance();

  // const {
  //   isRecording,
  //   transcription,
  //   formattedTime,
  //   startRecording,
  //   stopRecording,
  //   audioUri,
  // } = useRecorder({ shouldTranscribeFormat: true });

  const [ccData, setCCData] = useState([]);
  const [cc, setCC] = useState([]);
  const [loading, setLoading] = useState({
    AddNote: false,
    getCCForDropdown: false,
  });
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [note, setNote] = useState(null);
  const [noteTitle, setNoteTitle] = useState(null);
  const [modal, setModal] = useState({
    visible: false,
    title: "",
    message: "",
  });
  const [selectedIndex, setSelectedIndex] = useState(null);
  const mediaCarouselRef = useRef(null);

  const { handleSelectMedia, handleDeleteMedia } = useCameraScreen({
    setSelectedMedia,
  });

  useFocusEffect(
    useCallback(() => {
      checkNetworkSpeed(setLatency, setIsSlow);
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(setActiveSubButtonGlobal("add-note"));
    }, []),
  );

  // useEffect(() => {
  //   if (transcription) setNote(transcription);
  // }, [transcription]);

  useEffect(() => {
    if (token) getCCForDropdown();
  }, [token]);

  const getCCForDropdown = async () => {
    setLoading((prev) => ({ ...prev, getCCForDropdown: true }));
    try {
      const response = await axios.get(
        `${apiEndpoint}/core/organization/contacts/lite/`,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );
      if (response.status >= 200 && response.status < 300) {
        const assignees = response.data.result.map((item) => ({
          id: item.id,
          name: item.contact_details?.name || "Unknown", // Fallback for missing name
        }));
        console.log("Assigneess", assignees);

        const uniqueAssignees = Array.from(
          new Map(assignees.map((a) => [a.id, a])).values(),
        );
        setCCData(uniqueAssignees);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading((prev) => ({ ...prev, getCCForDropdown: false }));
    }
  };

  const handleCreateNote = async () => {
    if (!noteTitle || noteTitle.trim() === "") {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Title cannot be empty.",
      });
      return;
    }
    if (!note || note.trim() === "") {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Note description cannot be empty.",
      });
      return;
    }

    const externalPayload = {
      project_id,
      noteTitle,
      note: marked(note),
      cc,
      selectedMedia,
      setLoading,
    };
    console.log("This is the external payload", externalPayload);
    let networkCheck = null;
    if (!isSlow) {
      setLoading((prev) => ({ ...prev, AddNote: true }));
      networkCheck = await checkNetworkSpeed(setLatency, setIsSlow);
    }
    if (isSlow || networkCheck?.isSlow || networkCheckGlobal?.isSlow) {
      setLoading((prev) => ({ ...prev, AddNote: true }));
      await addToSyncQueue("note", externalPayload);
      setLoading((prev) => ({ ...prev, AddNote: false }));
      navigation.pop();
      return;
    }

    submitNote(externalPayload);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: SW(16),
          paddingBottom: SH(100),
        }}
      >
        {(isSlow || networkCheckGlobal?.isSlow) && (
          <>
            <Spacing space={SH(20)} />
            <SlowNetworkCard module={"Quick Update"} />
          </>
        )}
        {!(isSlow || networkCheckGlobal?.isSlow) && <Spacing space={SH(20)} />}
        <Text style={formElementsStyles.titleStyle}>Title *</Text>
        <Spacing space={SH(6)} />
        <Input
          placeholder="Enter Note Title"
          onChangeText={setNoteTitle}
          placeholderTextColor={formElementsStyles.placeholderColor}
          containerStyle={formElementsStyles.triggerStyle}
          inputContainerStyle={formElementsStyles.inputContainerStyle}
          inputStyle={formElementsStyles.valueStyle}
          value={noteTitle}
        />

        <Spacing space={SH(16)} />
        <Text style={formElementsStyles.titleStyle}>Note *</Text>
        <Spacing space={SH(6)} />
        <TranscriptionInputFormatted
          value={note}
          onChangeText={setNote}
          placeholder="Enter Note"
          projectId={project_id}
          containerStyle={{ width: "100%", height: "auto" }}
          onTranscriptionEnd={(formattedText) =>
            console.log("Transcription finished")
          }
          showMicIcon={!(isSlow || networkCheckGlobal?.isSlow)}
        />

        <Spacing space={SH(16)} />

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
          renderSelectedItem={() => (
            <View style={{ width: 0, height: 0, opacity: 0 }}></View>
          )}
          renderLeftIcon={() =>
            loading.getCCForDropdown ? (
              <ActivityIndicator size={12} color={primaryColors.brand[1000]} />
            ) : (
              <AddOutlineIcon
                width={SW(16)}
                height={SH(16)}
                fill={primaryColors.brand[1000]}
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
          onChange={setCC}
        />
        {cc.length > 0 && (
          <View style={styles.chipsContainer}>
            {cc.map((id) => {
              const contact = ccData.find((item) => item.id === id);
              if (!contact) return null;
              return (
                <Badge
                  key={id}
                  size={"md"}
                  text={contact.name}
                  color={badgeColors.blueGray}
                  border={true}
                  iconRight={
                    <TouchableOpacity
                      onPress={() =>
                        setCC((prev) => prev.filter((i) => i !== id))
                      }
                      style={{ marginLeft: 2 }}
                    >
                      <CloseOutlineIcon width={SW(10)} height={SH(10)} />
                    </TouchableOpacity>
                  }
                />
              );
            })}
          </View>
        )}

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
          <View style={styles.uploadTextRow}>
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
              renderItem={({ item, index }) => (
                <RenderMediaItem
                  item={item}
                  index={index}
                  setSelectedIndex={setSelectedIndex}
                  mediaCarouselRef={mediaCarouselRef}
                  handleDeleteMedia={handleDeleteMedia}
                />
              )}
              keyExtractor={(_, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
            />
          </>
        )}
      </ScrollView>

      <View style={styles.bottomButtonContainer}>
        <BottomButton
          title={loading.AddNote ? "Creating Note..." : "Create Note"}
          onPress={handleCreateNote}
          type={loading.AddNote ? "disabled" : "default"}
          icon={
            loading.AddNote && <ActivityIndicator size={12} color="white" />
          }
        />
      </View>

      <ErrorModal
        visible={modal.visible}
        title={modal.title}
        message={modal.message}
        onOkayPress={() => setModal((p) => ({ ...p, visible: false }))}
      />
    </View>
  );
};

export default AddNote;

const styles = StyleSheet.create({
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: SH(8),
    gap: SW(8),
  },
  uploadTextRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SW(6),
  },
  bottomButtonContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SH(12),
    gap: SW(10),
    borderColor: primaryColors.gray[200],
    borderTopWidth: SW(1),
    paddingHorizontal: SW(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -SH(0.5) },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 10,
    backgroundColor: "#fff",
    width: "100%",
    position: "absolute",
    bottom: 0,
    zIndex: 99,
  },
});

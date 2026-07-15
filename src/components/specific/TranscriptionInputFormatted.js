import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Text,
  TextInput,
  View,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
} from "expo-audio";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { Colors, SH, SW, SF } from "../../utils";
import { useMentions } from "react-native-controlled-mentions";
import { useGeneralEndpoints } from "../../hooks/useGeneralEndpoints";
import { RenderMentionsData } from "./RenderMentionsData";
import { useSelector } from "react-redux";
import { primaryColors } from "../UI/DesignSystem/colorPalette";
import Markdown from "react-native-markdown-display";
import apiEndpoint from "../../config/apiConfig";

const TranscriptionInputFormatted = ({
  value,
  onChangeText,
  onMentionsChange,
  placeholder = "Enter text",
  projectId,
  containerStyle,
  inputStyle,
  microphoneButtonStyle,
  transcriptionApiUrlNew = "https://api.projectstudio.ai/core/transcribe/new/",
  transcriptionApiUrl = "https://api.projectstudio.ai/core/transcribe/formatted/",
  onTranscriptionStart,
  onTranscriptionEnd,
  onTranscriptionError,
  rightIcon,
  showMicIcon = true,
  mentions = [],
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [jobID, setJobID] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [contactsFetched, setContactsFetched] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [localMentions, setLocalMentions] = useState(mentions || []);
  const [recordTime, setRecordTime] = useState(0);
  const timerRef = useRef(null);
  const { fetchProjectContacts } = useGeneralEndpoints();
  const isUserNearBottomRef = useRef(true);
  const token = useSelector((state) => state.auth.token);
  const organization_id = useSelector((state) => state.profile.organization_id);

  const isNearBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return (
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 50
    );
  };

  const { uploadMedia } = useGeneralEndpoints();

  const triggersConfig = useMemo(
    () => ({
      mention: {
        trigger: "@",
        allowedSpacesCount: 1,
        textStyle: { color: primaryColors.brand[900], fontWeight: "bold" },
        isInsertSpaceAfterMention: true,
      },
    }),
    [],
  );

  const { textInputProps, triggers } = useMentions({
    value: value || "",
    onChange: onChangeText,
    triggersConfig: triggersConfig,
  });

  useEffect(() => {
    if (projectId && token && organization_id && projectId !== "all_projects") {
      fetchProjectContacts(projectId, setContacts, setContactsFetched);
    }
  }, [projectId, token, organization_id]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const startRecording = async () => {
    try {
      const permission = await AudioModule.requestRecordingPermissionsAsync();

      if (!permission.granted) {
        Alert.alert("Permission denied", "Please allow microphone access.");
        return;
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      await recorder.prepareToRecordAsync();
      recorder.record();

      setIsRecording(true);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to start recording");
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);

      await recorder.stop();

      await setAudioModeAsync({
        allowsRecording: false,
      });

      if (recorder.uri) {
        await transcribeAudio(recorder.uri);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Error stopping recording");
    }
  };
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const waitForTranscription = async (jobId) => {
    while (true) {
      const statusResponse = await axios.get(
        `${apiEndpoint}/core/transcribe/status/?job_id=${jobId}`,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );
      console.log("This is the status response", statusResponse);
      const status = statusResponse?.data?.status;

      if (status === "completed") {
        return statusResponse?.data?.text;
      }

      if (status === "failed") {
        throw new Error("Transcription failed");
      }

      await sleep(1000);
    }
  };

  const getNoteFromTranscription = async (text) => {
    try {
      const response = await axios.post(
        `${apiEndpoint}/core/transcribe/formatted/new/`,
        { text: text },
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );
      console.log("This is getNotefrom transcription response", response);
      if (response?.data?.text) {
        const transcribedText = response.data.text;

        return transcribedText;
      }
    } catch (error) {
      onTranscriptionError?.(error.message);
      Alert.alert("Error", "Note from Transcription failed");
    } finally {
      setIsTranscribing(false);
    }
  };

  const getOpenAIResponse = async (text) => {
    try {
      const response = await axios.get(`${apiEndpoint}/crm/openai-switch/`, {
        headers: {
          Authorization: `token ${token}`,
          "X-OrganizationID": organization_id,
        },
      });
      console.log("This is open ai response", response);
      return response.data.result.is_enabled;
    } catch (error) {
      onTranscriptionError?.(error.message);
      Alert.alert("Error", "Note from Transcription failed");
    } finally {
      setIsTranscribing(false);
    }
  };

  const saveAudio = async (assetID) => {
    try {
      const response = await axios.post(
        `${apiEndpoint}/crm/note-audio-history/`,
        { fk_asset: assetID },
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );
      console.log("Response of saveAudio", response);
    } catch (error) {
      Alert.alert("Error", "Transcription failed");
    } finally {
    }
  };

  const transcribeAudioNew = async (uri) => {
    try {
      setIsTranscribing(true);
      onTranscriptionStart?.();
      const formData = new FormData();
      const name = `AUDIO_${new Date().getTime()}.m4a`;

      formData.append("file", {
        uri,
        type: "audio/m4a",
        name: name,
      });

      const response = await axios.post(transcriptionApiUrlNew, formData, {
        headers: {
          Authorization: `token ${token}`,
          "X-OrganizationID": organization_id,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.data?.job_id) {
        const transcribedText = await waitForTranscription(
          response.data.job_id,
        );
        const noteFromTranscription =
          await getNoteFromTranscription(transcribedText);
        console.log("This is note from transcription", noteFromTranscription);

        const newValue = value?.trim()
          ? value + "\n\n" + noteFromTranscription
          : noteFromTranscription;

        onChangeText(newValue);
        onTranscriptionEnd?.(noteFromTranscription);
        setIsPreview(true);
        const assetResponse = await uploadMedia(
          [
            {
              uri,
              type: "audio/m4a",
              name: name,
              size: null,
            },
          ],
          projectId,
        );
        if (assetResponse.status >= 200 && assetResponse.status < 300) {
          console.log("This is the assetResponse", assetResponse);
          await saveAudio(assetResponse.data.result[0].id);
        }
      }
    } catch (error) {
      onTranscriptionError?.(error.message);
      Alert.alert("Error", "Transcription failed");
    } finally {
      setIsTranscribing(false);
    }
  };

  const transcribeAudio = async (uri) => {
    try {
      setIsTranscribing(true);
      onTranscriptionStart?.();
      const formData = new FormData();
      formData.append("file", {
        uri,
        type: "audio/m4a",
        name: "recording.m4a",
      });

      const response = await axios.post(transcriptionApiUrl, formData, {
        headers: {
          Authorization: `token ${token}`,
          "X-OrganizationID": organization_id,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.data?.text) {
        const newValue = value?.trim()
          ? value + "\n\n" + response.data.text
          : response.data.text;
        onChangeText(newValue);
        onTranscriptionEnd?.(response.data.text);
        setIsPreview(true);
      }
    } catch (error) {
      onTranscriptionError?.(error.message);
      Alert.alert("Error", "Transcription failed");
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <>
      <RenderMentionsData
        triggers={triggers}
        contacts={contacts}
        showPopover={showPopover}
        localMentions={localMentions}
        setLocalMentions={setLocalMentions}
        onMentionsChange={onMentionsChange}
      />

      <View
        style={[
          styles.wideContainer,
          containerStyle,
          { height: value ? SH(300) : SH(100) },
        ]}
      >
        {value && (
          <View style={styles.headerRow}>
            <Text style={styles.modeLabel}>
              {isPreview ? "PREVIEW MODE" : "EDIT MODE"}
            </Text>
            <TouchableOpacity
              onPress={() => setIsPreview(!isPreview)}
              style={styles.toggleBtn}
            >
              <MaterialCommunityIcons
                name={isPreview ? "pencil" : "eye"}
                size={16}
                color={primaryColors.gray[900]}
              />
              <Text style={styles.toggleText}>
                {isPreview ? "Edit" : "Preview"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* scrollWrapper must have flex: 1 to ensure ScrollView has height on Android */}
        <View style={styles.scrollWrapper}>
          {isPreview && value ? (
            <ScrollView
              style={styles.markdownWrapper}
              contentContainerStyle={{
                padding: 10,
                paddingBottom: 60, // prevent mic button overlap
              }}
              showsVerticalScrollIndicator
            >
              <Markdown style={markdownStyles}>{value}</Markdown>
            </ScrollView>
          ) : (
            <TextInput
              {...textInputProps}
              multiline
              placeholder={placeholder}
              placeholderTextColor={Colors.gray_text_color}
              style={[styles.textInput, inputStyle, { padding: SW(8) }]}
              textAlignVertical="top"
            />
          )}
        </View>

        {showMicIcon && (
          <View style={styles.actionContainer}>
            {isRecording && (
              <View style={styles.timerWrapper}>
                <Text style={styles.timerText}>{formatTimer(recordTime)}</Text>
              </View>
            )}
            <TouchableOpacity
              onPress={isRecording ? stopRecording : startRecording}
              style={[
                {
                  backgroundColor: isRecording
                    ? "#FFD700"
                    : primaryColors.brand[1000],
                },
                styles.micBtnBase,
                microphoneButtonStyle,
              ]}
              disabled={isTranscribing}
            >
              {isTranscribing ? (
                <ActivityIndicator size={12} color={"#fff"} />
              ) : (
                <MaterialIcons
                  name={isRecording ? "stop" : "mic"}
                  size={20}
                  color={"#fff"}
                />
              )}
            </TouchableOpacity>
            {rightIcon && rightIcon}
          </View>
        )}
      </View>
    </>
  );
};

const markdownStyles = {
  table: {
    borderWidth: 1,
    borderColor: "#dfe2e5",
    borderRadius: 3,
    marginVertical: 10,
  },
  tr: {
    borderBottomWidth: 1,
    borderBottomColor: "#dfe2e5",
    flexDirection: "row",
  },
  th: { backgroundColor: "#f6f8fa", fontWeight: "bold", padding: 8, flex: 1 },
  td: { padding: 8, flex: 1 },
  heading1: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  paragraph: { fontSize: 14, lineHeight: 20, color: "#333" },
};

const styles = StyleSheet.create({
  wideContainer: {
    minHeight: SH(100),
    maxHeight: SH(400),
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    position: "relative",
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modeLabel: { fontSize: 10, color: "#999", fontWeight: "bold" },
  toggleBtn: { flexDirection: "row", alignItems: "center", padding: 5 },
  toggleText: {
    fontSize: 12,
    marginLeft: 3,
    color: primaryColors.gray[900],
    fontWeight: "600",
  },
  scrollWrapper: {
    flexGrow: 1,
    flexShrink: 1,
  },
  scrollContent: {
    padding: 10,
    paddingBottom: 60, // Extra padding to not hide text behind floating buttons
    flexGrow: 1,
  },
  textInput: {
    fontSize: SF(14),
    minHeight: SH(80),
    color: "#333",
  },
  markdownWrapper: {
    flex: 1,
  },
  actionContainer: {
    position: "absolute",
    right: 12,
    bottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    zIndex: 10,
  },
  timerWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  timerText: {
    fontSize: 12,
    color: "#FF0000",
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  micBtnBase: {
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6, // Floating effect for Android
    shadowColor: "#000", // Floating effect for iOS
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.5,
  },
});

export default TranscriptionInputFormatted;

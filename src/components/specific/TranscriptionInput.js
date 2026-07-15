// TranscriptionInput.js

import { useEffect, useState, useMemo, useRef } from "react";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import {
  AudioModule,
  RecordingPresets,
  useAudioRecorder,
  setAudioModeAsync,
} from "expo-audio";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { SH, SW } from "../../utils";
import { useMentions } from "react-native-controlled-mentions";
import { useGeneralEndpoints } from "../../hooks/useGeneralEndpoints";
import { RenderMentionsData } from "./RenderMentionsData";
import { useSelector } from "react-redux";
import { primaryColors } from "../UI/DesignSystem/colorPalette";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";

const TranscriptionInput = ({
  value,
  onChangeText,
  onMentionsChange,
  placeholder = "Enter text",
  projectId,
  containerStyle,
  inputStyle,
  microphoneButtonStyle,
  transcriptionApiUrl = "https://api.projectstudio.ai/core/transcribe/",
  onTranscriptionStart,
  onTranscriptionEnd,
  onTranscriptionError,
  rightIcon,
  mentions = [],
  hasIcon = true,
  usesBottomSheet = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [contactsFetched, setContactsFetched] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [localMentions, setLocalMentions] = useState(mentions || []);
  const { fetchProjectContacts } = useGeneralEndpoints();

  const token = useSelector((state) => state.auth.token);
  const organization_id = useSelector((state) => state.profile.organization_id);

  const triggersConfig = useMemo(
    () => ({
      mention: {
        trigger: "@",
        allowedSpacesCount: 1,
        textStyle: {
          color: primaryColors.brand[900],
          fontWeight: "bold",
        },
        isInsertSpaceAfterMention: true,
      },
    }),
    [],
  );

  const { textInputProps, triggers } = useMentions({
    value: value,
    onChange: onChangeText,
    triggersConfig: triggersConfig,
  });

  useEffect(() => {
    if (
      Array.isArray(mentions) &&
      (mentions.length !== localMentions.length ||
        !mentions.every((m, i) => m.id === localMentions[i]?.id))
    ) {
      setLocalMentions(mentions);
    }
  }, [mentions, localMentions]);

  useEffect(() => {
    if (projectId && token && organization_id && projectId !== "all_projects") {
      fetchProjectContacts(projectId, setContacts, setContactsFetched);
    }
  }, [projectId, token, organization_id]);

  // useEffect(() => {
  //   console.log("every console", triggers.mention);
  //   if (typeof triggers.mention.keyword === "string" && contactsFetched) {
  //     console.log("Setting set show true", triggers.mention.keyword);
  //     setShowPopover(true);
  //   } else if (triggers.mention.keyword === undefined) {
  //     console.log("Run set show popover to false", triggers.mention.keyword);
  //     setShowPopover(false);
  //   }
  // }, [triggers.mention.keyword]);

  const keywordRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const keyword = triggers.mention.keyword;

      // When keyword is undefined -> ignore temporary reset caused by backspace
      if (keyword === undefined || !contactsFetched) {
        setShowPopover(false);
      } else if (typeof keyword === "string" && contactsFetched) {
        console.log("This is the keyword", keyword);
        setShowPopover(true);
      }

      keywordRef.current = keyword;
    }, 100); // 50–80ms is ideal

    return () => clearTimeout(timeoutRef.current);
  }, [triggers.mention.keyword]);

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
          ? value + " " + response.data.text
          : response.data.text;

        onChangeText(newValue);
        onTranscriptionEnd?.(response.data.text);
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Transcription failed";
      Alert.alert("Error", msg);
      onTranscriptionError?.(msg);
    } finally {
      setIsTranscribing(false);
    }
  };

  const micButton = (
    <TouchableOpacity
      onPress={isRecording ? stopRecording : startRecording}
      style={[
        {
          backgroundColor: isRecording ? "#FFD700" : primaryColors.brand[1000],
          borderRadius: SW(20),
          width: SH(28),
          height: SH(28),
          justifyContent: "center",
          alignItems: "center",
        },
        microphoneButtonStyle,
      ]}
      disabled={isTranscribing}
    >
      {isTranscribing ? (
        <ActivityIndicator size={SW(12)} color={"#fff"} />
      ) : (
        <MaterialIcons
          name={isRecording ? "stop" : "mic"}
          size={SH(20)}
          color={"#fff"}
        />
      )}
    </TouchableOpacity>
  );

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
        style={{
          ...containerStyle,
          flex: 0,
          height: SH(88),
          paddingVertical: SH(4),
        }}
      >
        <TextInput
          {...textInputProps}
          placeholder={placeholder}
          style={inputStyle}
          multiline
        />

        <View
          style={{
            position: "absolute",
            right: SH(10),
            bottom: SH(10),
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: SW(4),
          }}
        >
          {rightIcon && rightIcon}
          {hasIcon && micButton}
        </View>
      </View>
    </>
  );
};

export default TranscriptionInput;

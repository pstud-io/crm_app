import { useState, useRef, useEffect } from "react";
import {
  useAudioRecorder,
  RecordingPresets,
  setAudioModeAsync,
  requestRecordingPermissionsAsync,
} from "expo-audio";
import axios from "axios";
import { Platform } from "react-native";

export const useRecorder = (options = {}) => {
  const defaultOptions = {
    autoTranscribe: true,
    shouldTranscribe: true,
    shouldTranscribeFormat: true,
  };

  const config = { ...defaultOptions, ...options };

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const [isRecording, setIsRecording] = useState(false);
  const [audioUri, setAudioUri] = (useState < string) | (null > null);
  const [transcription, setTranscription] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);

  const [recordingTime, setRecordingTime] = useState(0);
  const [formattedTime, setFormattedTime] = useState("00:00");

  const timerRef = (useRef < NodeJS.Timeout) | (null > null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    setFormattedTime(formatTime(recordingTime));
  }, [recordingTime]);

  const startTimer = () => {
    setRecordingTime(0);

    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startRecording = async () => {
    try {
      const permission = await requestRecordingPermissionsAsync();

      if (!permission.granted) {
        return;
      }

      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });

      await recorder.prepareToRecordAsync();
      recorder.record();

      setIsRecording(true);
      setTranscription("");
      startTimer();
    } catch (e) {
      console.error("Failed to start recording", e);
    }
  };

  const stopRecording = async (token) => {
    try {
      setIsRecording(false);
      stopTimer();

      await recorder.stop();

      const uri = recorder.uri;

      if (!uri) {
        return null;
      }

      setAudioUri(uri);

      if (config.shouldTranscribe && config.autoTranscribe) {
        await transcribeAudio(uri, token);
      }

      return uri;
    } catch (e) {
      console.error("Failed to stop recording", e);
      return null;
    }
  };

  const transcribeAudio = async (uri, token) => {
    setIsTranscribing(true);

    try {
      const formData = new FormData();

      formData.append("file", {
        uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
        name: "recording.m4a",
        type: "audio/m4a",
      });

      const endpoint =
        "https://api.projectstudio.ai/core/transcribe/formatted/";

      const response = await axios.post(endpoint, formData, {
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.text) {
        setTranscription(response.data.text);
      }
    } catch (e) {
      console.error("Transcription error", e);
    } finally {
      setIsTranscribing(false);
    }
  };

  const resetRecording = () => {
    setAudioUri(null);
    setTranscription("");
    setRecordingTime(0);
    setIsRecording(false);
  };

  return {
    isRecording,
    transcription,
    isTranscribing,
    formattedTime,
    recordingTime,
    audioUri,

    startRecording,
    stopRecording,
    resetRecording,
  };
};

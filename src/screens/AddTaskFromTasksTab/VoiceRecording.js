import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import { Colors } from "../../utils";
import { MicrophoneOutline, ReloadOutline, StopRecording } from "../../svg";
import { useFocusEffect } from "@react-navigation/native";
import { primaryColors } from "../../components/UI/DesignSystem/colorPalette";
import { useAudioPlayer } from "expo-audio";

export default function VoiceTaskInput({ voiceInput, createTaskFromVoice }) {
  const Audio = useAudioPlayer();
  const [status, setStatus] = useState("idle"); // idle | recording | transcribing | done | error
  const [recognizedText, setRecognizedText] = useState("");
  const recordingRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const token = useSelector((state) => state.auth.token);
  const organization_id = useSelector((state) => state.profile.organization_id);

  useEffect(() => {
    console.log("recordingref ", recordingRef.current);
    if (voiceInput && !recordingRef.current) {
      startRecording();
    }
    return () => {
      const cleanup = async () => {
        console.log("In cleanup of unmount");
        try {
          console.log("In try of unmount");
          if (recordingRef.current) {
            console.log("In first if of unmount");
            await recordingRef.current.stopAndUnloadAsync().catch(() => {});
            recordingRef.current = null;
          }
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
        } catch (err) {
          console.log("Cleanup error:", err);
        }
      };
      cleanup();
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        const cleanup = async () => {
          console.log("In cleanup of unmount");
          try {
            console.log("In try of unmount");
            if (recordingRef.current) {
              console.log("In first if of unmount");
              await recordingRef.current.stopAndUnloadAsync().catch(() => {});
              recordingRef.current = null;
            }
            if (silenceTimerRef.current) {
              clearTimeout(silenceTimerRef.current);
              silenceTimerRef.current = null;
            }
          } catch (err) {
            console.log("Cleanup error:", err);
          }
        };
        cleanup();
      };
    }, []),
  );

  const startRecording = async () => {
    try {
      if (recordingRef.current) {
        console.log("Recording already in progress.");
        return;
      }

      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        alert("Microphone permission is required.");
        return;
      }

      setStatus("recording");
      setRecognizedText("");

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        android: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
          meteringEnabled: true,
        },
        ios: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
          meteringEnabled: true,
        },
      });
      recording.setOnRecordingStatusUpdate(onRecordingStatusUpdate);
      await recording.startAsync();

      recordingRef.current = recording;
    } catch (err) {
      console.error("Recording error:", err);
      setStatus("error");
    }
  };

  const onRecordingStatusUpdate = (statusObj) => {
    if (!statusObj.isRecording) return;

    if (statusObj.metering !== undefined) {
      // Example threshold: below -40 dB = silence
      if (statusObj.metering < -40) {
        if (!silenceTimerRef.current) {
          silenceTimerRef.current = setTimeout(stopRecording, 2000);
        }
      } else {
        // Reset timer if speech detected
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
      }
    }
  };

  const stopRecording = async () => {
    try {
      clearTimeout(silenceTimerRef.current);

      if (!recordingRef.current) return;

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();

      recordingRef.current = null;

      if (uri) {
        await transcribeAudio(uri);
      }
    } catch (err) {
      console.error("Stop error:", err);
      setStatus("error");
      recordingRef.current = null;
    }
  };

  const transcribeAudio = async (uri) => {
    try {
      setStatus("transcribing");

      const formData = new FormData();
      formData.append("file", {
        uri,
        name: `audio_${Date.now()}.m4a`,
        type: "audio/m4a",
      });

      const res = await fetch("https://api.projectstudio.ai/core/transcribe/", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `token ${token}`,
          "X-OrganizationID": `${organization_id}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await res.json();
      console.log("Data of transcription", data);
      if (data?.text) {
        setRecognizedText(data?.text || "No transcription available");
        createTaskDataFromVoice(data.text);
      } else {
        setStatus("done");
      }
    } catch (err) {
      console.error("Transcription error:", err);
      setStatus("error");
    }
  };

  const createTaskDataFromVoice = async (text) => {
    try {
      setStatus("Creating Task");
      const res = await fetch(
        "https://api.projectstudio.ai/core/createtaskfromvoice/",
        {
          method: "POST",
          body: JSON.stringify({ voice_text: text }),
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": `${organization_id}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await res.json();
      console.log("Data of transpilation", data);
      setStatus("done");
      if (data.result) {
        await createTaskFromVoice(data);
      }
    } catch (err) {
      console.error("Transcription error:", err);
      setStatus("error");
    }
  };

  const reset = async () => {
    try {
      if (recordingRef.current) {
        // ✅ stop and unload to free the resource
        await recordingRef.current.stopAndUnloadAsync().catch(() => {});
        recordingRef.current = null;
      }
    } catch (err) {
      console.log("Reset error:", err);
    } finally {
      setStatus("idle");
      setRecognizedText("");
      silenceTimerRef.current && clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        {status === "idle" && (
          <TouchableOpacity style={styles.button} onPress={startRecording}>
            <MicrophoneOutline
              width={14}
              height={14}
              fill={Colors.black_text_color}
              stroke={Colors.black_text_color}
              strokeWidth={0.1}
            />
            <Text style={styles.buttonText}>Start Voice Input</Text>
          </TouchableOpacity>
        )}

        {status === "recording" && (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
              alignItems: "center",
            }}
          >
            <ActivityIndicator size={20} color="#000" />
            <Text style={styles.stateText}>Recording... Speak now</Text>
            <TouchableOpacity style={styles.stopButton} onPress={stopRecording}>
              <StopRecording
                stroke={"#ff0000"}
                strokeWidth={0.1}
                fill="#ff0000"
                width={24}
                height={24}
              />
            </TouchableOpacity>
          </View>
        )}

        {status === "transcribing" && (
          <View style={styles.stateBox}>
            <ActivityIndicator size={20} color="#000" />
            <Text style={styles.stateText}>Transcribing...</Text>
          </View>
        )}

        {(status === "Creating Task" || status === "error") && (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
            }}
          >
            <View style={styles.retryButton}>
              <ActivityIndicator size={20} color="#000" />
              <Text style={styles.stateText}>Creating Task</Text>
            </View>
            <Text style={styles.resultText}>
              {status === "error"
                ? "Error, please try again."
                : `Recognized: ${recognizedText}`}
            </Text>
          </View>
        )}

        {(status === "done" || status === "error") && (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
            }}
          >
            <TouchableOpacity style={styles.retryButton} onPress={reset}>
              <ReloadOutline
                width={12}
                height={12}
                stroke={Colors.black_text_color}
                fill={Colors.black_text_color}
                strokeWidth={1.5}
              />
              <Text style={styles.retryText}>Retake</Text>
            </TouchableOpacity>
            <Text style={styles.resultText}>
              {status === "error"
                ? "Error, please try again."
                : `Recognized: ${recognizedText}`}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: primaryColors.gray[200],
    borderRadius: 12,
    overflow: "hidden",
    flex: 1,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "400",
  },
  stateBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stateText: {
    fontSize: 14,
  },
  resultText: {
    fontSize: 14,
  },
  retryButton: {
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  retryText: {
    fontSize: 14,
    fontWeight: "400",
  },
  stopButton: {
    borderRadius: 8,
    overflow: "hidden",
  },
});

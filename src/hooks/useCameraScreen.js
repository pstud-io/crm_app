import { ActionSheetIOS, Platform, Alert } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import { StackActions, useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import { AudioModule, RecordingPresets, setAudioModeAsync } from "expo-audio";
import { userNavigationRef } from "@/navigation/UserNavigation";
export const useCameraScreen = ({
  setSelectedMedia,
  maxMediaLength = undefined,
}) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const navigation = useNavigation();
  const handleSelectMedia = async () => {
    console.log("Hit hadnle select media");
    try {
      const options = [
        "Cancel",
        "Take Photo",
        "Record Video",
        "Select from Memory",
        "Select from Gallery",
        "Record Audio",
      ];
      const cancelButtonIndex = 0;

      const handleSelection = async (buttonIndex) => {
        if (buttonIndex === 1) {
          await handleCaptureMedia("picture");
        } else if (buttonIndex === 2) {
          await handleCaptureMedia("video");
        } else if (buttonIndex === 3) {
          await handlePickFromMemory();
        } else if (buttonIndex === 4) {
          await handlePickFromGallery(); // 👈 implement this
        } else if (buttonIndex === 5) {
          await handleRecordAudio();
        }
      };

      if (Platform.OS === "ios") {
        ActionSheetIOS.showActionSheetWithOptions(
          { options, cancelButtonIndex },
          handleSelection,
        );
      } else {
        console.log("In android block");
        showActionSheetWithOptions(
          { options, cancelButtonIndex, useModal: false },
          handleSelection,
        );
      }
    } catch (err) {
      console.error("Media selection error:", err.message);
      Alert.alert(
        "Error",
        `An error occurred while selecting the files. Please try again. ${err.message}`,
      );
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission required",
          "You need to allow access to gallery.",
        );
        return;
      }

      const res = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: maxMediaLength === 1 ? false : true,
        mediaTypes: ["images", "livePhotos", "videos"],
        quality: 1,
      });

      if (!res.canceled) {
        console.log("These are the selected files", res.assets);

        const selectedFiles = res.assets.map((file) => ({
          name: file.name || file.fileName,
          uri: file.uri,
          size: file.size,
          type: file.mimeType || "application/octet-stream",
        }));

        setSelectedMedia((prevMedia) => {
          const newMedia = selectedFiles.filter(
            (file) => !prevMedia.some((media) => media.uri === file.uri),
          );

          console.log("new media", newMedia, prevMedia);

          if (newMedia.length > 0) {
            return [...prevMedia, ...newMedia];
          } else {
            Alert.alert(
              "No New Files",
              "All selected files are already in your selection.",
            );
            return prevMedia;
          }
        });
      }
    } catch (error) {
      console.error("Error picking media:", error);
      Alert.alert(
        "Error",
        "An error occurred while selecting media. Please try again.",
      );
    }
  };

  const handleCaptureMedia = async (mode) => {
    // Navigate to CameraScreen
    userNavigationRef.dispatch(
      StackActions.push("CameraScreen", {
        onSave: (mediaArray) => {
          console.log("Run on save from handle capture media");
          setSelectedMedia((prev) => [...prev, ...mediaArray]);
        },
        mode,
        maxMediaLength,
      }),
    );
  };

  const handleRecordAudio = async () => {
    const recorder = new AudioModule.AudioRecorder(
      RecordingPresets.HIGH_QUALITY,
    );
    try {
      const status = await AudioModule.requestRecordingPermissionsAsync();

      if (!status.granted) {
        Alert.alert("Permission Denied", "Microphone permission is required.");
        return;
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      await recorder.prepareToRecordAsync();

      await recorder.record();

      Alert.alert("Recording...", "Recording started.", [
        {
          text: "Stop Recording",
          onPress: async () => {
            await recorder.stop();

            const uri = recorder.uri;

            if (uri) {
              setSelectedMedia((prev) => [
                ...prev,
                {
                  uri,
                  name: `AUDIO_${Date.now()}.m4a`,
                  type: "audio/m4a",
                  size: null,
                },
              ]);
            }
          },
        },
      ]);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to record audio.");
    }
  };

  const handlePickFromMemory = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      multiple: maxMediaLength === 1 ? false : true,
      copyToCacheDirectory: true,
    });

    if (!res.canceled) {
      const selectedFiles = res.assets.map((file) => ({
        name: file.name,
        uri: file.uri,
        size: file.size,
        type: file.mimeType || "application/octet-stream",
      }));

      setSelectedMedia((prevMedia) => {
        const newMedia = selectedFiles.filter(
          (file) => !prevMedia.some((media) => media.uri === file.uri),
        );

        if (newMedia.length > 0) {
          return [...prevMedia, ...newMedia];
        } else {
          Alert.alert(
            "No New Files",
            "All selected files are already in your selection.",
          );
          return prevMedia;
        }
      });
    }
  };

  const handleDeleteMedia = (uri) => {
    setSelectedMedia((prev) => prev.filter((media) => media.uri !== uri));
  };

  return {
    handleSelectMedia,
    handleCaptureMedia,
    handlePickFromGallery,
    handlePickFromMemory,
    handleRecordAudio,
    handleDeleteMedia,
  };
};

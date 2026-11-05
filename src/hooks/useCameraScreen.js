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
  replace = false,
  useDeviceCamera = true,
}) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const navigation = useNavigation();
  const handleSelectMedia = async () => {
    console.log("Hit hadnle select media");
    try {
      const options = [
        ...(useDeviceCamera
          ? ["Cancel", "Take Photo", "Record Video"]
          : ["Cancel"]),
        "Select from Memory",
        "Select from Gallery",
        "Record Audio",
      ];
      const cancelButtonIndex = 0;

      const handleSelection = async (buttonIndex) => {
        const selectedOption = options[buttonIndex];

        switch (selectedOption) {
          case "Take Photo":
            await handleCaptureMedia("picture");
            break;

          case "Record Video":
            await handleCaptureMedia("video");
            break;

          case "Select from Memory":
            await handlePickFromMemory();
            break;

          case "Select from Gallery":
            await handlePickFromGallery();
            break;

          case "Record Audio":
            await handleRecordAudio();
            break;
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

        if (replace) {
          setSelectedMedia(selectedFiles.slice(0, maxMediaLength));
          return;
        }

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
          if (replace) {
            setSelectedMedia([...mediaArray]);
            return;
          }
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
              if (replace) {
                setSelectedMedia([
                  {
                    uri,
                    name: `AUDIO_${Date.now()}.m4a`,
                    type: "audio/m4a",
                    size: null,
                  },
                ]);
                return;
              }
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

      if (replace) {
        setSelectedMedia(selectedFiles);
        return;
      }

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

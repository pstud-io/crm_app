import { useCallback, useRef, useState } from "react";
import { View, Modal, Alert, StyleSheet, Text } from "react-native";
import { Colors, SH, SF } from "../../utils";
import { Spacing } from "../../components/common";
import apiEndpoint from "../../config/apiConfig";
import axios from "axios";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { CloseOutlineIcon } from "../../svg";
import Toast from "react-native-toast-message";
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { Platform, ActionSheetIOS } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Audio } from "expo-av";
import Pdf from "react-native-pdf";
import { useVideoPlayer, VideoView } from "expo-video";
import { MediaCarousel } from "../../components";
import { FlatList } from "react-native";
import { api } from "@/api/client";

const IMAGE_SIZE = 75;

const ProgressMedia = ({ activity, item }) => {
  const { showActionSheetWithOptions } = useActionSheet();

  const {
    created_on,
    current_status,
    remark,
    last_status,
    project_activity_status_assets,
  } = item;
  const { fk_project } = activity;
  const context_id = item?.id;
  const token = useSelector((state) => state.auth.token);
  const organization_id = useSelector((state) => state.profile.organization_id);

  const [comment, setComment] = useState("");
  const [commentsData, setCommentsData] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState([]);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const mediaCarouselRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      getComments();
    }, []),
  );

  // Function to open media (Image, Video, Audio, PDF)

  const [loading, setLoading] = useState({
    getComments: false,
    postComment: false,
  });

  const [modal, setModal] = useState({
    visible: false,
    title: "",
    message: "",
  });

  const setModalState = (newState) => {
    setModal((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };
  const getComments = async () => {
    setLoading({ ...loading, getComments: true });

    //log the url
    // console.log(
    //   `${apiEndpoint}/core/comments/?context_id=${context_id}&context_type=activity`
    // );

    try {
      const response = await axios.get(
        `${apiEndpoint}/core/comments/?context_id=${context_id}&context_type=activity`,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        setCommentsData(response.data.result);
      }
    } catch (error) {
      if (error.response) {
        console.error("Response error:", error.response.data);
      } else if (error.request) {
        console.error("Network error:", error.request);
      } else {
        console.error("Request error:", error.message);
      }
      setModalState({
        visible: true,
        title: "Error",
        message:
          error.response?.data?.result ||
          "Failed to fetch data. Check your network connection.",
      });
    } finally {
      setLoading({ ...loading, getComments: false });
    }
  };

  const generateTimestampString = () => {
    const now = new Date();
    return now.toISOString().replace(/[:.-]/g, ""); // Remove special characters for a clean string
  };

  const handlePostComment = async () => {
    //console.log("Posting comment:", comment);
    if (comment.trim() === "") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Comment cannot be empty.",
      });
      return;
    }

    setLoading({ ...loading, postComment: true });
    try {
      const timestampId = generateTimestampString();

      const mediaUploadRequests = selectedMedia.map((media) => ({
        id: `${organization_id}/${fk_project}/${timestampId}${media.name
          .replace(/[ •\s]+/g, "_")
          .replace(/\+/g, "_")}`,
        file_name: `${organization_id}/${fk_project}/${timestampId}${media.name
          .replace(/[ •\s]+/g, "_")
          .replace(/\+/g, "_")}`,
      }));

      // Step 1: Presigned URLs
      const presignedResponse = await api.post(
        `${apiEndpoint}/core/presignedurls/`,
        {
          bucket: "ps-organization-assets",
          data: mediaUploadRequests,
        },
      );

      if (presignedResponse.status >= 200 && presignedResponse.status < 300) {
        console.log("Presigned URLs:", presignedResponse.data);

        // Step 2: Upload files to presigned URLs
        const uploadResponses = await Promise.all(
          selectedMedia.map(async (media, index) => {
            const presignedUrl = presignedResponse.data.result[index]?.url;
            if (!presignedUrl) {
              throw new Error(
                `Presigned URL not found for file: ${media.name}`,
              );
            }

            const fileData = await FileSystem.readAsStringAsync(media.uri, {
              encoding: FileSystem.EncodingType.Base64,
            });

            if (!fileData || fileData.length === 0) {
              throw new Error(`Failed to read file: ${media.name}`);
            }

            const uploadResponse = await fetch(presignedUrl, {
              method: "PUT",
              headers: {
                "Content-Type": media.type || "application/octet-stream",
              },
              body: Buffer.from(fileData, "base64"),
            });

            if (!uploadResponse.ok) {
              throw new Error(`File upload failed for ${media.name}`);
            }

            return {
              name: media.name,
              size: media.size || 0,
              type: media.type || "application/octet-stream",
              url: `https://dytjimnn1nskw.cloudfront.net/${organization_id}/${fk_project}/${timestampId}${media.name
                .replace(/[ •\s]+/g, "_")
                .replace(/\+/g, "_")}`,
            };
          }),
        );

        console.log("Uploaded files metadata:", uploadResponses);

        // Step 3: Add assets in core/assets
        const assetResponse = await axios.post(
          `${apiEndpoint}/core/assets/`,
          uploadResponses,
          {
            headers: {
              Authorization: `token ${token}`,
              "X-OrganizationID": organization_id,
            },
          },
        );

        if (assetResponse.status >= 200 && assetResponse.status < 300) {
          console.log("Asset response:", assetResponse.data);
          const fk_assets = assetResponse?.data?.result.map(
            (asset) => asset.id,
          ); // Get all fk_asset IDs
          console.log("Asset IDs:", fk_assets);

          // Step 4: Post comment with all fk_asset IDs
          const payload = {
            fk_asset: fk_assets || [], // Use all asset IDs
            text: comment,
          };

          console.log("Payload:", payload);
          const commentPostResponse = await axios.post(
            `${apiEndpoint}/core/comments/?context_id=${context_id}&context_type=activity`,
            payload,
            {
              headers: {
                Authorization: `token ${token}`,
                "X-OrganizationID": organization_id,
              },
            },
          );

          if (
            commentPostResponse.status >= 200 &&
            commentPostResponse.status < 300
          ) {
            Toast.show({
              type: "success",
              text1: "Success",
              text2: "Comment added successfully.",
              visibilityTime: 1000,
              autoHide: true,
            });
            setComment("");
            setSelectedMedia([]);
            getComments();
          }
        }
      }
    } catch (error) {
      if (error.response) {
        console.error("Response error:", error.response.data);
      } else if (error.request) {
        console.error("Network error:", error.request);
      } else {
        console.error("Request error:", error.message);
      }
      setModalState({
        visible: true,
        title: "Error",
        message:
          error.response?.data?.result ||
          "Failed to fetch data. Check your network connection.",
      });
    } finally {
      setLoading({ ...loading, postComment: false });
    }
  };

  const handleSelectMedia = async () => {
    try {
      const options = [
        "Cancel",
        "Take Photo",
        "Record Video",
        "Select from Memory",
        "Record Audio",
      ];
      const cancelButtonIndex = 0;

      const handleSelection = async (buttonIndex) => {
        if (buttonIndex === 1) {
          await handleCaptureMedia("photo");
        } else if (buttonIndex === 2) {
          await handleCaptureMedia("video");
        } else if (buttonIndex === 3) {
          await handlePickFromMemory();
        } else if (buttonIndex === 4) {
          await handleRecordAudio();
        }
      };

      if (Platform.OS === "ios") {
        ActionSheetIOS.showActionSheetWithOptions(
          { options, cancelButtonIndex },
          handleSelection,
        );
      } else {
        showActionSheetWithOptions(
          { options, cancelButtonIndex },
          handleSelection,
        );
      }
    } catch (err) {
      console.error("Media selection error:", err.message);
      Alert.alert(
        "Error",
        "An error occurred while selecting the files. Please try again.",
      );
    }
  };

  // 📸 Handle Photo or Video Capture
  const handleCaptureMedia = async (type) => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Denied", "Camera permission is required.");
      return;
    }

    const mediaType =
      type === "photo"
        ? ImagePicker.MediaTypeOptions.Images
        : ImagePicker.MediaTypeOptions.Videos;
    const mediaResult = await ImagePicker.launchCameraAsync({
      mediaTypes: mediaType,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!mediaResult.canceled) {
      const newMedia = {
        name: `${type.toUpperCase()}_${new Date().getTime()}.${
          type === "photo" ? "jpg" : "mp4"
        }`,
        uri: mediaResult.assets[0].uri,
        size: null,
        type: type === "photo" ? "image/jpeg" : "video/mp4",
      };

      setSelectedMedia((prevMedia) => [...prevMedia, newMedia]);
    }
  };

  // const handleCaptureMedia = async () => {
  //   // Navigate to CameraScreen
  //   navigation.navigate("CameraScreen", {
  //     onSave: (mediaArray) => {
  //       setSelectedMedia((prev) => [...prev, ...mediaArray]);
  //     },
  //   });
  // };

  // 🎤 Handle Audio Selection
  let recording = null;
  const handleRecordAudio = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission Denied", "Microphone permission is required.");
        return;
      }

      // ✅ Set the audio mode for iOS (allows recording, even in silent mode)
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );

      recording = newRecording;

      Alert.alert("Recording...", "Recording started. Press OK to stop.", [
        {
          text: "Stop Recording",
          onPress: async () => {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            if (uri) {
              const name = `AUDIO_${new Date().getTime()}.m4a`;
              setSelectedMedia((prevMedia) => [
                ...prevMedia,
                {
                  uri,
                  name,
                  type: "audio/m4a",
                  size: null,
                },
              ]);
            }
          },
        },
      ]);
    } catch (err) {
      console.error("Audio recording error:", err.message);
      Alert.alert("Error", "An error occurred while recording audio.");
    }
  };

  // 📂 Handle Memory Selection
  const handlePickFromMemory = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      multiple: true,
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

  const handleDeleteImage = (index) => {
    setSelectedMedia((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // const renderItem = ({ item, index }) => (
  //   <TouchableOpacity
  //     onPress={() => {
  //       setSelectedIndex(index);
  //       setCaraouselMediaModalVisible(true);
  //     }}
  //   >
  //     <View style={styles.imageBox}>
  //       <Image
  //         source={{ uri: item.asset_details?.url }}
  //         style={styles.imagex}
  //       />
  //     </View>
  //   </TouchableOpacity>
  // );

  const renderItem = ({ item, index }) => {
    const url = item.asset_details?.url;
    const type = item.asset_details?.type;
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          setSelectedIndex(index);
          setTimeout(async () => {
            await mediaCarouselRef.current?.present();
          }, 0);
        }}
        style={{ ...styles.imageBox, marginVertical: 2 }}
      >
        {type === "application/pdf" ? (
          <Pdf
            source={{ uri: url, cache: true }}
            style={{ width: "100%", height: "100%" }}
            onError={(error) => console.log("PDF Error:", error)}
            useWebKit={true} // use webkit for pdf rendering
            trustAllCerts={false} //skip ssl verification
          />
        ) : type === "video/mp4" ? (
          <>
            <Image
              source={{ uri: item.asset_details?.thumbnailUrl || url }}
              style={styles.imagex}
            />
            <View
              style={{
                position: "absolute",
                height: IMAGE_SIZE,
                width: IMAGE_SIZE,
                backgroundColor: "#000",
                top: 0,
                left: 0,
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
              }}
            >
              {/* <PlayOutline
                stroke={Colors.white}
                strokeWidth={12}
                width={32}
                height={32}
                fill={Colors.white}
              /> */}
              <Text
                style={{
                  fontSize: 32,
                  color: "white",
                  fontFamily: "Inter-Regular",
                }}
              >
                ▶
              </Text>
            </View>
          </>
        ) : type === "audio/wav" ? (
          <>
            <Image
              source={{ uri: item.asset_details?.thumbnailUrl || url }}
              style={styles.imagex}
            />
            <View
              style={{
                position: "absolute",
                height: IMAGE_SIZE,
                width: IMAGE_SIZE,
                backgroundColor: "#000",
                top: 0,
                left: 0,
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
              }}
            >
              {/* <MusicOutline
                stroke={Colors.white}
                strokeWidth={8}
                width={40}
                height={40}
                fill={Colors.white}
              /> */}
              <Text
                style={{
                  fontSize: 32,
                  color: "white",
                  fontFamily: "Inter-Regular",
                }}
              >
                ♬
              </Text>
            </View>
          </>
        ) : (
          <Image source={{ uri: url }} style={styles.imagex} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.theme_background,
        borderWidth: 0,
        borderColor: Colors.blue_color,
      }}
    >
      <Spacing space={SH(20)} />

      <FlatList
        // style={{ width: "50%" }}
        horizontal
        data={project_activity_status_assets}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
      />

      <Spacing space={SH(10)} />

      {selectedIndex !== null && (
        <MediaCarousel
          mediaFiles={project_activity_status_assets}
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

export default ProgressMedia;

const styles = StyleSheet.create({
  uploadButtonText: {
    fontSize: SF(11),
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
    fontSize: SF(11),
    color: Colors.primary,
    fontFamily: "Inter-Regular",
    marginTop: 0,
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 25,
  },
  video: {
    width: "100%",
    height: "70%",
  },
  pdf: {
    width: "100%",
    height: "70%",
  },
  image: {
    width: "90%",
    height: "70%",
    resizeMode: "contain",
  },
  container: {
    marginTop: 20,
  },
  imageBox: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    marginRight: 4,
    backgroundColor: "#eee",
    borderRadius: 4,
    overflow: "hidden",
  },
  imagex: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

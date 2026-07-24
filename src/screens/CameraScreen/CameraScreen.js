import { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  Alert,
  StyleSheet,
  Linking,
  BackHandler,
} from "react-native";
import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import { VideoView as Video } from "expo-video";
import {
  CloseOutlineIcon,
  ImageShutterOutline,
  ReloadOutline,
  TickOutline,
  VideoShutterOutline,
} from "../../svg";
import { Colors, SF, SH, SW } from "../../utils";
import FlashOffOutline from "../../svg/flashoff-outline";
import FlashOnOutline from "../../svg/flashon-outline";
import StopShutterOutline from "../../svg/stop-shutter";
import * as FileSystem from "expo-file-system/legacy";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { body } from "../../components/UI/DesignSystem/typography";
import Toast from "react-native-toast-message";

const CameraScreen = ({ navigation, route, onClose, onSave }) => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const initialMode = route?.params?.mode || "picture";
  const maxMediaLength = route?.params?.maxMediaLength;
  const [microphonePermission, requestMicrophonePermission] =
    useMicrophonePermissions();
  const [cameraType, setCameraType] = useState("back");
  const [flash, setFlash] = useState("off");
  const [mode, setMode] = useState(initialMode);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [captures, setCaptures] = useState([]);
  const cameraRef = useRef(null);
  const cannotContinueCapturing =
    maxMediaLength !== undefined && captures.length === maxMediaLength;
  useFocusEffect(
    useCallback(() => {
      async function check() {
        const camStatus = await requestCameraPermission();
        const micStatus = await requestMicrophonePermission();
        if (!camStatus.granted || !micStatus.granted) {
          Alert.alert(
            "Permission required",
            "Camera and Microphone access required to proceed",
            [
              {
                text: "Cancel",
                style: "cancel",
                onPress: onClose,
              },
              {
                text: "Open Settings",
                onPress: () => Linking.openSettings(),
              },
            ],
          );
        }
      }
      check();
    }, []),
  );

  const handleBackPress = () => {
    navigation.pop();
    return true; // Prevent default behavior
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress,
    );
    return () => backHandler.remove(); // Cleanup listener
  }, []);

  const takePicture = async () => {
    console.log("Taking picture...");
    if (cannotContinueCapturing) {
      console.log("Cannot continue");
      Toast.show({
        type: "info",
        text1: "Cannot Perform Action",
        text2: `Maximum ${maxMediaLength} allowed`,
        visibilityTime: 1000,
        autoHide: true,
      });
      return;
    }

    if (cameraRef.current) {
      console.log("In if block");
      const photo = await cameraRef.current.takePictureAsync();
      console.log("Photo:", photo);
      const fileInfo = await FileSystem.getInfoAsync(photo.uri);
      console.log("Photo", photo, fileInfo);
      const newMedia = {
        name: `PHOTO_${Date.now()}.jpg`,
        uri: photo.uri,
        type: "image/jpeg",
        size: fileInfo.size,
      };
      setCaptures((prev) => [...prev, newMedia]);
    }
  };

  const startRecording = async () => {
    if (cannotContinueCapturing) return;
    if (cameraRef.current && !isRecording) {
      setIsRecording(true);
      setRecordTime(0);
      const timer = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);
      try {
        const video = await cameraRef.current?.recordAsync({ codec: "avc1" });
        const fileInfo = await FileSystem.getInfoAsync(video.uri);

        const newMedia = {
          name: `VIDEO_${Date.now()}.mp4`,
          uri: video.uri,
          type: "video/mp4",
          size: fileInfo.size,
        };
        setCaptures((prev) => [...prev, newMedia]);
      } catch (err) {
        console.log("❌ Recording error (full):", err);
        Alert.alert("Recording error", err.message);
      } finally {
        clearInterval(timer);
        setIsRecording(false);
        setRecordTime(0);
      }
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current && isRecording) {
      await cameraRef.current.stopRecording();
      setIsRecording(false);
      setRecordTime(0);
    }
  };

  const handleDeleteMedia = (index) => {
    const newCaptures = captures.filter((media, i) => index !== i);
    setCaptures(newCaptures);
  };

  if (!cameraPermission?.granted || !microphonePermission?.granted) {
    return null;
  }

  return (
    <>
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing={cameraType}
          ref={cameraRef}
          flash={flash}
          mute={false}
          mode={mode}
          videoQuality="480p"
        />
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={styles.footer}>
            <TouchableOpacity
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: SW(4),
                borderRadius: SW(36),
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                width: SH(40),
                height: SH(40),
              }}
              onPress={onClose}
            >
              <CloseOutlineIcon
                fill={Colors.white}
                width={SW(16)}
                height={SH(16)}
              />
            </TouchableOpacity>
            {isRecording && (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: SW(12),
                  paddingVertical: SH(8),
                  borderRadius: SW(36),
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  width: SW(100),
                }}
                onPress={() => setMode("video")}
              >
                <Text
                  style={mode === "video" ? styles.active : styles.inactive}
                >
                  {String(Math.floor(recordTime / 3600)).padStart(2, "0")}:
                  {String(Math.floor((recordTime % 3600) / 60)).padStart(
                    2,
                    "0",
                  )}
                  :{String(recordTime % 60).padStart(2, "0")}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: SW(4),
                borderRadius: SW(36),
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                width: SH(40),
                height: SH(40),
              }}
              onPress={() => {
                setFlash(flash === "on" ? "off" : "on");
              }}
            >
              {flash === "on" ? (
                <FlashOnOutline
                  fill={"transparent"}
                  width={SW(20)}
                  height={SH(20)}
                  stroke={"white"}
                  strokeWidth={1}
                />
              ) : (
                <FlashOffOutline
                  fill={"transparent"}
                  width={SW(20)}
                  height={SH(20)}
                  stroke={"white"}
                  strokeWidth={1}
                />
              )}
            </TouchableOpacity>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "50%",
            }}
          >
            <FlatList
              contentContainerStyle={{
                alignItems: "flex-end",
                display: "flex",
                flexDirection: "row",
                gap: SW(12),
                justifyContent: "center",
                paddingHorizontal: SW(20),
              }}
              data={captures}
              showsHorizontalScrollIndicator={false}
              scrollEnabled
              horizontal
              keyExtractor={(item) => item.uri}
              renderItem={({ item, index }) =>
                item.type === "image/jpeg" ? (
                  <View style={{ position: "relative" }}>
                    <Image
                      source={{ uri: item.uri }}
                      style={{
                        width: SH(80),
                        height: SH(80),
                        borderRadius: SW(8),
                      }}
                    />
                    <TouchableOpacity
                      style={{
                        position: "absolute",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: SW(4),
                        borderRadius: SW(16),
                        backgroundColor: Colors.black_text_color,
                        width: SH(20),
                        height: SH(20),
                        top: -SH(6),
                        right: -SH(6),
                      }}
                      onPress={() => handleDeleteMedia(index)}
                    >
                      <CloseOutlineIcon
                        width={SW(10)}
                        height={SH(10)}
                        fill={Colors.white}
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={{ position: "relative" }}>
                    <Video
                      source={{ uri: item.uri }}
                      style={{
                        width: SH(80),
                        height: SH(80),
                        borderRadius: SW(8),
                      }}
                      resizeMode="cover"
                      shouldPlay={false}
                      isMuted
                    />
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: SF(32), color: "white" }}>
                        ▶
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{
                        position: "absolute",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: SW(4),
                        borderRadius: SW(16),
                        backgroundColor: Colors.black_text_color,
                        width: SH(20),
                        height: SH(20),
                        top: -SH(6),
                        right: -SH(6),
                      }}
                      onPress={() => handleDeleteMedia(index)}
                    >
                      <CloseOutlineIcon
                        width={SW(10)}
                        height={SH(10)}
                        fill={Colors.white}
                      />
                    </TouchableOpacity>
                  </View>
                )
              }
            />
            <View style={styles.controls}>
              <TouchableOpacity
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 4,
                  borderRadius: SW(40),
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  width: SH(40),
                  height: SH(40),
                }}
                onPress={() => {
                  console.log("Pressed reload");
                  isRecording && (stopRecording(), setIsRecording(false));
                  setCameraType((prev) => (prev === "back" ? "front" : "back"));
                }}
              >
                <ReloadOutline
                  fill={Colors.white}
                  width={SW(14)}
                  height={SH(14)}
                  strokeWidth={1}
                />
              </TouchableOpacity>

              {mode === "picture" ? (
                <TouchableOpacity
                  onPress={async () => await takePicture()}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ImageShutterOutline
                    width={SW(72)}
                    height={SH(72)}
                    fill={cannotContinueCapturing && "#fefefe"}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={isRecording ? stopRecording : startRecording}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isRecording ? (
                    <StopShutterOutline width={SW(72)} height={SH(72)} />
                  ) : (
                    <VideoShutterOutline
                      width={SW(72)}
                      height={SH(72)}
                      fill={cannotContinueCapturing && "#fefefe"}
                    />
                  )}
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 4,
                  borderRadius: SW(40),
                  backgroundColor:
                    captures.length > 0
                      ? Colors.primary
                      : Colors.gray_text_color,
                  width: SH(40),
                  height: SH(40),
                }}
                onPress={() => {
                  captures.length > 0 ? onSave(captures) : () => {};
                }}
              >
                <TickOutline
                  width={SW(24)}
                  height={SH(24)}
                  strokeWidth={SW(2)}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 0,
                borderRadius: SW(36),
                marginBottom: SH(16),
              }}
            >
              <TouchableOpacity
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: SW(12),
                  paddingVertical: SH(8),
                  borderRadius: SW(36),
                  backgroundColor:
                    mode === "picture" ? "rgba(0, 0, 0, 0.6)" : "transparent",
                }}
                onPress={() => {
                  isRecording && (stopRecording(), setIsRecording(false));
                  setMode("picture");
                }}
              >
                <Text
                  style={mode === "picture" ? styles.active : styles.inactive}
                >
                  Photo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: SW(12),
                  paddingVertical: SH(8),
                  borderRadius: SW(36),
                  backgroundColor:
                    mode === "video" ? "rgba(0, 0, 0, 0.6)" : "transparent",
                }}
                onPress={() => setMode("video")}
              >
                <Text
                  style={mode === "video" ? styles.active : styles.inactive}
                >
                  Video
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      {/* <Toast /> */}
    </>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  controls: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: SW(20),
    gap: SW(28),
  },
  inactive: {
    color: "white",
    ...body.md.medium,
  },
  active: {
    color: "white",
    ...body.md.medium,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: SW(16),
    backgroundColor: "transparent",
    alignItems: "center",
    width: "100%",
  },
});

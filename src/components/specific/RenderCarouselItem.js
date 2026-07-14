import { Image, StyleSheet, View } from "react-native";
import Pdf from "react-native-pdf";
import AudioPlayer from "./AudioPlayer";
import { Video } from "expo-video";
import { TouchableOpacity } from "react-native";
import { useImagePinCoordinates } from "../../hooks/useImagePinCoordinates";
import { useSelector } from "react-redux";
import { openNewPinCommentBottomSheet } from "../common/NewPinCommentBottomSheetService";
import { useEffect, useRef, useState } from "react";
import ViewPinCommentSheet from "../UI/GeneralComponents/ViewPinCommentSheet";
import { NewPinCommentSheet } from "../UI/GeneralComponents/NewPinCommentSheet";
import { usePinCommentEndpoints } from "../../hooks/usePinCommentEndpoints";
import Toast from "react-native-toast-message";
import { toastConfig } from "../UI/GeneralComponents/CustomToast";
import apiEndpoint from "../../config/apiConfig";
import { Colors, SH, SW } from "../../utils";
import { PinCommentsOutline } from "../../svg";
import PDFWithPins from "../UI/GeneralComponents/PDFWithPins";
import ZoomableImageWithPins from "../UI/GeneralComponents/ZoomableImageWithPins";
const RenderCarouselItem = ({
  item,
  setShowActionButtonsNCS,
  setShowActionButtonsVCS,
  activeIndex,
  itemIndex,
  pdfRef,
}) => {
  const fileName =
    item.file_name ||
    item.asset_details?.name ||
    item.name ||
    item.asset_info?.name ||
    "";
  const url =
    item.asset_details?.url || item?.url || item?.uri || item.asset_info?.url;
  const fileExtension = fileName.split(".").pop()?.toLowerCase();

  function getFileType(mimeType) {
    if (!mimeType || typeof mimeType !== "string") return "unknown";

    const [type, subtype] = mimeType.split("/");

    if (type === "video") return "video";
    if (type === "audio") return "audio";
    if (type === "image") return "image";
    if (mimeType === "application/pdf") return "pdf";

    return "unknown";
  }

  const fileType = getFileType(
    item?.type || item?.asset_info?.type || item?.asset_details?.type,
  );

  const isVideo = fileType === "video";
  const isAudio = fileType === "audio";
  const isPDF = fileType === "pdf";
  const isImage = fileType === "image";

  const commentGetUrl = `${apiEndpoint}/moodboards/pin-comment/?context_id=${item.fk_asset ?? item.id}&context_type=project_board_item`;

  const [loading, setLoading] = useState({
    getComment: true,
  });

  const [activeMediaPinCommentsData, setActiveMediaPinCommentsData] =
    useState(null);

  const [activeChain, setActiveChain] = useState(null);

  const project = useSelector((state) => state.project.selectedProject);
  const newPinCommentBottomSheetRef = useRef(null);
  const viewPinCommentBottomSheetRef = useRef(null);
  const urlRefForMedia = useRef(null);
  const { getPinComments } = usePinCommentEndpoints();

  useEffect(() => {
    if (isAudio || isVideo) return;
    if (!item.fk_asset && !item.id) return;
    const fetchPinComments = async () => {
      if (itemIndex === activeIndex) {
        const pinCommentData = await getPinComments(setLoading, commentGetUrl);
        setActiveMediaPinCommentsData([...pinCommentData]);
      }
    };

    fetchPinComments();
  }, [activeIndex, isAudio, isVideo, item?.fk_asset, item?.id]);

  // useEffect(() => {
  //   if (isAudio || isVideo) return;
  //   if (!item.fk_asset && !item.id) return;
  //   if (loading.getComment) {
  //     Toast.show({
  //       type: "loadingToast",
  //       autoHide: false, // keep it visible
  //     });
  //   } else {
  //     Toast.hide();
  //   }
  // }, [loading.getComment, isAudio, isVideo, item?.fk_asset, item?.id]);

  const {
    onContainerLayout,
    getPinFromPress,
    imageReady,
    getRenderedImageRect,
    getPinPosition,
  } = useImagePinCoordinates(url);

  const onPost = async () => {
    const pinCommentData = await getPinComments(setLoading, commentGetUrl);

    // Always guard against undefined/null
    const safeData = pinCommentData || [];

    setActiveMediaPinCommentsData((prev) => [...safeData]);

    if (activeChain?.id) {
      const updatedChain = safeData.find(
        (item) => (item.fk_asset ?? item.id) === activeChain.id,
      );

      setActiveChain(updatedChain || null);
    }
  };

  // const dispatch = useDispatch();

  return (
    <>
      <View style={styles.mediaContainer}>
        {isVideo ? (
          <Video
            source={{ uri: url }}
            style={styles.media}
            useNativeControls
            resizeMode="contain"
          />
        ) : isPDF ? (
          !item.fk_asset && !item.id ? (
            <Pdf
              ref={pdfRef}
              source={{ uri: url }}
              style={styles.pdf}
              useWebKit={true}
              trustAllCerts={false}
              onError={(error) => console.log("PDF Error:", error)}
            />
          ) : (
            <PDFWithPins
              uri={url}
              newPinCommentBottomSheetRef={newPinCommentBottomSheetRef}
              urlRefForMedia={urlRefForMedia}
              item={item}
              setShowActionButtonsNCS={setShowActionButtonsNCS}
              setActiveChain={setActiveChain}
              setShowActionButtonsVCS={setShowActionButtonsVCS}
              viewPinCommentBottomSheetRef={viewPinCommentBottomSheetRef}
              activeMediaPinCommentsData={activeMediaPinCommentsData}
            />
          )
        ) : isAudio ? (
          <AudioPlayer uri={url} />
        ) : (
          <ZoomableImageWithPins
            uri={url}
            item={item}
            imageReady={imageReady}
            activeMediaPinCommentsData={activeMediaPinCommentsData}
            onContainerLayout={onContainerLayout}
            getPinFromPress={getPinFromPress}
            getRenderedImageRect={getRenderedImageRect}
            getPinPosition={getPinPosition}
            setShowActionButtonsNCS={setShowActionButtonsNCS}
            setShowActionButtonsVCS={setShowActionButtonsVCS}
            setActiveChain={setActiveChain}
            newPinCommentBottomSheetRef={newPinCommentBottomSheetRef}
            viewPinCommentBottomSheetRef={viewPinCommentBottomSheetRef}
            urlRefForMedia={urlRefForMedia}
            openNewPinCommentBottomSheet={openNewPinCommentBottomSheet}
          />
        )}
      </View>
      {activeIndex === itemIndex && (
        <>
          <ViewPinCommentSheet
            key={item.id}
            viewPinCommentBottomSheetRef={viewPinCommentBottomSheetRef}
            activeChain={activeChain}
            setShowActionButtonsVCS={setShowActionButtonsVCS}
            newPinCommentBottomSheetRef={newPinCommentBottomSheetRef}
            urlRefForMedia={urlRefForMedia}
            item={item}
          />
          <NewPinCommentSheet
            fk_project={project.id}
            onPost={async () => {
              await onPost();
            }}
            newPinCommentBottomSheetRef={newPinCommentBottomSheetRef}
            urlRefForMedia={urlRefForMedia}
            setShowActionButtonsNCS={setShowActionButtonsNCS}
          />
          <Toast config={toastConfig} />
        </>
      )}
    </>
  );
};

export default RenderCarouselItem;

const styles = StyleSheet.create({
  mediaContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
  },
  pdfContainer: {
    width: "100%",
    height: "100%",
  },
  media: {
    resizeMode: "contain",
    width: "100%",
    height: "100%",
    borderWidth: 0,
  },
  pdf: {
    width: "100%",
    height: "100%",
  },
});

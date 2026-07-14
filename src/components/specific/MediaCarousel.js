import { useState, useRef, forwardRef } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
// import Carousel from "react-native-snap-carousel";
import { ChevronUp, CloseOutlineIcon } from "../../svg";
import { SW } from "../../utils";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Dimensions } from "react-native";
import { Platform } from "react-native";
import RenderCarouselItem from "./RenderCarouselItem";
import { useSharedValue } from "react-native-reanimated";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

const MediaCarousel = forwardRef(
  ({ mediaFiles, onClose, initialIndex = 0 }, ref) => {
    const EMPTY_MEDIA = {
      created_on: "...",
      id: "...",
      name: "...",
      type: "image/jpeg",
      url: "...",
    };
    const patchedMediaFiles = [EMPTY_MEDIA, ...mediaFiles];
    const [currentIndex, setCurrentIndex] = useState(initialIndex + 1);
    const [showActionButtonsNCS, setShowActionButtonsNCS] = useState(true);
    const [showActionButtonsVCS, setShowActionButtonsVCS] = useState(true);
    const [isAnimated, setIsAnimate] = useState(false);
    const carouselRef = useRef(null);
    const pdfRef = useRef(null);
    const { width: screenWidth, height: screenHeight } =
      Dimensions.get("screen");
    const goToPrevious = () => {
      if (currentIndex > 1) {
        // NOT 0 anymore
        carouselRef.current?.snapToPrev();
      }
    };

    const goToNext = () => {
      if (currentIndex < patchedMediaFiles.length - 1) {
        carouselRef.current?.snapToNext();
      }
    };

    return (
      <>
        <BottomSheetModal
          snapPoints={["100%"]}
          ref={ref}
          enableDynamicSizing={false}
          enableOverDrag={false}
          enablePanDownToClose={true}
          detached={true}
          enableContentPanningGesture={false}
          enableBlurKeyboardOnGesture={false}
          enableHandlePanningGesture={false}
          handleComponent={null}
          stackBehavior="push"
          backgroundStyle={{ backgroundColor: "transparent" }}
          onAnimate={async (fromIndex, toIndex) => {
            if (fromIndex === -1 && toIndex === 0) {
              setIsAnimate(true);
            }
          }}
          // onChange={async (index) => {
          //   if (index >= 0) {
          //     setIsAnimate(true);
          //   }
          // }}
          backdropComponent={(props) => {
            return (
              <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                opacity={0.5}
              />
            );
          }}
        >
          {showActionButtonsNCS && showActionButtonsVCS && (
            <TouchableOpacity
              style={{
                ...styles.closeButton,
                marginTop: Platform.OS === "ios" && 48,
              }}
              onPress={async () => {
                await onClose();
              }}
            >
              <CloseOutlineIcon fill="white" width={14} height={14} />
            </TouchableOpacity>
          )}

          <BottomSheetView style={styles.carouselContainer}>
            {currentIndex >= 0 &&
              showActionButtonsNCS &&
              showActionButtonsVCS && (
                <TouchableOpacity
                  style={styles.navButtonLeft}
                  onPress={goToPrevious}
                >
                  <ChevronUp
                    style={{ transform: [{ rotate: "-90deg" }] }}
                    width={12}
                    height={12}
                  />
                </TouchableOpacity>
              )}
            {isAnimated && (
              <></>
              // <Carousel
              //   ref={carouselRef}
              //   data={patchedMediaFiles}
              //   renderItem={({ item, index }) => {
              //     if (index === 0) return <View style={{ flex: 1 }} />;
              //     return (
              //       <RenderCarouselItem
              //         item={item}
              //         setShowActionButtonsNCS={setShowActionButtonsNCS}
              //         setShowActionButtonsVCS={setShowActionButtonsVCS}
              //         activeIndex={currentIndex - 1}
              //         itemIndex={index - 1}
              //         pdfRef={pdfRef}
              //       />
              //     );
              //   }}
              //   sliderWidth={SW(300)}
              //   itemWidth={screenWidth}
              //   itemHeight={screenHeight}
              //   firstItem={initialIndex + 1}
              //   enableMomentum={false}
              //   scrollEnabled={false}
              //   onBeforeSnapToItem={async (index) => {
              //     setCurrentIndex(index);
              //   }}
              // />
            )}
            {showActionButtonsNCS && showActionButtonsVCS && (
              <TouchableOpacity
                style={styles.navButtonRight}
                onPress={goToNext}
              >
                <ChevronUp
                  style={{ transform: [{ rotate: "90deg" }] }}
                  width={12}
                  height={12}
                />
              </TouchableOpacity>
            )}
          </BottomSheetView>
        </BottomSheetModal>
      </>
    );
  },
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    borderRadius: 36,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: 28,
    height: 28,
  },
  carouselContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0,
    width: "100%",
    height: "100%",
  },
  navButton: {
    marginHorizontal: 10,
    borderWidth: 0,
  },
  navButtonLeft: {
    borderWidth: 0,
    position: "absolute",
    top: "50%",
    left: 16,
    zIndex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    borderRadius: 36,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: 28,
    height: 28,
  },
  navButtonRight: {
    borderWidth: 0,
    position: "absolute",
    top: "50%",
    right: 16,
    zIndex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    borderRadius: 36,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: 28,
    height: 28,
  },
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
  audioPlayer: {
    alignItems: "center",
    justifyContent: "center",
    height: 120,
    width: "100%",
  },
  audioButton: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MediaCarousel;

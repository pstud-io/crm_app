import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import { Colors, SH, SW } from "../../../utils";
import { PinCommentsOutline } from "../../../svg";
const ZoomableImageWithPins = ({
  uri,
  item,
  imageReady,
  activeMediaPinCommentsData,
  onContainerLayout,
  getPinFromPress,
  getRenderedImageRect,
  getPinPosition,
  setShowActionButtonsNCS,
  setShowActionButtonsVCS,
  setActiveChain,
  newPinCommentBottomSheetRef,
  viewPinCommentBottomSheetRef,
  urlRefForMedia,
  openNewPinCommentBottomSheet,
}) => {
  const [isImageReady, setIsImageReady] = useState(false);

  return (
    <View
      style={{ width: "100%", height: "100%", position: "relative" }}
      onLayout={onContainerLayout}
    >
      {!isImageReady && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#transparent",
            zIndex: 1000,
          }}
        >
          <ActivityIndicator size={SH(32)} />
        </View>
      )}
      <ReactNativeZoomableView
        maxZoom={3}
        minZoom={1}
        zoomStep={0.5}
        initialZoom={1}
        bindToBorders={true}
        pinchToZoomInSensitivity={3}
        pinchToZoomOutSensitivity={3}
        movementSensibility={1}
        style={{ flex: 1 }}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{ width: "100%", height: "100%" }}
          onLongPress={async (e) => {
            if (!item.fk_asset && !item.id) return;
            if (!imageReady) return;

            const pin = getPinFromPress(e.nativeEvent);
            if (!pin) return;

            setShowActionButtonsNCS(false);

            await openNewPinCommentBottomSheet(
              {
                context_id: item.fk_asset ?? item.id,
                pin_comment_chain_id: null,
                pin,
              },
              newPinCommentBottomSheetRef,
              urlRefForMedia,
            );
          }}
        >
          <Image
            source={{ uri }}
            style={styles.image}
            onLoad={() => {
              setIsImageReady(true);
            }}
          />

          {imageReady &&
            activeMediaPinCommentsData &&
            activeMediaPinCommentsData.map((chain) => {
              const rect = getRenderedImageRect();

              const pin = {
                x: chain.x_coordinate,
                y: chain.y_coordinate,
              };

              const position = getPinPosition(pin, rect);

              if (!position) return null;

              return (
                <TouchableOpacity
                  key={chain.id}
                  onPress={async () => {
                    setActiveChain(chain);
                    setShowActionButtonsVCS(false);
                    await viewPinCommentBottomSheetRef.current?.expand();
                  }}
                  style={[
                    styles.pin,
                    {
                      left: position.left - 8,
                      top: position.top - 8,
                    },
                  ]}
                >
                  <PinCommentsOutline
                    width={SH(18)}
                    height={SH(18)}
                    fill={Colors.white}
                    strokeWidth={1}
                  />
                </TouchableOpacity>
              );
            })}
        </TouchableOpacity>
      </ReactNativeZoomableView>
    </View>
  );
};

export default ZoomableImageWithPins;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  pin: {
    position: "absolute",
    width: SH(24),
    height: SH(24),
    borderRadius: SW(24),
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});

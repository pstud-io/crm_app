import { FlatList, Image, TouchableOpacity } from "react-native";
import React, { useRef, useState } from "react";
import { RenderMediaItem } from "./RenderMediaItem";
import { SW } from "../../../utils";
import MediaCarousel from "@/components/specific/MediaCarousel";
export const RenderSingleAsset = ({ assets, style }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const mediaCarouselRef = useRef(null);
  console.log("This is selected index", selectedIndex);
  return (
    <>
      <TouchableOpacity
        style={style}
        onPress={async () => {
          setSelectedIndex(0);
          setTimeout(async () => {
            await mediaCarouselRef.current?.present();
          }, 0);
        }}
      >
        <Image
          source={{ uri: assets[0]?.url ?? assets[0]?.uri }}
          width={"100%"}
          height={"100%"}
          resizeMode="cover"
        />
      </TouchableOpacity>
      {selectedIndex !== null && (
        <MediaCarousel
          mediaFiles={assets}
          ref={mediaCarouselRef}
          onClose={async () => {
            setSelectedIndex(null);
            await mediaCarouselRef.current?.dismiss();
          }}
          initialIndex={selectedIndex}
        />
      )}
    </>
  );
};

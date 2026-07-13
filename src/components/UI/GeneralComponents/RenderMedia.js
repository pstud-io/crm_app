import { FlatList } from "react-native";
import React, { useRef, useState } from "react";
import { MediaCarousel } from "../../specific";
import { RenderMediaItem } from "./RenderMediaItem";
import {
  BottomSheetFlatList,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { Colors, SF, SH, SW } from "../../../utils";

export const RenderMedia = ({
  selectedMedia,
  imageSize,
  handleDeleteMedia,
  hasDelete = true,
  style,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const mediaCarouselRef = useRef(null);
  return (
    <>
      <BottomSheetScrollView
        horizontal
        nestedScrollEnabled
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: "row",
        }}
      >
        {selectedMedia.map((item, index) => (
          <RenderMediaItem
            key={index.toString()}
            setSelectedIndex={setSelectedIndex}
            item={item}
            index={index}
            marginRight={SW(10)}
            handleDeleteMedia={() => handleDeleteMedia(item.uri)}
            imageSize={imageSize ?? SW(60)}
            hasDelete={hasDelete ?? true}
            mediaCarouselRef={mediaCarouselRef}
          />
        ))}
      </BottomSheetScrollView>

      {selectedIndex !== null && (
        <MediaCarousel
          mediaFiles={selectedMedia}
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

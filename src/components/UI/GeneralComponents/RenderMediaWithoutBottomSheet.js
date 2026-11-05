import { FlatList, ScrollView } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { RenderMediaItem } from "./RenderMediaItem";
import {
  BottomSheetFlatList,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { Colors, SF, SH, SW } from "../../../utils";
import MediaCarousel from "@/components/specific/MediaCarousel";

export const RenderMediaWithoutBottomSheet = ({
  selectedMedia,
  imageSize,
  handleDeleteMedia,
  hasDelete = true,
  hasNewURL = false,
  onChange,
  style,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const mediaCarouselRef = useRef(null);

  useEffect(() => {
    if (onChange) {
      onChange(selectedMedia);
    }
  }, [selectedMedia]);

  return (
    <>
      <ScrollView
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
            hasNewURL={hasNewURL}
          />
        ))}
      </ScrollView>

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

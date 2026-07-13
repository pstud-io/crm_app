import { FlatList } from "react-native";
import React, { useRef, useState } from "react";
import { MediaCarousel } from "../../specific";
import { RenderMediaItem } from "./RenderMediaItem";
import { SW } from "../../../utils";
export const RenderAssets = ({
  assets,
  imageSize,
  style = {},
  marginRight,
  contentContainerStyle = {},
  isCircular = false,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const mediaCarouselRef = useRef(null);
  return (
    <>
      <FlatList
        horizontal
        scrollEnabled={true}
        nestedScrollEnabled
        data={assets}
        initialNumToRender={6}
        maxToRenderPerBatch={4}
        windowSize={5}
        removeClippedSubviews
        style={[
          {
            maxHeight: imageSize,
          },
          style && style,
        ]}
        contentContainerStyle={{ ...contentContainerStyle }}
        renderItem={({ item, index }) => {
          return (
            <RenderMediaItem
              setSelectedIndex={setSelectedIndex}
              item={item}
              index={index}
              key={index}
              marginRight={marginRight ?? SW(10)}
              imageSize={imageSize}
              hasDelete={false}
              mediaCarouselRef={mediaCarouselRef}
              isCircular={isCircular}
            />
          );
        }}
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={() => {
          return <React.Fragment />;
        }}
      />
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

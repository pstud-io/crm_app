import React, { useRef, useState } from "react";
import { View, Dimensions, Text, StyleSheet } from "react-native";
import { Colors, SF, SH, SW } from "../../../utils";
import { Spacing } from "../../common";
import { MediaCarousel } from "../../specific";
import Toast from "react-native-toast-message";
import { FlatList } from "react-native";
import { RenderMediaItem } from "./RenderMediaItem";
import { body } from "../DesignSystem/typography";
import { primaryColors } from "../DesignSystem/colorPalette";
import badgeColors from "../Badge/badgeColors";
import { Badge } from "../Badge/Badge";

const RenderMediaList = ({ moduleAssets, assetsConverter }) => {
  const NUM_COLUMNS = 3;
  const GAP = SH(12); // spacing between images
  const HORIZONTAL_PADDING = SW(16); // padding already applied on screen
  const screenWidth = Dimensions.get("window").width;
  const itemSize =
    (screenWidth - HORIZONTAL_PADDING * 2 - GAP * (NUM_COLUMNS - 1)) /
    NUM_COLUMNS;

  console.log("assets in rendermedialist", moduleAssets);

  const allAssets = assetsConverter(moduleAssets);

  console.log("itemSize", itemSize);

  const [assets, setAssets] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const mediaCarouselRef = useRef(null);

  console.log("All assets in render media list", allAssets);

  const groupAssetsByDate = () => {
    const grouped = {};

    allAssets.forEach((item) => {
      const rawDate = item.created_on;
      const formattedDate = new Date(rawDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      if (!grouped[formattedDate]) {
        grouped[formattedDate] = [];
      }

      grouped[formattedDate].push(item);
    });

    // Convert to array format
    const result = Object.entries(grouped).map(([date, assets]) => ({
      date,
      assets,
    }));

    result.reverse();

    return result;
  };

  const groupedAssets = groupAssetsByDate();

  console.log("Grouped assets", groupedAssets);

  return (
    <>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: SW(4),
          alignSelf: "flex-start",
        }}
      >
        <Text
          style={{
            ...body.md.semiBold,
            color: primaryColors.gray[700],
          }}
        >
          Total Files
        </Text>
        <Badge
          color={badgeColors.gray}
          text={allAssets.length.toString()}
          size={"md"}
        />
      </View>
      <Spacing space={SH(16)} />
      {groupedAssets.map((item, index) => {
        const { date, assets } = item;
        return (
          <React.Fragment key={index}>
            {assets.length > 0 ? (
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: SH(12),
                  justifyContent: "flex-start",
                }}
              >
                <Text
                  style={{
                    ...body.sm.medium,
                    color: primaryColors.brand[1000],
                  }}
                >
                  {date}
                </Text>
                <FlatList
                  data={assets}
                  columnWrapperStyle={{
                    justifyContent: "flex-start",
                    marginBottom: GAP,
                  }}
                  initialNumToRender={5}
                  maxToRenderPerBatch={5}
                  windowSize={5}
                  removeClippedSubviews={true}
                  getItemLayout={(_, index) => ({
                    length: 120,
                    offset: 120 * index,
                    index,
                  })}
                  renderItem={({ item, index }) => (
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: SH(12),
                        marginRight: GAP,
                        paddingHorizontal: SW(12),
                        paddingVertical: SH(12),
                        backgroundColor: "#fff",
                        width: itemSize,
                        borderRadius: SW(8),
                        borderWidth: StyleSheet.hairlineWidth,
                        borderColor: primaryColors.gray[200],
                      }}
                    >
                      <RenderMediaItem
                        index={index}
                        item={item}
                        imageSize={itemSize - SW(24)}
                        marginRight={SW(0)}
                        assets={assets}
                        setAssets={setAssets}
                        setSelectedIndex={setSelectedIndex}
                        mediaCarouselRef={mediaCarouselRef}
                        hasDelete={false}
                      />
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                          flex: 1,
                          ...body.sm.regular,
                          color: primaryColors.gray[600],
                          alignSelf: "flex-start",
                        }}
                      >
                        {item.name}
                      </Text>
                    </View>
                  )}
                  keyExtractor={(_, index) => index.toString()}
                  numColumns={NUM_COLUMNS}
                  scrollEnabled={false}
                />
              </View>
            ) : (
              <></>
            )}
          </React.Fragment>
        );
      })}
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
      {/* <Toast /> */}
    </>
  );
};

export default RenderMediaList;

// pass moduleAssets as array of objects where each object has 5 properties namely created_on, id, type, name and url

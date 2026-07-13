import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { Spacing } from "../../common";
import { primaryColors } from "../DesignSystem/colorPalette";
import { body } from "../DesignSystem/typography";
import { SW, SH, Colors, SF } from "../../../utils";
import { TrashOutline, CloseOutlineIcon, Checkbox } from "../../../svg";
import { useState } from "react";
import Pdf from "react-native-pdf";
import { Image } from "expo-image";

export const RenderMediaItem = ({
  item,
  index,
  handleDeleteMedia,
  hasDelete = true,
  imageSize = SW(90),
  setSelectedIndex,
  setAssets,
  assets,
  hasCheckbox = false,
  onCheckboxChange,
  isChecked,
  marginRight,
  fileNameColor,
  deleteIconColor,
  mediaCarouselRef,
  isCircular = false,
}) => {
  const url =
    item?.asset_details?.url || item?.url || item?.uri || item?.asset_info?.url;
  const type =
    item?.asset_details?.type || item?.type || item?.asset_info?.type;
  const [isSelected, setIsSelected] = useState(isChecked);
  const toggleCheckbox = () => {
    const newValue = !isSelected;
    setIsSelected(newValue);
    onCheckboxChange?.(newValue);
  };
  return (
    <View>
      <TouchableOpacity
        onPress={async () => {
          setSelectedIndex(index);
          assets && setAssets([...assets]);
          setTimeout(async () => {
            await mediaCarouselRef.current?.present();
          }, 0);
        }}
        style={{
          position: "relative",
          maxWidth: imageSize,
          marginRight: marginRight ?? SW(10),
        }}
      >
        <View
          style={{
            width: imageSize,
            height: imageSize,
            backgroundColor: "#eee",
            borderRadius: isCircular ? SW(imageSize) : SW(8),
            overflow: "hidden",
            position: "relative",
            borderColor: isCircular ? primaryColors.gray[25] : "transparent",
            borderWidth: isCircular ? SW(2) : 0,
          }}
        >
          {type === "application/pdf" ? (
            <Pdf
              source={{ uri: url, cache: true }}
              style={{ width: "100%", height: "100%" }}
              onError={(error) => console.log("PDF Error:", error)}
              useWebKit={true} // use webkit for pdf rendering
              trustAllCerts={false} //skip ssl verification
              page={1}
            />
          ) : type === "video/mp4" ? (
            <>
              <Image
                source={{ uri: item?.asset_details?.thumbnailUrl || url }}
                style={{ width: "100%", height: "100%", resizeMode: "cover" }}
              />
              <View
                style={{
                  position: "absolute",
                  height: imageSize,
                  width: imageSize,
                  backgroundColor: "#000",
                  top: 0,
                  left: 0,
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <Text style={{ ...body.md.regular, color: "white" }}>▶</Text>
              </View>
            </>
          ) : type === "audio/wav" || type === "audio/mpeg" ? (
            <>
              <Image
                source={{ uri: item.asset_details?.thumbnailUrl || url }}
                style={{ width: "100%", height: "100%", resizeMode: "cover" }}
              />
              <View
                style={{
                  position: "absolute",
                  height: imageSize,
                  width: imageSize,
                  backgroundColor: "#000",
                  top: 0,
                  left: 0,
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
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
            <Image
              source={url}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              cachePolicy="memory-disk"
              removeClippedSubviews
            />
          )}
        </View>
        {hasCheckbox && (
          <TouchableOpacity
            style={{
              position: "absolute",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              top: SH(8),
              right: SH(8),
            }}
            onPress={() => toggleCheckbox()}
          >
            <Checkbox
              width={SW(18)}
              height={SH(18)}
              stroke={primaryColors.gray[300]}
              fill={Colors.white}
              strokeWidth={SW(1)}
              isSelected={isSelected}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      {hasDelete && (
        <>
          <Spacing space={SH(6)} />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: imageSize,
              paddingLeft: SW(2),
            }}
          >
            <Text
              style={{
                ...body.xs.regular,
                color: fileNameColor ?? primaryColors.gray[700],
                width: "80%",
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.name}
            </Text>

            <TouchableOpacity onPress={() => handleDeleteMedia(item.uri)}>
              <TrashOutline
                width={SW(16)}
                height={SH(16)}
                stroke={deleteIconColor ?? primaryColors.button.active}
                strokeWidth={1.5}
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

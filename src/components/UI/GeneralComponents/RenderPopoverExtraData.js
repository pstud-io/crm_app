import React, { createRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  StyleSheet,
} from "react-native";
import Popover from "react-native-popover-view";
import { body } from "../DesignSystem/typography";
import { primaryColors } from "../DesignSystem/colorPalette";
import { SW, SH } from "../../../utils";
import { Badge } from "../Badge/Badge";
import badgeColors from "../Badge/badgeColors";
import { ItemSeparatorComponent } from "./ItemSeperatorComponent";
import { CloseOutlineIcon } from "../../../svg";
import images from "../../../images";

export const RenderPopoverExtraData = ({
  extraData,
  nameField,
  uniqueKey,
  label,
  header,
  footer,
  iconLeft,
  iconRight,
  avatar,
  avatarURL,
  badgeRight,
  badgeField,
  alignBadge,
  badgeColor = null,
  internalBadgeColor,
  getInternalBadgeColor,
}) => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");
  const ref = createRef();

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  };

  return (
    <Popover
      key={uniqueKey}
      ref={ref}
      // Section: Animation Config
      animationConfig={{ duration: 300, useNativeDriver: true }}
      backgroundStyle={styles.backdrop}
      from={
        <TouchableOpacity activeOpacity={0.9} style={{ maxWidth: "40%" }}>
          <Badge
            text={label}
            size={"sm"}
            color={badgeColor || badgeColors.blueGray}
            border={true}
          />
        </TouchableOpacity>
      }
      placement={"center"}
      popoverStyle={styles.popoverContainer}
    >
      <View
        style={[
          styles.innerContent,
          { width: SCREEN_WIDTH * 0.8, maxHeight: SCREEN_HEIGHT * 0.5 },
        ]}
      >
        {/* Section: Header Area */}
        {header && (
          <View style={styles.headerWrapper}>
            <View style={styles.headerRow}>
              <Text style={styles.headerText}>{header}</Text>
              <TouchableOpacity
                onPress={() => ref.current.requestClose()}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <CloseOutlineIcon
                  fill={primaryColors.gray[400]}
                  width={SW(14)}
                  height={SH(14)}
                />
              </TouchableOpacity>
            </View>
            <ItemSeparatorComponent
              direction={"horizontal"}
              style={{ marginVertical: 0 }}
            />
          </View>
        )}

        {/* Section: List Content */}
        <FlatList
          data={extraData}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          showsVerticalScrollIndicator={false}
          style={styles.listStyle}
          contentContainerStyle={styles.listPadding}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <View style={styles.itemLeftSection}>
                {iconLeft && iconLeft}
                {avatar && (
                  <Image
                    source={avatarURL ? { uri: avatarURL } : images.noUserImage}
                    style={styles.avatarStyle}
                  />
                )}
                <Text numberOfLines={1} style={styles.itemName}>
                  {getNestedValue(item, nameField) || "NA"}
                </Text>
              </View>

              {iconRight && iconRight}

              {badgeRight && (
                <Badge
                  size={"sm"}
                  color={
                    internalBadgeColor
                      ? getInternalBadgeColor(getNestedValue(item, badgeField))
                      : badgeColors.blueGray
                  }
                  text={
                    parseInt(getNestedValue(item, badgeField)) ||
                    getNestedValue(item, badgeField)
                  }
                  alignSelf={alignBadge}
                />
              )}
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: SH(12) }} />}
        />

        {/* Section: Footer Area */}
        {footer && (
          <View style={styles.footerWrapper}>
            <ItemSeparatorComponent direction={"horizontal"} />
            <View style={styles.footerContent}>{footer}</View>
          </View>
        )}
      </View>
    </Popover>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  popoverContainer: {
    borderRadius: SW(16),
    backgroundColor: "white",
  },
  innerContent: {
    overflow: "hidden",
  },
  headerWrapper: {
    backgroundColor: primaryColors.gray[25],
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SW(20),
    paddingVertical: SH(16),
  },
  headerText: {
    ...body.md.bold,
    color: primaryColors.gray[900],
  },
  listStyle: {
    width: "100%",
  },
  listPadding: {
    paddingHorizontal: SW(20),
    paddingVertical: SH(20),
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  itemLeftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: SW(12),
    flex: 1,
  },
  avatarStyle: {
    width: SH(32),
    height: SH(32),
    borderRadius: SW(16),
    backgroundColor: primaryColors.gray[100],
  },
  itemName: {
    ...body.sm.medium,
    color: primaryColors.gray[700],
  },
  footerWrapper: {
    width: "100%",
  },
  footerContent: {
    padding: SW(16),
  },
});

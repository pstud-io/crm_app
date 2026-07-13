import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Popover from "react-native-popover-view";
import { Colors, SW, SH } from "../../../../utils";
import { body } from "../../DesignSystem/typography";
import { primaryColors } from "../../DesignSystem/colorPalette";
import { DownArrowOutlineIcon } from "../../../../svg";
import { Shadow } from "react-native-shadow-2";
import { ItemSeparatorComponent } from "../ItemSeperatorComponent";
import { Dimensions } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

export const BottomButtonPopover = ({
  title,
  options,
  disabled = false,
  onMainPress,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const RenderPopoverMenuOption = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={item.onPress}
        style={{
          height: SH(44),
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: SW(16),
        }}
      >
        {/* Left icon */}
        <View style={{ position: "absolute", left: SW(16) }}>{item.icon}</View>

        {/* Center text */}
        <Text
          style={{
            ...body.md.medium,
            textAlign: "center",
          }}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Popover
      isVisible={showMenu}
      onRequestClose={() => setShowMenu(false)}
      backgroundStyle={{ backgroundColor: "transparent" }}
      popoverStyle={styles.popoverContainer}
      placement="top"
      arrowSize={{ width: 0, height: 0 }}
      offset={SH(8)}
      from={
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={disabled}
          onPress={() => setShowMenu(true)}
          style={[
            styles.triggerButton,
            {
              backgroundColor: disabled
                ? primaryColors.gray[300]
                : primaryColors.brand[1000],
            },
          ]}
        >
          {/* Centered Title */}
          <Text style={styles.buttonText}>{title}</Text>

          {/* Right Aligned Icon - Absolute positioned so text stays centered */}
          <View style={styles.iconWrapper}>
            <DownArrowOutlineIcon
              width={SW(14)}
              height={SH(14)}
              color={Colors.white}
            />
          </View>
        </TouchableOpacity>
      }
    >
      <Shadow
        distance={SW(6)}
        startColor="rgba(0, 0, 0, 0.05)"
        offset={[0, SH(4)]}
      >
        <View style={styles.menuWrapper}>
          <FlatList
            data={options}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <RenderPopoverMenuOption
                item={{
                  ...item,
                  onPress: () => {
                    setShowMenu(false);
                    item.onPress();
                  },
                }}
              />
            )}
            ItemSeparatorComponent={() => (
              <ItemSeparatorComponent
                direction="horizontal"
                style={{ marginVertical: 0 }}
              />
            )}
          />
        </View>
      </Shadow>
    </Popover>
  );
};

const styles = StyleSheet.create({
  triggerButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: SH(48),
    borderRadius: SW(12),
    paddingHorizontal: SW(16),
  },
  buttonText: {
    ...body.md.medium,
    color: Colors.white,
  },
  iconWrapper: {
    position: "absolute",
    right: SW(16),
  },
  popoverContainer: {
    backgroundColor: "transparent",
    overflow: "visible",
    alignSelf: "center",
  },
  menuWrapper: {
    width: SCREEN_WIDTH - SW(40),
    backgroundColor: "white",
    borderColor: primaryColors.gray[200],
    borderRadius: SW(8),
    borderWidth: SW(1),
    minWidth: SW(150),
    overflow: "hidden",
  },
});

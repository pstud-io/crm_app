import { borderRadius, borderWidth } from "@/design/borders";
import { center, xstack } from "@/design/layout";
import { useTheme } from "@/hooks/useTheme";
import { SCREEN_WIDTH } from "@/utils";
import PlusIcon from "assets/icons/PlusIcon";
import {
  SetStateAction,
  useEffect,
  useState,
  Dispatch,
  useLayoutEffect,
} from "react";
import { FlatList, Pressable, StyleSheet } from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { RenderPopoverMenuOption } from "./UI/GeneralComponents/RenderPopoverMenuOption";
import { primaryColors } from "@/design/colors";
import { ItemSeparatorComponent } from "./UI/GeneralComponents/ItemSeperatorComponent";
import { useFloatingButtonOptions } from "@/hooks/useFloatingButtonOptions";
import { RenderFloatingActionItem } from "./FloatingActionItem";
import { spacing } from "@/design/spacing";

export const ExpandableFloatingButton = ({
  onPress,
  disable,
  activeSubButtonGlobal,
  expanded,
  setExpanded,
}: {
  onPress: () => Promise<void> | void;
  disable: boolean | null;
  activeSubButtonGlobal: string | null;
  expanded: boolean;
  setExpanded: Dispatch<SetStateAction<boolean>>;
}) => {
  const { theme } = useTheme();
  const cardHeight = useSharedValue(52);
  const radius = useSharedValue(52);
  const cardWidth = useSharedValue(52);
  const backgroundColor = useSharedValue(theme.backgroundInverse);
  const animatedStyle = useAnimatedStyle(() => ({
    height: cardHeight.value,
    width: cardWidth.value,
    borderRadius: radius.value,
  }));
  const animatedBackground = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));
  const { floatingButtonOptions } = useFloatingButtonOptions({ setExpanded });
  const onClick = () => {
    if (activeSubButtonGlobal === "dashboard") {
      setExpanded((prev) => !prev);
      console.log("Hit onclick");
    } else {
      onPress();
    }
  };

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const animateToHeight =
    floatingButtonOptions.length > 5 ? 280 : floatingButtonOptions.length * 60;

  useLayoutEffect(() => {
    if (expanded) {
      backgroundColor.value = withTiming(theme.header, { duration: 300 });
      cardHeight.value = withTiming(animateToHeight, {
        duration: 300,
        easing: Easing.out(Easing.back(1)),
      });
      cardWidth.value = withTiming(SCREEN_WIDTH * 0.5, {
        duration: 300,
        easing: Easing.out(Easing.back(1)),
      });
      radius.value = withTiming(24, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      backgroundColor.value = withTiming(theme.backgroundInverse, {
        duration: 300,
      });
      cardHeight.value = withTiming(52, {
        duration: 300,
        easing: Easing.out(Easing.back(1)),
      });
      cardWidth.value = withTiming(52, {
        duration: 300,
        easing: Easing.out(Easing.back(1)),
      });
      radius.value = withTiming(52, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [expanded]);

  return (
    <AnimatedPressable
      key={"animated-pressable"}
      style={[
        xstack,
        center,
        {
          width: 52,
          height: 52,
          boxShadow: theme.shadow.xxl,
          borderWidth: borderWidth.hw,
          borderColor: theme.border,
          overflow: "hidden",
        },
        animatedStyle,
        [
          disable
            ? { backgroundColor: theme.backgroundDisabled }
            : animatedBackground,
        ],
      ]}
      disabled={disable}
      onPress={onClick}
    >
      {!expanded && (
        <PlusIcon
          width={28}
          height={28}
          fill={theme.textInverse}
          stroke={theme.textInverse}
          strokeWidth={2}
        />
      )}
      {expanded && (
        <FlatList
          keyExtractor={(item, index) => item.id + index}
          data={floatingButtonOptions}
          scrollEnabled={floatingButtonOptions.length > 5 ? true : false}
          renderItem={({ item, index }) => {
            return <RenderFloatingActionItem item={item} />;
          }}
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: "transparent",
            height: "100%",
          }}
          contentContainerStyle={{
            justifyContent: "space-evenly",
            // height: "100%",
          }}
          ItemSeparatorComponent={
            <ItemSeparatorComponent
              direction={"horizontal"}
              style={{ marginVertical: 0, borderTopWidth: borderWidth.md }}
            />
          }
        />
      )}
    </AnimatedPressable>
  );
};

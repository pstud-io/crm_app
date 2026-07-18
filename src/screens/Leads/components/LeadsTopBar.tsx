import * as React from "react";
import { Animated, ScrollView, TextStyle, View, ViewStyle } from "react-native";
import { ParamListBase, useLinkBuilder } from "@react-navigation/native";
import { PlatformPressable } from "@react-navigation/elements";
import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { center, fullWidth, xstack } from "@/design/layout";
import { spacing } from "@/design/spacing";
import { borderRadius, borderWidth } from "@/design/borders";
import { useTheme } from "@/hooks/useTheme";
import { SubTabChipType } from "@/components/SubTabChip";
import { body } from "@/design/typography";

export function LeadsTopBar({
  state,
  descriptors,
  navigation,
  position,
}: MaterialTopTabBarProps) {
  const { buildHref } = useLinkBuilder();

  const { theme } = useTheme();

  const infoRoute = state.routes.find((r) => r.name === "Info");
  // @ts-ignore
  const project = infoRoute?.params?.project;

  const chipStyles: Record<SubTabChipType, ViewStyle & TextStyle> = {
    default: {
      backgroundColor: theme.button,
      borderColor: theme.button,
      color: theme.buttonInverse,
    },
    outlined: {
      backgroundColor: theme.header,
      borderColor: theme.border,
      color: theme.text,
    },
    disabled: {
      backgroundColor: theme.background,
      borderColor: theme.border,
      color: theme.placeholderText,
    },
  };

  const currentStyle = (isFocused: boolean): ViewStyle & TextStyle => {
    if (isFocused) {
      return chipStyles["default"];
    } else {
      return chipStyles["outlined"];
    }
  };

  return (
    <View
      style={[
        xstack,
        fullWidth,
        { justifyContent: "flex-start", gap: spacing.lg },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={[
          xstack,
          {
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.lg,
            justifyContent: "flex-start",
            alignItems: "center",
            gap: spacing.lg,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          console.log("route in tab bar is", route);
          const label: React.ReactNode =
            options.tabBarLabel !== undefined
              ? typeof options.tabBarLabel === "function"
                ? options.tabBarLabel({
                    focused: state.index === index,
                    color: theme.text,
                    children: route.name,
                  })
                : options.tabBarLabel
              : (options.title ?? route.name);

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              console.log("This is the route", route);
              if (route.name === "Follow Ups") {
                navigation.navigate(route.name, {
                  task_type: "followup",
                  project: project,
                });
              } else if (route.name === "Tasks") {
                navigation.navigate(route.name, {
                  task_type: "",
                  project: project,
                });
              } else if (route.name === "Notes") {
                navigation.navigate(route.name, {
                  selectedProject: project,
                });
              } else if (route.name === "Stage History") {
                navigation.navigate(route.name, {
                  project: project,
                });
              } else {
                navigation.navigate(route.name, route.params);
              }
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          const inputRange = state.routes.map((_, i) => i);

          const opacity = position.interpolate({
            inputRange,
            outputRange: inputRange.map((i) => (i === index ? 1 : 0.5)),
          });

          return (
            <PlatformPressable
              key={route.key}
              href={buildHref(route.name, route.params)}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              accessibilityState={{ selected: isFocused }}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[
                xstack,
                center,
                {
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.xs,
                  gap: spacing.xs,
                  backgroundColor: currentStyle(isFocused).backgroundColor,
                  borderColor: currentStyle(isFocused).borderColor,
                  borderWidth: borderWidth.md,
                  borderRadius: borderRadius.full,
                },
              ]}
            >
              <Animated.Text
                style={{
                  opacity,
                  color: currentStyle(isFocused).color,
                  ...body.sm.medium,
                }}
              >
                {label}
              </Animated.Text>
            </PlatformPressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

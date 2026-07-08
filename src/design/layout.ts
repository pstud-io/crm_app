import { ViewStyle } from "react-native";
import { Dimensions } from "react-native";

export const SCREEN_WIDTH = Dimensions.get("window").width;
export const SCREEN_HEIGHT = Dimensions.get("window").height;

export const xstack = {
  flexDirection: "row",
} as const satisfies ViewStyle;

export const ystack = {
  flexDirection: "column",
} as const satisfies ViewStyle;

export const center = {
  alignItems: "center",
  justifyContent: "center",
} as const satisfies ViewStyle;

export const topLeft = {
  alignItems: "flex-start",
  justifyContent: "flex-start",
} as const satisfies ViewStyle;

export const topCenter = {
  alignItems: "center",
  justifyContent: "flex-start",
} as const satisfies ViewStyle;

export const topRight = {
  alignItems: "flex-end",
  justifyContent: "flex-start",
} as const satisfies ViewStyle;

export const centerLeft = {
  alignItems: "flex-start",
  justifyContent: "center",
} as const satisfies ViewStyle;

export const centerRight = {
  alignItems: "flex-end",
  justifyContent: "center",
} as const satisfies ViewStyle;

export const bottomLeft = {
  alignItems: "flex-start",
  justifyContent: "flex-end",
} as const satisfies ViewStyle;

export const bottomCenter = {
  alignItems: "center",
  justifyContent: "flex-end",
} as const satisfies ViewStyle;

export const bottomRight = {
  alignItems: "flex-end",
  justifyContent: "flex-end",
} as const satisfies ViewStyle;

export const spaceBetween = {
  justifyContent: "space-between",
} as const satisfies ViewStyle;

export const spaceAround = {
  justifyContent: "space-around",
} as const satisfies ViewStyle;

export const spaceEvenly = {
  justifyContent: "space-evenly",
} as const satisfies ViewStyle;

export const flex1 = {
  flex: 1,
} as const satisfies ViewStyle;

export const grow = {
  flexGrow: 1,
} as const satisfies ViewStyle;

export const shrink = {
  flexShrink: 1,
} as const satisfies ViewStyle;

export const fullWidth = {
  width: "100%",
} as const satisfies ViewStyle;

export const fullHeight = {
  height: "100%",
} as const satisfies ViewStyle;

export const fullSize = {
  width: "100%",
  height: "100%",
} as const satisfies ViewStyle;

export const fullScreen = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} as const satisfies ViewStyle;

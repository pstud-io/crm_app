import { TextStyle, ViewStyle, ImageStyle } from "react-native";
import { useMemo } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { body } from "@/design/typography";
import { useTheme } from "./useTheme";
import { borderRadius, borderWidth } from "@/design/borders";
import { spacing } from "@/design/spacing";
import { height, width } from "@/design/distance";
import { primaryColors } from "@/design/colors";
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export interface FormElementsStyles {
  triggerStyle: ViewStyle;
  disabledStyle: ViewStyle;
  titleStyle: TextStyle;
  valueStyle: TextStyle;
  placeholderStyle: TextStyle;
  inputContainerStyle: ViewStyle;
  descriptionTriggerStyle: ViewStyle;
  multiselectTriggerStyle: ViewStyle;
  multiSelectPlaceholderStyle: TextStyle;
  attachFilesTriggerStyle: ViewStyle;
  attachFilesPlaceholderStyle1: TextStyle;
  attachFilesPlaceholderStyle2: TextStyle;
  dropdownOptionsItemContainerStyle: ViewStyle;
  dropdownOptionsContainerStyle: ViewStyle;
  dropdownOptionsSearchStyle: TextStyle & ViewStyle;
  placeholderColor: string;
  floatingButton: ViewStyle;
  bottomSheetInput: ViewStyle;
  bottomSheetDescription: TextStyle;
  bottomButtonContainer: ViewStyle;
  approveButton: ViewStyle;
  rejectButton: ViewStyle;
  dropdownTriggerStyle: ViewStyle;
  dropdownPlaceholderStyle: ViewStyle;
  triggerNone: ViewStyle;
}

const DROPDOWN_HEIGHT = SCREEN_HEIGHT * 0.5;
const DROPDOWN_WIDTH = SCREEN_WIDTH * 0.7;

export const useFormElementsStyles = (): FormElementsStyles => {
  const { theme } = useTheme();
  const formElementStyles = useMemo<FormElementsStyles>(
    () => ({
      triggerNone: { width: 0, height: 0, opacity: 1, position: "absolute" },
      triggerStyle: {
        display: "flex",
        flexDirection: "row",
        maxWidth: "100%",
        borderColor: theme.border,
        borderWidth: borderWidth.md,
        borderRadius: borderRadius.xs,
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        height: height[44],
      },

      disabledStyle: {
        backgroundColor: theme.backgroundDisabled,
      },

      titleStyle: {
        ...body.sm.medium,
        color: theme.text,
      },

      valueStyle: {
        color: theme.text,
        ...body.sm.regular,
        flex: 1,
      },

      placeholderStyle: {
        ...body.sm.regular,
        color: theme.placeholderText,
        backgroundColor: "#fff",
      },

      inputContainerStyle: {
        borderBottomWidth: borderRadius.none,
        width: "100%",
      },

      descriptionTriggerStyle: {
        display: "flex",
        flexDirection: "row",
        flex: 1,
        borderColor: theme.border,
        borderWidth: borderWidth.md,
        borderRadius: borderRadius.sm,
        alignItems: "flex-start",
        justifyContent: "flex-start",
        width: "100%",
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.min,
        height: height[96],
      },

      multiselectTriggerStyle: {
        width: SCREEN_WIDTH * (1 / 4.5),
      },

      multiSelectPlaceholderStyle: {
        ...body.sm.regular,
        color: theme.placeholderText,
        flex: 0,
      },

      attachFilesTriggerStyle: {
        display: "flex",
        flexDirection: "column",
        borderColor: theme.border,
        borderWidth: borderWidth.md,
        borderRadius: borderRadius.sm,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        paddingHorizontal: width[44],
        paddingVertical: spacing.lg,
        gap: spacing.xs,
        borderStyle: "dashed",
      },

      attachFilesPlaceholderStyle1: {
        ...body.sm.regular,
        color: theme.text,
      },

      attachFilesPlaceholderStyle2: {
        ...body.sm.regular,
        color: theme.text,
      },

      dropdownOptionsItemContainerStyle: {},

      dropdownOptionsContainerStyle: {
        borderRadius: borderRadius.lg,
        backgroundColor: theme.header,
        borderWidth: 0,
        maxHeight: DROPDOWN_HEIGHT,
        minHeight: DROPDOWN_HEIGHT,
        minWidth: DROPDOWN_WIDTH,
        maxWidth: DROPDOWN_WIDTH,
        padding: spacing.lg,
      },

      dropdownOptionsSearchStyle: {
        borderRadius: borderRadius.md,
        minWidth: "100%",
        alignSelf: "center",
        borderColor: theme.border,
        height: height[44],
        ...body.md.regular,
      },

      placeholderColor: theme.placeholderText,

      floatingButton: {
        borderRadius: borderRadius.md,
        height: height[40],
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      },

      bottomSheetInput: {
        borderBottomWidth: borderWidth.md,
      },

      bottomSheetDescription: {
        borderBottomWidth: borderWidth.md,
        height: height[92],
        textAlignVertical: "top",
      },

      bottomButtonContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: spacing.md,
        gap: spacing.sm,
        borderColor: theme.border,
        borderTopWidth: borderWidth.md,
        paddingHorizontal: spacing.xl,
        backgroundColor: theme.header,
        boxShadow: theme.shadow.sm,
        width: "100%",
      },

      approveButton: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: spacing.xxs,
        paddingRight: spacing.xs,
        paddingLeft: spacing.tiny,
        borderRadius: borderRadius.sm,
        borderColor: primaryColors.success[600],
        borderWidth: borderWidth.md,
        gap: spacing.min,
      },

      rejectButton: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: spacing.xxs,
        paddingRight: spacing.xs,
        paddingLeft: spacing.xxs,
        borderRadius: borderRadius.sm,
        borderColor: primaryColors.error[600],
        borderWidth: StyleSheet.hairlineWidth,
        gap: spacing.tiny,
      },

      dropdownTriggerStyle: {
        display: "flex",
        flexDirection: "row",
        maxWidth: "100%",
        borderColor: theme.border,
        borderWidth: borderWidth.md,
        borderRadius: borderRadius.xs,
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        height: height[44],
      },

      dropdownPlaceholderStyle: {
        ...body.sm.regular,
        color: theme.placeholderText,
        backgroundColor: "transparent",
      },
    }),
    [theme],
  );

  return formElementStyles;
};

import { appThemeType, Theme } from "@/types/themeTypes";
import { primaryColors, secondaryColors } from "./colors";
import { lightShadows, darkShadows } from "./shadows";

export const lightTheme: Theme = {
  header: "white",
  footer: "white",
  background: secondaryColors.blueGray[50],
  backgroundInverse: secondaryColors.blueGray[900],
  text: secondaryColors.gray[900],
  textInverse: secondaryColors.gray[50],
  placeholderText: secondaryColors.gray[400],
  button: secondaryColors.blueGray[900],
  buttonInverse: secondaryColors.blueGray[50],
  shadow: lightShadows,
  surface: "#F6F6F6",
  textSecondary: "#666666",
  primary: "#2D6CDF",
  secondary: "#7E57C2",
  border: secondaryColors.gray[300],
  success: "#4CAF50",
  warning: "#FF9800",
  error: primaryColors.error[400],
  backgroundDisabled: secondaryColors.gray[400],
};

export const darkTheme: Theme = {
  header: secondaryColors.gray[900],
  footer: secondaryColors.gray[900],
  background: "black",
  backgroundInverse: secondaryColors.blueGray[50],
  placeholderText: secondaryColors.gray[500],
  button: secondaryColors.blueGray[50],
  buttonInverse: "black",
  text: secondaryColors.gray[50],
  textInverse: secondaryColors.gray[900],
  shadow: darkShadows,
  surface: "#1E1E1E",
  textSecondary: "#BBBBBB",
  primary: "#5C9DFF",
  secondary: "#B388FF",
  border: secondaryColors.gray[200],
  success: "#66BB6A",
  warning: "#FFB74D",
  error: primaryColors.error[700],
  backgroundDisabled: secondaryColors.gray[400],
};

export const appTheme: appThemeType = {
  light: lightTheme,
  dark: darkTheme,
};

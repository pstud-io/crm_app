import { appThemeType, Theme } from "@/types/themeTypes";
import { primaryColors, secondaryColors } from "./colors";
import { lightShadows, darkShadows } from "./shadows";

export const lightTheme: Theme = {
  header: "white",
  footer: "white",
  background: secondaryColors.blueGray[50],
  text: secondaryColors.gray[900],
  shadow: lightShadows,
  surface: "#F6F6F6",
  textSecondary: "#666666",
  primary: "#2D6CDF",
  secondary: "#7E57C2",
  border: "#DDDDDD",
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#F44336",
};

export const darkTheme: Theme = {
  header: "black",
  footer: "black",
  background: secondaryColors.blueGray[900],
  text: secondaryColors.gray[50],
  shadow: darkShadows,
  surface: "#1E1E1E",
  textSecondary: "#BBBBBB",
  primary: "#5C9DFF",
  secondary: "#B388FF",
  border: "#333333",
  success: "#66BB6A",
  warning: "#FFB74D",
  error: "#EF5350",
};

export const appTheme: appThemeType = {
  light: lightTheme,
  dark: darkTheme,
};

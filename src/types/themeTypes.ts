import { Dispatch, SetStateAction } from "react";
import { ViewStyle } from "react-native";
import { Shadow } from "./shadowTypes";

export enum ThemeMode {
  Light = "light",
  Dark = "dark",
  System = "system",
}
export interface ThemeProviderProps {
  children: React.ReactNode;
}

export const THEME_KEY: "theme" = "theme";

export type ThemeContextType = {
  theme: Theme;
  themeMode: ThemeMode;
  THEME_KEY: "theme";
  updateTheme: (
    themeMode: ThemeMode,
    THEME_KEY: "theme",
    setThemeMode: Dispatch<SetStateAction<ThemeMode>>,
  ) => Promise<void>;
  setThemeMode: Dispatch<SetStateAction<ThemeMode>>;
  isDark: boolean;
};
export interface Theme {
  header: string;
  footer: string;
  background: string;
  shadow: Shadow;
  surface: string;
  text: string;
  textSecondary: string;
  primary: string;
  secondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

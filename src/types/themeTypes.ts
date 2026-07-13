import { Dispatch, SetStateAction } from "react";
import { ViewStyle } from "react-native";
import { Shadow } from "./shadowTypes";
import { StorageKeys } from "@/utils/storageFunctions";

export enum ThemeMode {
  Light = "light",
  Dark = "dark",
  System = "system",
}
export interface ThemeProviderProps {
  children: React.ReactNode;
}

export const THEME_KEY: StorageKeys.THEME_KEY = StorageKeys.THEME_KEY;

export type ThemeContextType = {
  theme: Theme;
  themeMode: ThemeMode;
  THEME_KEY: StorageKeys.THEME_KEY;
  updateTheme: (
    themeMode: ThemeMode,
    THEME_KEY: StorageKeys.THEME_KEY,
    setThemeMode: Dispatch<SetStateAction<ThemeMode>>,
  ) => Promise<void>;
  setThemeMode: Dispatch<SetStateAction<ThemeMode>>;
  isDark: boolean;
  darkTheme: Theme;
  lightTheme: Theme;
};
export interface Theme {
  header: string;
  footer: string;
  background: string;
  backgroundInverse: string;
  shadow: Shadow;
  surface: string;
  text: string;
  textInverse: string;
  placeholderText: string;
  textSecondary: string;
  primary: string;
  secondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  button: string;
  buttonInverse: string;
  backgroundDisabled: string;
}

export interface appThemeType {
  light: Theme;
  dark: Theme;
}

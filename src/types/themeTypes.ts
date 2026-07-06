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

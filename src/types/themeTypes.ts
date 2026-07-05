import { Dispatch, SetStateAction } from "react";

export enum ThemeMode {
  Light = "light",
  Dark = "dark",
  System = "system",
}

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export const THEME_KEY: "theme" = "theme";

export interface Theme {
  background: string;
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

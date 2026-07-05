import { ThemeContext } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/design/theme";
import {
  Theme,
  ThemeContextType,
  ThemeMode,
  ThemeProviderProps,
  THEME_KEY,
} from "@/types/themeTypes";
import { loadTheme, updateTheme } from "@/utils/themeFunctions";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { loadFonts } from "@/utils/typographyFunctions";

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const systemTheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>(ThemeMode.System);
  const [isReady, setIsReady] = useState<boolean>(false);

  useLayoutEffect(() => {
    if (isReady) return;
    const load: () => Promise<void> = async () => {
      await loadTheme(THEME_KEY, setThemeMode);
      await loadFonts();
      setIsReady(true);
    };
    load();
  }, []);

  useEffect(() => {
    const hideSplashScreen: () => Promise<void> = async () => {
      if (isReady) {
        await SplashScreen.hideAsync();
      }
    };
    hideSplashScreen();
  }, [isReady]);

  const isDark: boolean =
    themeMode === ThemeMode.System
      ? systemTheme === "dark"
      : themeMode === ThemeMode.Dark;

  const theme: Theme = isDark ? darkTheme : lightTheme;

  const value: ThemeContextType = useMemo(
    () => ({
      theme,
      themeMode,
      THEME_KEY,
      updateTheme,
      setThemeMode,
      isDark,
    }),
    [themeMode],
  );

  if (!isReady) {
    return;
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

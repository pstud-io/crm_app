import { ThemeContext } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/design/theme";
import {
  Theme,
  ThemeContextType,
  ThemeMode,
  ThemeProviderProps,
  THEME_KEY,
} from "@/types/themeTypes";
import {
  loadTheme,
  loadThemeUnistyles,
  updateTheme,
} from "@/utils/themeFunctions";
import React, {
  createRef,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { loadFonts } from "@/utils/typographyFunctions";
import { useAuth } from "@/hooks/useAuth";
import { loadAuth } from "@/utils/authFunctions";
import { loadProfile } from "@/store/slices/profileSlice/profileSlice";
import { useDispatch } from "react-redux";
import { setSelectedProject } from "@/store/slices/projectSlice/projectSlice";

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const systemTheme = useColorScheme();
  const { setAuthLoading, setRole } = useAuth();
  const [themeMode, setThemeMode] = useState<ThemeMode>(ThemeMode.System);
  const [isReady, setIsReady] = useState<boolean>(false);
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    if (isReady) return;
    const load: () => Promise<void> = async () => {
      await Promise.all([
        loadTheme(THEME_KEY, setThemeMode),
        // loadThemeUnistyles(THEME_KEY),
        loadFonts(),
        loadAuth(setRole, setAuthLoading),
        loadProfile(dispatch),
        dispatch(
          setSelectedProject({
            id: "all_projects",
            project_name: "All Projects",
          }),
        ),
      ]);
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
      darkTheme,
      lightTheme,
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

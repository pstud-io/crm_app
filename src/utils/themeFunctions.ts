import { ThemeMode } from "@/types/themeTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch, SetStateAction } from "react";
import { storage, StorageKeys } from "./storageFunctions";
import { UnistylesRuntime, UnistylesThemes } from "react-native-unistyles";
function isThemeMode(value: string): value is ThemeMode {
  return Object.values(ThemeMode).includes(value as ThemeMode);
}

export async function getTheme() {
  const stored = await AsyncStorage.getItem("theme");
  if (stored && isThemeMode(stored)) {
    return stored;
  }
}

export async function loadTheme(
  THEME_KEY: StorageKeys.THEME_KEY,
  setThemeMode: Dispatch<SetStateAction<ThemeMode>>,
) {
  const stored = await storage.get<string>(THEME_KEY);
  if (stored && isThemeMode(stored)) {
    setThemeMode(stored);
  }
}

export async function loadThemeUnistyles(THEME_KEY: StorageKeys.THEME_KEY) {
  const stored = await storage.get<string>(THEME_KEY);
  if (stored && isThemeMode(stored)) {
    const theme = stored as keyof UnistylesThemes;
    UnistylesRuntime.setTheme(theme);
  }
}

export async function updateTheme(
  themeMode: ThemeMode,
  THEME_KEY: StorageKeys.THEME_KEY,
  setThemeMode: Dispatch<SetStateAction<ThemeMode>>,
) {
  setThemeMode(themeMode);
  await storage.set(THEME_KEY, themeMode);
}

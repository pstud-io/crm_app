import { ThemeMode } from "@/types/themeTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch, SetStateAction } from "react";

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
  THEME_KEY: "theme",
  setThemeMode: Dispatch<SetStateAction<ThemeMode>>,
) {
  const stored = await AsyncStorage.getItem(THEME_KEY);
  if (stored && isThemeMode(stored)) {
    setThemeMode(stored);
  }
}

export async function updateTheme(
  themeMode: ThemeMode,
  THEME_KEY: "theme",
  setThemeMode: Dispatch<SetStateAction<ThemeMode>>,
) {
  setThemeMode(themeMode);
  await AsyncStorage.setItem(THEME_KEY, themeMode);
}

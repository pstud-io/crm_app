import { appTheme } from "@/design/theme";
import { appThemeType } from "./themeTypes";
import { StyleSheet } from "react-native-unistyles";
import { storage, StorageKeys } from "@/utils/storageFunctions";

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends appThemeType {}
}

StyleSheet.configure({
  themes: appTheme,
  settings: {
    adaptiveThemes: true,
  },
});

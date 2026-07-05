import { FontFamily } from "@/types/typhographyTypes";
import { FontSource } from "expo-font";
import * as Font from "expo-font";

const fonts: Record<FontFamily, FontSource> = {
  "Inter-Black": require("../../assets/fonts/inter/Inter-Black.ttf"),
  "Inter-Bold": require("../../assets/fonts/inter/Inter-Bold.ttf"),
  "Inter-ExtraBold": require("../../assets/fonts/inter/Inter-ExtraBold.ttf"),
  "Inter-ExtraLight": require("../../assets/fonts/inter/Inter-ExtraLight.ttf"),
  "Inter-Light": require("../../assets/fonts/inter/Inter-Light.ttf"),
  "Inter-Medium": require("../../assets/fonts/inter/Inter-Medium.ttf"),
  "Inter-Regular": require("../../assets/fonts/inter/Inter-Regular.ttf"),
  "Inter-SemiBold": require("../../assets/fonts/inter/Inter-SemiBold.ttf"),
  "Inter-Thin": require("../../assets/fonts/inter/Inter-Thin.ttf"),
};

export const loadFonts = async (): Promise<void> => {
  await Font.loadAsync(fonts);
};

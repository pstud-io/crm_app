import * as SplashScreen from "expo-splash-screen";

export const initializeSplashScreen = () => {
  SplashScreen.preventAutoHideAsync();

  SplashScreen.setOptions({
    duration: 500,
    fade: true,
  });
};

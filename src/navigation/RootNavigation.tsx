import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { linking, userNavigationRef } from "./UserNavigation";
import { useTheme } from "@/hooks/useTheme";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryProvider } from "@/providers/QueryProvider";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Navigation } from "./Navigation";
import { FloatingButtons } from "@/components/FloatingButtons";

function RootNavigation() {
  const { theme } = useTheme();

  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.background,
    },
  };

  return (
    <NavigationContainer
      ref={userNavigationRef}
      linking={linking}
      theme={navigationTheme}
    >
      <ActionSheetProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <QueryProvider>
              <KeyboardProvider enabled>
                <Navigation />
                <FloatingButtons />
              </KeyboardProvider>
            </QueryProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </ActionSheetProvider>
    </NavigationContainer>
  );
}

export default RootNavigation;

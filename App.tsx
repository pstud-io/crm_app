import * as Sentry from "@sentry/react-native";
import { ThemeProvider } from "@/providers/ThemeProvider";
import AuthProvider from "@/providers/AuthProvider";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import RootNavigation from "@/navigation/RootNavigation";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryProvider } from "@/providers/QueryProvider";
import { initializeSentry } from "@/config/sentryConfig";
import { initializeSplashScreen } from "@/config/splashScreenConfig";
import {
  initializeNotifications,
  registerForPushNotificationsAsync,
} from "@/config/notificationConfig";
import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { TestComponent } from "TestComponent";

initializeSplashScreen();
initializeSentry();
initializeNotifications();

export default Sentry.wrap(function App() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        console.log("Token from useEffect", token);
        setExpoPushToken(token ?? "");
      })
      .catch((error: any) => setExpoPushToken(`${error}`));

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      },
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <>
      <SafeAreaProvider style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ActionSheetProvider>
              <QueryProvider>
                <Provider store={store}>
                  <AuthProvider>
                    <ThemeProvider>
                      <TestComponent
                        expoPushToken={expoPushToken}
                        notification={notification}
                      />
                      <RootNavigation />
                    </ThemeProvider>
                  </AuthProvider>
                </Provider>
              </QueryProvider>
            </ActionSheetProvider>
          </GestureHandlerRootView>
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
});

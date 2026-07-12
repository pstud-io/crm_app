import * as Sentry from "@sentry/react-native";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { FirstComponent } from "@/providers/FirstComponent";
import * as SplashScreen from "expo-splash-screen";
import AuthProvider from "@/providers/AuthProvider";
import { Navigation } from "@/navigation/Navigation";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { QueryProvider } from "@/providers/QueryProvider";
import { NavigationContainer } from "@react-navigation/native";
import { FloatingButtons } from "@/components/FloatingButtons";
import { Provider } from "react-redux";
import { store } from "@/store/store";
SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

Sentry.init({
  dsn: "https://3ff2b1f1c2fe7df4cd8d16d23fc5064f@o4511659883036672.ingest.de.sentry.io/4511671023829072",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function App() {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Provider store={store}>
          <QueryProvider>
            <AuthProvider>
              <ThemeProvider>
                <Navigation />
                <FirstComponent />
                <FloatingButtons />
              </ThemeProvider>
            </AuthProvider>
          </QueryProvider>
        </Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
});

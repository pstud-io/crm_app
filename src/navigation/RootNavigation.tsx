import {
  DefaultTheme,
  LinkingOptions,
  NavigationContainer,
  ParamListBase,
} from "@react-navigation/native";
import { linking, userNavigationRef } from "./UserNavigation";
import { useTheme } from "@/hooks/useTheme";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryProvider } from "@/providers/QueryProvider";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Navigation } from "./Navigation";
import { FloatingButtons } from "@/components/FloatingButtons";
import { useAuth } from "@/hooks/useAuth";
import { Role } from "@/types/AuthTypes";
import { authLinking, authNavigationRef } from "./AuthNavigation";
import { CallLog } from "@/screens/CallHistory/components/CallLog";
import Toast from "react-native-toast-message";

function RootNavigation() {
  const { theme } = useTheme();
  const { role } = useAuth();

  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.background,
    },
  };

  const finalLinking: LinkingOptions<ParamListBase> =
    role === Role.GUEST
      ? (authLinking as LinkingOptions<ParamListBase>)
      : (linking as LinkingOptions<ParamListBase>);

  const finalRef = role === Role.GUEST ? authNavigationRef : userNavigationRef;

  return (
    <NavigationContainer
      ref={finalRef}
      linking={finalLinking}
      theme={navigationTheme}
    >
      <Navigation />
      <CallLog />
      <Toast />
    </NavigationContainer>
  );
}

export default RootNavigation;

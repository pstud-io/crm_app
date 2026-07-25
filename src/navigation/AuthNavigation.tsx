import {
  NavigationContainer,
  LinkingOptions,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SignIn } from "@/screens/signin/SignIn";

export type AuthStackParamList = {
  SignIn: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AuthStackParamList {}
  }
}

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const authNavigationRef =
  createNavigationContainerRef<AuthStackParamList>();

export const authLinking: LinkingOptions<AuthStackParamList> = {
  prefixes: ["pipeline://"],
  config: {
    screens: {
      SignIn: "signin",
    },
  },
};

export const AuthNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="SignIn"
      screenOptions={{
        headerShown: false,
        headerTitle: undefined,
      }}
    >
      <Stack.Screen name="SignIn" component={SignIn} />
    </Stack.Navigator>
  );
};

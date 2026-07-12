import {
  createStaticNavigation,
  LinkingOptions,
  NavigationIndependentTree,
  StaticParamList,
  Theme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SignIn } from "@/screens/signin/SignIn";
const AuthStack = createNativeStackNavigator({
  initialRouteName: "SignIn",
  screenOptions: {
    headerShown: false,
    headerTitle: undefined,
  },
  screens: {
    SignIn: {
      linking: "/signin",
      screen: SignIn,
    },
  },
});

type AuthStackParamsList = StaticParamList<typeof AuthStack>;
declare global {
  namespace ReactNavigation {
    interface AuthParamsList extends AuthStackParamsList {}
  }
}

export const AuthNavigation = () => {
  const linking: LinkingOptions<ReactNavigation.AuthParamsList> = {
    prefixes: ["pipeline://"],
    enabled: true,
  };

  const StaticAuthNavigation = createStaticNavigation(AuthStack);
  return (
    <NavigationIndependentTree>
      <StaticAuthNavigation linking={linking} />
    </NavigationIndependentTree>
  );
};

import {
  createStaticNavigation,
  LinkingOptions,
  NavigationIndependentTree,
  StaticParamList,
  Theme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Dashboard } from "@/screens/Dashboard";
const UserStack = createNativeStackNavigator({
  initialRouteName: "Dashboard",
  screenOptions: {
    headerShown: false,
    headerTitle: undefined,
  },
  screens: {
    Dashboard: {
      linking: "/dashboard",
      screen: Dashboard,
    },
  },
});

type UserStackParamsList = StaticParamList<typeof UserStack>;
declare global {
  namespace ReactNavigation {
    interface UserParamsList extends UserStackParamsList {}
  }
}

export const UserNavigation = () => {
  const linking: LinkingOptions<ReactNavigation.UserParamsList> = {
    prefixes: ["delite://"],
    enabled: true,
  };

  const StaticUserNavigation = createStaticNavigation(UserStack);
  return (
    <NavigationIndependentTree>
      <StaticUserNavigation linking={linking} />
    </NavigationIndependentTree>
  );
};

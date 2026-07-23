import { Dashboard } from "@/screens/dashboard/Dashboard";
import {
  createStaticNavigation,
  DefaultTheme,
  LinkingOptions,
  NavigationIndependentTree,
  StaticParamList,
  Theme,
} from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { createNavigationContainerRef } from "@react-navigation/native";
import { DashboardHeader } from "@/screens/dashboard/components/DashboardHeader";
import { useTheme } from "@/hooks/useTheme";
import { TasksStack } from "./TasksNavigation";
import { CameraScreen } from "@/screens/CameraScreen";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NotesStack } from "./NotesNavigation";
import { LeadsStack } from "./LeadsNavigation";
import { ProfileStack } from "./ProfileNavigation";
import { NotificationsStack } from "./NotificationNavigation";
import { Search } from "@/screens/search/Search";
import { CommonHeader } from "@/components/CommonHeader";

const UserStack = createNativeStackNavigator({
  initialRouteName: "Dashboard",
  screenOptions: {
    headerShown: false,
    headerTitle: undefined,
  },
  screens: {
    Dashboard: {
      linking: "dashboard",
      layout: ({ children }) => (
        <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
      ),
      screen: Dashboard,
      options: {
        headerShown: true,
        header: (props: NativeStackHeaderProps) => (
          <DashboardHeader {...props} />
        ),
        animation: "fade",
      },
    },
    Search: {
      linking: "search",
      layout: ({ children }) => (
        <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
      ),
      screen: Search,
      options: {
        headerShown: true,
        header: (props: NativeStackHeaderProps) => (
          <CommonHeader {...props} title="Search" />
        ),
        animation: "fade",
      },
    },
    Leads: {
      layout: ({ children }) => (
        <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
      ),
      linking: "leads",
      screen: LeadsStack,
      options: {
        headerShown: false,
      },
    },
    Tasks: {
      layout: ({ children }) => (
        <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
      ),
      linking: "tasks",
      screen: TasksStack,
      options: {
        headerShown: false,
      },
    },
    Notes: {
      layout: ({ children }) => (
        <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
      ),
      linking: "notes",
      screen: NotesStack,
      options: {
        headerShown: false,
      },
    },
    CameraScreen: {
      linking: "camera",
      screen: CameraScreen,
      options: {
        headerShown: false,
      },
    },
    Profile: {
      linking: "profile",
      screen: ProfileStack,
      options: {
        headerShown: false,
      },
    },
    Notifications: {
      linking: "notifications",
      screen: NotificationsStack,
      options: {
        headerShown: false,
      },
    },
  },
});

export type UserStackParamsList = StaticParamList<typeof UserStack>;
declare global {
  namespace ReactNavigation {
    interface UserParamsList extends UserStackParamsList {}
  }
}

const StaticUserNavigation = createStaticNavigation(UserStack);

export const userNavigationRef =
  createNavigationContainerRef<UserStackParamsList>();

export type UserNavigationProp = NativeStackNavigationProp<UserStackParamsList>;

export const UserNavigation = () => {
  const linking: LinkingOptions<ReactNavigation.UserParamsList> = {
    prefixes: ["pipeline://"],
    enabled: true,
  };

  const { theme } = useTheme();

  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.background,
    },
  };

  return (
    // <NavigationIndependentTree>
    <StaticUserNavigation
      linking={linking}
      theme={navigationTheme}
      ref={userNavigationRef}
    />
    // </NavigationIndependentTree>
  );
};

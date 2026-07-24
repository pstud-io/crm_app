import { Dashboard } from "@/screens/dashboard/Dashboard";
import { DefaultTheme, LinkingOptions } from "@react-navigation/native";
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
import { NavigationContainer } from "@react-navigation/native";

export type UserStackParamsList = {
  Dashboard: undefined;
  Search: undefined;
  Leads: undefined;
  Tasks: undefined;
  Notes: undefined;
  CameraScreen: undefined;
  Profile: undefined;
  Notifications: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends UserStackParamsList {}
  }
}

const Stack = createNativeStackNavigator<UserStackParamsList>();

export const userNavigationRef =
  createNavigationContainerRef<UserStackParamsList>();

export type UserNavigationProp = NativeStackNavigationProp<UserStackParamsList>;

export const linking: LinkingOptions<UserStackParamsList> = {
  prefixes: ["pipeline://"],
  config: {
    screens: {
      Dashboard: "dashboard",
      Search: "search",
      Leads: "leads",
      Tasks: "tasks",
      Notes: "notes",
      CameraScreen: "camera",
      Profile: "profile",
      Notifications: "notifications",
    },
  },
};

export const UserNavigation = () => {
  return (
    <>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerShown: false,
          headerTitle: undefined,
        }}
      >
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            headerShown: true,
            header: (props: NativeStackHeaderProps) => (
              <DashboardHeader {...props} />
            ),
            animation: "fade",
          }}
        />

        <Stack.Screen
          name="Search"
          component={Search}
          options={{
            headerShown: true,
            header: (props: NativeStackHeaderProps) => (
              <CommonHeader {...props} title="Search" />
            ),
            animation: "fade",
          }}
        />

        <Stack.Screen
          name="Leads"
          component={LeadsStack}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Tasks"
          component={TasksStack}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Notes"
          component={NotesStack}
          options={{ headerShown: false }}
        />

        <Stack.Screen name="CameraScreen" options={{ headerShown: false }}>
          {(props) => (
            <CameraScreen
              {...props}
              onSave={(mediaArray: any[]) => {
                // @ts-ignore
                props.route.params?.onSave(mediaArray);
                props.navigation.pop();
              }}
              onClose={() => props.navigation.pop()}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Profile"
          component={ProfileStack}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Notifications"
          component={NotificationsStack}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </>
  );
};

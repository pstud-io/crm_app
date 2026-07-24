import { CommonHeader } from "@/components/CommonHeader";
import { ListNotifications } from "@/screens/Notifications";
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from "@react-navigation/native-stack";

export type NotificationsStackParamList = {
  ListNotifications: undefined;
};

const Stack = createNativeStackNavigator<NotificationsStackParamList>();

export const NotificationsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ListNotifications"
      screenOptions={{
        headerShown: false,
        headerTitle: undefined,
      }}
    >
      <Stack.Screen
        name="ListNotifications"
        component={ListNotifications}
        options={{
          headerShown: true,
          header: (props: NativeStackHeaderProps) => (
            <CommonHeader {...props} title="Notifications" />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

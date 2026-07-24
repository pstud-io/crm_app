import { CommonHeader } from "@/components/CommonHeader";
import { ResetPassword } from "@/screens/Profile";
import ProfileTab from "@/screens/Profile/Tab/ProfileTab";
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from "@react-navigation/native-stack";

export type ProfileStackParamList = {
  ListProfile: undefined;
  ResetPassword: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ListProfile"
      screenOptions={{
        headerShown: false,
        headerTitle: undefined,
      }}
    >
      <Stack.Screen
        name="ListProfile"
        component={ProfileTab}
        options={{
          headerShown: true,
          header: (props: NativeStackHeaderProps) => (
            <CommonHeader {...props} title="Profile" />
          ),
        }}
      />

      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{
          headerShown: true,
          header: (props: NativeStackHeaderProps) => (
            <CommonHeader {...props} title="Add Note" />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

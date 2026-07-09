import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Dashboard } from "@/screens/Dashboard";

export type UserStackParamList = {
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<UserStackParamList>();

export const UserNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        headerTitle: undefined,
      }}
    >
      <Stack.Screen name="Dashboard" component={Dashboard} />
    </Stack.Navigator>
  );
};

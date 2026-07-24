import { NavigationContainer, LinkingOptions } from "@react-navigation/native";
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

export const AuthNavigation = () => {
  const linking: LinkingOptions<AuthStackParamList> = {
    prefixes: ["pipeline://"],
    config: {
      screens: {
        SignIn: "signin",
      },
    },
  };

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName="SignIn"
        screenOptions={{
          headerShown: false,
          headerTitle: undefined,
        }}
      >
        <Stack.Screen name="SignIn" component={SignIn} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

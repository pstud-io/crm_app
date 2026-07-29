import { CommonHeader } from "@/components/CommonHeader";
import { ListLeads } from "@/screens/Leads/ListLeads";
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from "@react-navigation/native-stack";
import { LeadDetailsTabs } from "./LeadsTopTabNavigation";

export type LeadsStackParamList = {
  ListLeads: {
    autoOpenAddLead?: boolean;
  };
  LeadDetails: {
    project: string;
  };
};

const Stack = createNativeStackNavigator<LeadsStackParamList>();

export const LeadsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ListLeads"
      screenOptions={{
        headerShown: false,
        headerTitle: undefined,
      }}
    >
      <Stack.Screen
        name="ListLeads"
        component={ListLeads}
        options={{
          headerShown: false,
          header: (props: NativeStackHeaderProps) => (
            <CommonHeader {...props} title="Leads" />
          ),
        }}
      />

      <Stack.Screen
        name="LeadDetails"
        component={LeadDetailsTabs}
        initialParams={{
          project: "",
        }}
        options={{
          headerShown: true,
          header: (props: NativeStackHeaderProps) => (
            <CommonHeader {...props} title="Lead Details" />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

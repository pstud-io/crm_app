import { CommonHeader } from "@/components/CommonHeader";
import { ListLeads } from "@/screens/Leads/ListLeads";
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from "@react-navigation/native-stack";
import { LeadDetailsTabs } from "./LeadsTopTabNavigation";
import { ListCallHistory } from "@/screens/CallHistory/ListCallHistory";
import { CommonHeaderWithProject } from "@/components/CommonHeaderWithProject";

export type CallHistoryStackParamList = {
  ListCallHistory: {
    project_id: string | null;
  };
  CallHistoryDetails: undefined;
};

const Stack = createNativeStackNavigator<CallHistoryStackParamList>();

export const CallHistoryStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ListCallHistory"
      screenOptions={{
        headerShown: false,
        headerTitle: undefined,
      }}
    >
      <Stack.Screen
        name="ListCallHistory"
        component={ListCallHistory}
        options={{
          headerShown: true,
          header: (props: NativeStackHeaderProps) => (
            <CommonHeaderWithProject {...props} title="Call History" />
          ),
        }}
      />
      <Stack.Screen
        name="CallHistoryDetails"
        component={LeadDetailsTabs}
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

import { CommonHeader } from "@/components/CommonHeader";
import { ListLeads } from "@/screens/Leads/ListLeads";
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from "@react-navigation/native-stack";
import { LeadDetailsTabs } from "./LeadsTopTabNavigation";
import { ListCallHistory } from "@/screens/CallHistory/ListCallHistory";
import { CommonHeaderWithProject } from "@/components/CommonHeaderWithProject";
import Attendance from "@/screens/Attendance/Attendance";
import PayrollDetailView from "@/screens/Attendance/components/payroll/PayrollDetailView";

export type AttendanceStackParamList = {
  ListAttendance: undefined;
  PayrollDetailView: { payroll: any };
};

const Stack = createNativeStackNavigator<AttendanceStackParamList>();

export const AttendanceStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ListAttendance"
      screenOptions={{
        headerShown: false,
        headerTitle: undefined,
      }}
    >
      <Stack.Screen
        name="ListAttendance"
        component={Attendance}
        options={{
          headerShown: true,
          header: (props: NativeStackHeaderProps) => (
            <CommonHeader {...props} title="Attendance" />
          ),
        }}
      />
      <Stack.Screen
        name="PayrollDetailView"
        component={PayrollDetailView}
        options={{
          headerShown: true,
          header: (props: NativeStackHeaderProps) => (
            <CommonHeader {...props} title="Payroll" />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

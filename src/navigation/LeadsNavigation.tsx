import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from "@react-navigation/native-stack";
import { TasksHeader } from "@/screens/tasks/components/TasksHeader";
import { ListLeads } from "@/screens/Leads/ListLeads";
import { LeadDetailsTabs } from "./LeadsTopTabNavigation";
import { CommonHeader } from "@/components/CommonHeader";

export const LeadsStack = createNativeStackNavigator({
  initialRouteName: "ListLeads",
  screenOptions: {
    headerShown: false,
    headerTitle: undefined,
  },
  screens: {
    ListLeads: {
      linking: "list-leads",
      screen: ListLeads,
      options: {
        headerShown: true,
        header: (props: NativeStackHeaderProps) => (
          <CommonHeader {...props} title="Leads" />
        ),
      },
    },
    LeadDetails: {
      linking: "lead-details",
      screen: LeadDetailsTabs,
      initialParams: {
        project: "",
      } as const,
      options: {
        headerShown: true,
        header: (props: NativeStackHeaderProps) => (
          <CommonHeader {...props} title="Lead Details" />
        ),
      },
    },
  },
});

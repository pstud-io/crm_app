import { LeadsTopBar } from "@/screens/Leads/components/LeadsTopBar";
import { LeadInfo } from "@/screens/Leads/LeadInfo";
import { LeadStage } from "@/screens/Leads/LeadStage";
import { ListNotes } from "@/screens/Notes";
import { ListTasks } from "@/screens/tasks/ListTasks";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

export const LeadDetailsTabs = createMaterialTopTabNavigator({
  tabBar: (props) => <LeadsTopBar {...props} />,
  screenOptions: {
    swipeEnabled: false,
  },
  initialRouteName: "Info",
  screens: {
    Info: {
      screen: LeadInfo,
      initialParams: {
        project: "",
      },
    },
    Timeline: {
      screen: LeadStage,
      initialParams: {
        project: "",
      } as const,
    },
    "Follow Ups": {
      screen: ListTasks,
      initialParams: {
        task_type: "followup",
        fromLeads: true,
      },
    },
    Tasks: {
      screen: ListTasks,
      initialParams: {
        task_type: "",
        fromLeads: true,
      },
    },
    Notes: {
      screen: ListNotes,
      initialParams: {
        selectedProject: null,
        fromLeads: true,
      },
    },
    "Stage History": {
      screen: LeadStage,
      initialParams: {
        project: "",
      } as const,
    },
  },
});

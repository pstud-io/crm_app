import { LeadsTopBar } from "@/screens/Leads/components/LeadsTopBar";
import { LeadInfo } from "@/screens/Leads/LeadInfo";
import { LeadStage } from "@/screens/Leads/LeadStage";
import { ListNotes } from "@/screens/Notes";
import { ListTasks } from "@/screens/tasks/ListTasks";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

export type LeadDetailsTabParamList = {
  Info: {
    project: string;
  };
  Timeline: {
    project: string;
  };
  "Follow Ups": {
    task_type: "followup";
    fromLeads: boolean;
  };
  Tasks: {
    task_type: string;
    fromLeads: boolean;
  };
  Notes: {
    selectedProject: any;
    fromLeads: boolean;
  };
  "Stage History": {
    project: string;
  };
};

const Tab = createMaterialTopTabNavigator<LeadDetailsTabParamList>();

export const LeadDetailsTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Info"
      tabBar={(props) => <LeadsTopBar {...props} />}
      screenOptions={{
        swipeEnabled: false,
      }}
    >
      <Tab.Screen
        name="Info"
        component={LeadInfo}
        initialParams={{
          project: "",
        }}
      />

      <Tab.Screen
        name="Timeline"
        component={LeadStage}
        initialParams={{
          project: "",
        }}
      />

      <Tab.Screen
        name="Follow Ups"
        component={ListTasks}
        initialParams={{
          task_type: "followup",
          fromLeads: true,
        }}
      />

      <Tab.Screen
        name="Tasks"
        component={ListTasks}
        initialParams={{
          task_type: "",
          fromLeads: true,
        }}
      />

      <Tab.Screen
        name="Notes"
        component={ListNotes}
        initialParams={{
          selectedProject: null,
          fromLeads: true,
        }}
      />

      <Tab.Screen
        name="Stage History"
        component={LeadStage}
        initialParams={{
          project: "",
        }}
      />
    </Tab.Navigator>
  );
};

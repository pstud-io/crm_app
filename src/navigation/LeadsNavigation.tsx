import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from "@react-navigation/native-stack";
import { TasksHeader } from "@/screens/tasks/components/TasksHeader";
import { ListLeads } from "@/screens/Leads/ListLeads";

export const LeadsStack = createNativeStackNavigator({
  initialRouteName: "ListTasks",
  screenOptions: {
    headerShown: false,
    headerTitle: undefined,
  },
  screens: {
    ListTasks: {
      linking: "list-leads",
      screen: ListLeads,
      options: {
        headerShown: true,
        header: (props: NativeStackHeaderProps) => <TasksHeader {...props} />,
      },
    },
    // AddTask: {
    //   linking: "add-task",
    //   screen: AddTaskFromTasksTab,
    //   options: {
    //     headerShown: true,
    //     header: (props: NativeStackHeaderProps) => <TasksHeader {...props} />,
    //   },
    // },
    // EditTask: {
    //   linking: "edit-task",
    //   screen: EditTask,
    //   options: {
    //     headerShown: true,
    //     header: (props: NativeStackHeaderProps) => <TasksHeader {...props} />,
    //   },
    // },
    // TaskDetails: {
    //   linking: "task-details",
    //   screen: TaskDetails,
    //   options: {
    //     headerShown: true,
    //     header: (props: NativeStackHeaderProps) => <TasksHeader {...props} />,
    //   },
    // },
  },
});

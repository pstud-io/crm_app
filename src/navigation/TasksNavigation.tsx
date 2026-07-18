import { Dashboard } from "@/screens/dashboard/Dashboard";
import {
  createStaticNavigation,
  DefaultTheme,
  LinkingOptions,
  NavigationIndependentTree,
  StaticParamList,
  Theme,
} from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from "@react-navigation/native-stack";
import { ListTasks } from "@/screens/tasks/ListTasks";
import { TasksHeader } from "@/screens/tasks/components/TasksHeader";
import { AddTaskFromTasksTab } from "@/screens/AddTaskFromTasksTab";
import EditTask from "@/screens/AddTaskFromTasksTab/EditTask";
import { TaskDetails } from "@/screens/TaskDetails";
import { CommonHeader } from "@/components/CommonHeader";
import { CommonHeaderWithProject } from "@/components/CommonHeaderWithProject";

export const TasksStack = createNativeStackNavigator({
  initialRouteName: "ListTasks",
  screenOptions: {
    headerShown: false,
    headerTitle: undefined,
  },
  screens: {
    ListTasks: {
      linking: "list-tasks",
      screen: ListTasks,
      initialParams: {
        task_type: "" as string,
      },
      options: {
        headerShown: true,
        header: (props: NativeStackHeaderProps) => (
          <CommonHeaderWithProject {...props} title="Tasks" />
        ),
      },
    },
    ListFollowUps: {
      linking: "list-tasks",
      screen: ListTasks,
      initialParams: {
        task_type: "" as string,
      },
      options: {
        headerShown: true,
        header: (props: NativeStackHeaderProps) => (
          <CommonHeaderWithProject {...props} title="Follow Ups" />
        ),
      },
    },
    AddTask: {
      linking: "add-task",
      screen: AddTaskFromTasksTab,
      options: {
        headerShown: true,
        header: (props: NativeStackHeaderProps) => (
          <CommonHeader {...props} title="Add Task" />
        ),
      },
    },
    EditTask: {
      linking: "edit-task",
      screen: EditTask,
      options: {
        headerShown: true,
        header: (props: NativeStackHeaderProps) => (
          <CommonHeader {...props} title="Edit Task" />
        ),
      },
    },
    TaskDetails: {
      linking: "task-details",
      screen: TaskDetails,
      options: {
        headerShown: true,
        header: (props: NativeStackHeaderProps) => (
          <CommonHeader {...props} title="Task Details" />
        ),
      },
    },
  },
});

// export type TasksStackParamsList = StaticParamList<typeof TasksStack>;
// declare global {
//   namespace ReactNavigation {
//     interface TasksParamsList extends TasksStackParamsList {}
//   }
// }

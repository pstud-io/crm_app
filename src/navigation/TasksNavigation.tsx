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
      options: {
        headerShown: true,
        header: (props: NativeStackHeaderProps) => <TasksHeader {...props} />,
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

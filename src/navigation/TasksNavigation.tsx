import { CommonHeader } from "@/components/CommonHeader";
import { CommonHeaderWithProject } from "@/components/CommonHeaderWithProject";
import { AddTaskFromTasksTab } from "@/screens/AddTaskFromTasksTab";
import EditTask from "@/screens/AddTaskFromTasksTab/EditTask";
import { TaskDetails } from "@/screens/TaskDetails";
import { ListTasks } from "@/screens/tasks/ListTasks";
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from "@react-navigation/native-stack";

export type TasksStackParamList = {
  ListTasks: {
    task_type: string;
  };
  ListFollowUps: {
    task_type: string;
  };
  AddTask: undefined;
  EditTask: undefined;
  TaskDetails: undefined;
};

const Stack = createNativeStackNavigator<TasksStackParamList>();

export const TasksStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ListTasks"
      screenOptions={{
        headerShown: false,
        headerTitle: undefined,
      }}
    >
      <Stack.Screen
        name="ListTasks"
        component={ListTasks}
        initialParams={{
          task_type: "",
        }}
        options={{
          headerShown: true,
          header: (props: NativeStackHeaderProps) => (
            <CommonHeaderWithProject {...props} title="Tasks" />
          ),
        }}
      />

      <Stack.Screen
        name="ListFollowUps"
        component={ListTasks}
        initialParams={{
          task_type: "",
        }}
        options={{
          headerShown: true,
          header: (props: NativeStackHeaderProps) => (
            <CommonHeaderWithProject {...props} title="Follow Ups" />
          ),
        }}
      />

      <Stack.Screen
        name="AddTask"
        component={AddTaskFromTasksTab}
        options={{
          headerShown: true,
          header: (props: NativeStackHeaderProps) => (
            <CommonHeader {...props} title="Add Task" />
          ),
        }}
      />

      <Stack.Screen
        name="EditTask"
        component={EditTask}
        options={{
          headerShown: true,
          header: (props: NativeStackHeaderProps) => (
            <CommonHeader {...props} title="Edit Task" />
          ),
        }}
      />

      <Stack.Screen
        name="TaskDetails"
        component={TaskDetails}
        options={{
          headerShown: true,
          header: (props: NativeStackHeaderProps) => (
            <CommonHeader {...props} title="Task Details" />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

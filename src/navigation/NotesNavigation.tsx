import { Dashboard } from "@/screens/dashboard/Dashboard";
import { AddNote, ListNotes, NoteDetails } from "@/screens/Notes";
import { TasksHeader } from "@/screens/tasks/components/TasksHeader";
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

export const NotesStack = createNativeStackNavigator({
  initialRouteName: "ListNotes",
  screenOptions: {
    headerShown: false,
    headerTitle: undefined,
  },
  screens: {
    ListNotes: {
      linking: "list-notes",
      screen: ListNotes,
      options: {
        headerShown: true,
        header: (props: NativeStackHeaderProps) => <TasksHeader {...props} />,
      },
    },
    AddNote: {
      linking: "add-note",
      screen: AddNote,
      options: {
        headerShown: true,
        header: (props: NativeStackHeaderProps) => <TasksHeader {...props} />,
      },
    },

    NoteDetails: {
      linking: "note-details",
      screen: NoteDetails,
      options: {
        headerShown: true,
        header: (props: NativeStackHeaderProps) => <TasksHeader {...props} />,
      },
    },
  },
});

import { CommonHeader } from "@/components/CommonHeader";
import { CommonHeaderWithProject } from "@/components/CommonHeaderWithProject";
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
      initialParams: {
        project: {
          id: "",
          project_name: "",
        } as const,
      },
      options: {
        headerShown: true,
        header: (props: NativeStackHeaderProps) => (
          <CommonHeaderWithProject {...props} title="Notes" />
        ),
      },
    },
    AddNote: {
      linking: "add-note",
      screen: AddNote,
      options: {
        headerShown: true,
        header: (props: NativeStackHeaderProps) => (
          <CommonHeader {...props} title="Add Note" />
        ),
      },
    },
    NoteDetails: {
      linking: "note-details",
      screen: NoteDetails,
      options: {
        headerShown: true,
        header: (props: NativeStackHeaderProps) => (
          <CommonHeader {...props} title="Note Details" />
        ),
      },
    },
  },
});

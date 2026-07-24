import { CommonHeader } from "@/components/CommonHeader";
import { CommonHeaderWithProject } from "@/components/CommonHeaderWithProject";
import { AddNote, ListNotes, NoteDetails } from "@/screens/Notes";
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from "@react-navigation/native-stack";

export type NotesStackParamList = {
  ListNotes: {
    project: {
      id: string;
      project_name: string;
    };
  };
  AddNote: undefined;
  NoteDetails: undefined;
};

const Stack = createNativeStackNavigator<NotesStackParamList>();

export const NotesStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ListNotes"
      screenOptions={{
        headerShown: false,
        headerTitle: undefined,
      }}
    >
      <Stack.Screen
        name="ListNotes"
        component={ListNotes}
        initialParams={{
          project: {
            id: "",
            project_name: "",
          },
        }}
        options={{
          headerShown: true,
          header: (props: NativeStackHeaderProps) => (
            <CommonHeaderWithProject {...props} title="Notes" />
          ),
        }}
      />

      <Stack.Screen
        name="AddNote"
        component={AddNote}
        options={{
          headerShown: true,
          header: (props: NativeStackHeaderProps) => (
            <CommonHeader {...props} title="Add Note" />
          ),
        }}
      />

      <Stack.Screen
        name="NoteDetails"
        component={NoteDetails}
        options={{
          headerShown: true,
          header: (props: NativeStackHeaderProps) => (
            <CommonHeader {...props} title="Note Details" />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

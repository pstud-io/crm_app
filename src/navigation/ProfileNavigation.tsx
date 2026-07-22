import { CommonHeader } from "@/components/CommonHeader";
import { CommonHeaderWithProject } from "@/components/CommonHeaderWithProject";
import { AddNote, ListNotes, NoteDetails } from "@/screens/Notes";
import { ResetPassword } from "@/screens/Profile";
import ProfileTab from "@/screens/Profile/Tab/ProfileTab";
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from "@react-navigation/native-stack";

export const ProfileStack = createNativeStackNavigator({
  initialRouteName: "ListProfile",
  screenOptions: {
    headerShown: false,
    headerTitle: undefined,
  },
  screens: {
    ListProfile: {
      linking: "",
      screen: ProfileTab,
      options: {
        headerShown: true,
        header: (props: NativeStackHeaderProps) => (
          <CommonHeader {...props} title="Profile" />
        ),
      },
    },
    ResetPassword: {
      linking: "reset-password",
      screen: ResetPassword,
      options: {
        headerShown: true,
        header: (props: NativeStackHeaderProps) => (
          <CommonHeader {...props} title="Add Note" />
        ),
      },
    },
  },
});

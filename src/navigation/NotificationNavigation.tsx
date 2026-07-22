import { CommonHeader } from "@/components/CommonHeader";
import { CommonHeaderWithProject } from "@/components/CommonHeaderWithProject";
import { AddNote, ListNotes, NoteDetails } from "@/screens/Notes";
import { ListNotifications } from "@/screens/Notifications";
import { ResetPassword } from "@/screens/Profile";
import ProfileTab from "@/screens/Profile/Tab/ProfileTab";
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from "@react-navigation/native-stack";

export const NotificationsStack = createNativeStackNavigator({
  initialRouteName: "ListNotifications",
  screenOptions: {
    headerShown: false,
    headerTitle: undefined,
  },
  screens: {
    ListNotifications: {
      linking: "",
      screen: ListNotifications,
      options: {
        headerShown: true,
        header: (props: NativeStackHeaderProps) => (
          <CommonHeader {...props} title="Notifications" />
        ),
      },
    },
  },
});

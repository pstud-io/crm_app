import { useSelector } from "react-redux";
import {
  ChecklistOutline,
  CircleCheck,
  DownloadOutlineIcon,
  Hold,
  InProgress,
  Trash,
} from "@/svg";
import { primaryColors } from "@/design/colors";
import { SW } from "@/utils";
import { CircleCancel } from "@/svg";
import { RootState } from "@/store/store";
import { useTheme } from "./useTheme";
import FileIcon from "assets/icons/FileIcon";
import { height, width } from "@/design/distance";
import { borderWidth } from "@/design/borders";
import ClipboardIcon from "@/svg/clipboard-icon";
import PhoneIcon from "@/svg/phone";
import { useNavigation } from "@react-navigation/native";
import { UserNavigationProp } from "@/navigation/UserNavigation";
import { Dispatch, SetStateAction } from "react";
import UserCheck from "assets/icons/UserCheck";
export const useFloatingButtonOptions = ({
  setExpanded,
}: {
  setExpanded: Dispatch<SetStateAction<boolean>>;
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation<UserNavigationProp>();
  const project = useSelector((state: RootState) => state.project);
  const add_lead = {
    id: "add_lead",
    icon: (
      <ChecklistOutline
        width={20}
        height={20}
        stroke={theme.text}
        strokeWidth={1.25}
      />
    ),
    title: "Add Lead",
    onPress: () => {
      setExpanded((prev) => !prev);
      setTimeout(() => {
        navigation.navigate("Leads", {
          screen: "ListLeads",
          params: { autoOpenAddLead: true },
        });
      }, 200);
    },
  };
  const add_task = {
    id: "add_task",
    icon: (
      <FileIcon
        width={width[20]}
        height={height[20]}
        strokeWidth={borderWidth.lg}
        stroke={theme.text}
        fill={"none"}
      />
    ),
    title: "Add Task",
    onPress: () => {
      setExpanded((prev) => !prev);
      setTimeout(() => {
        navigation.navigate("Tasks", {
          screen: "AddTask",
          params: {
            voiceInput: false,
            onRefresh: () => {},
          },
        });
      }, 200);
    },
  };
  const add_note = {
    id: "add_note",
    icon: (
      <ClipboardIcon
        width={20}
        height={20}
        stroke={theme.text}
        strokeWidth={borderWidth.lg}
        style={{}}
      />
    ),
    title: "Add Note",
    onPress: () => {
      setExpanded((prev) => !prev);
      setTimeout(() => {
        navigation.navigate("Notes", {
          screen: "AddNote",
          params: {
            project_id: project.id,
            project,
          },
        });
      }, 200);
    },
  };
  const add_followup = {
    id: "add_followup",
    icon: (
      <UserCheck
        stroke={theme.text}
        strokeWidth={borderWidth.xxl}
        fill={"transparent"}
        width={20}
        height={20}
        style={{}}
      />
    ),
    title: "Add Follow Up",
    onPress: () => {
      setExpanded((prev) => !prev);
      setTimeout(() => {
        navigation.navigate("Tasks", {
          screen: "AddTask",
          params: {
            voiceInput: false,
            onRefresh: () => {},
            task_type: "followup",
          },
        });
      }, 200);
    },
  };
  const floatingButtonOptions = [add_lead, add_task, add_note, add_followup];
  return { floatingButtonOptions };
};

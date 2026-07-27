import { borderWidth } from "@/design/borders";
import { height, width } from "@/design/distance";
import { useTheme } from "@/hooks/useTheme";
import { UserNavigationProp } from "@/navigation/UserNavigation";
import { RootState } from "@/store/store";
import {
  ActivitiesFilledIcon,
  ChecklistOutline,
  MenuDotOutline,
  MenuOutline,
} from "@/svg";
import ClipboardIcon from "@/svg/clipboard-icon";
import PhoneIcon from "@/svg/phone";
import { ModuleData, ModulesDataType } from "@/types/modulesDataType";
import FileIcon from "assets/icons/FileIcon";
import { useSelector } from "react-redux";

export const useModulesData: (
  navigation: UserNavigationProp,
) => ModulesDataType = (navigation) => {
  const { theme } = useTheme();
  const project = useSelector((state: RootState) => state.project);
  const leads: ModuleData = {
    id: "leads",
    label: "Leads",
    name: "LeadsStack",
    component: null,
    permission: "leads.view_leads",
    show: "leads_show",
    icon: (isActive) => (
      <ChecklistOutline width={20} height={20} fill={theme.textInverse} />
    ),
    onPress: async () => {
      console.log("Pressed navigation");
      navigation.push("Leads", {
        screen: "ListLeads",
        params: {
          autoOpenAddLead: false,
        },
      });
    },
  };

  const tasks: ModuleData = {
    id: "tasks",
    label: "Tasks",
    name: "TasksStack",
    component: null,
    permission: "tasks.view_tasks",
    show: "tasks_show",
    icon: (isActive) => (
      <FileIcon
        width={width[20]}
        height={height[20]}
        strokeWidth={borderWidth.lg}
        stroke={theme.textInverse}
        fill={"none"}
      />
    ),
    onPress: async () => {
      navigation.push("Tasks", {
        screen: "ListTasks",
        params: { task_type: "" },
      });
    },
  };

  const notes: ModuleData = {
    id: "notes",
    label: "Notes",
    name: "NotesStack",
    component: null,
    permission: "notes.view_notes",
    show: "notes_show",
    icon: (isActive) => (
      <ClipboardIcon
        width={20}
        height={20}
        stroke={theme.textInverse}
        strokeWidth={borderWidth.lg}
        style={{}}
      />
    ),
    onPress: async () => {
      navigation.push("Notes", {
        screen: "ListNotes",
        params: {
          project: {
            id: "",
            project_name: "",
          },
        },
      });
    },
  };

  const followUps: ModuleData = {
    id: "followUps",
    label: "Follow Ups",
    name: "FollowUpsStack",
    component: null,
    permission: "followUps.view_followUps",
    show: "followUps_show",
    icon: (isActive) => (
      <PhoneIcon
        stroke={theme.textInverse}
        strokeWidth={borderWidth.lg}
        fill={"transparent"}
        width={20}
        height={20}
        style={{}}
      />
    ),
    onPress: async () => {
      navigation.push("Tasks", {
        screen: "ListFollowUps",
        params: { task_type: "followup" },
      });
    },
  };

  const callHistory: ModuleData = {
    id: "call_history",
    label: "Call History",
    name: "CallHistoryStack",
    component: null,
    permission: "followUps.view_followUps",
    show: "call_history_show",
    icon: (isActive) => (
      <PhoneIcon
        stroke={theme.textInverse}
        strokeWidth={borderWidth.lg}
        fill={"transparent"}
        width={20}
        height={20}
        style={{}}
      />
    ),
    onPress: async () => {
      navigation.push("Calls", {
        screen: "ListCallHistory",
        params: { project_id: null },
      });
    },
  };

  const pipelineData: ModuleData[] = [leads];
  const actionsData: ModuleData[] = [tasks, notes, followUps, callHistory];

  return { pipelineData, actionsData };
};

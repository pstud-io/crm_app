import { borderWidth } from "@/design/borders";
import { height, width } from "@/design/distance";
import { useTheme } from "@/hooks/useTheme";
import { UserNavigationProp } from "@/navigation/UserNavigation";
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

export const useModulesData: (
  navigation: UserNavigationProp,
) => ModulesDataType = (navigation) => {
  const { theme } = useTheme();

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
      navigation.push("Leads");
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
        params: { task_type: "" } as any,
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
      navigation.push("Notes");
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
        params: { task_type: "followup" } as any,
      });
    },
  };

  const pipelineData: ModuleData[] = [leads];
  const actionsData: ModuleData[] = [tasks, notes, followUps];

  return { pipelineData, actionsData };
};

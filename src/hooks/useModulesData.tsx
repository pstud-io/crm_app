import { borderWidth } from "@/design/borders";
import { height, width } from "@/design/distance";
import { useTheme } from "@/hooks/useTheme";
import { UserNavigationProp } from "@/navigation/UserNavigation";
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
      <FileIcon
        width={width[20]}
        height={height[20]}
        strokeWidth={borderWidth.md}
        stroke={theme.textInverse}
        fill={"none"}
      />
    ),
    onPress: async () => {
      console.log("Pressed navigation");
      navigation.push("Tasks");
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
        strokeWidth={borderWidth.md}
        stroke={theme.textInverse}
        fill={"none"}
      />
    ),
    onPress: async () => {
      navigation.push("Tasks");
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
      <FileIcon
        width={width[20]}
        height={height[20]}
        strokeWidth={borderWidth.md}
        stroke={theme.textInverse}
        fill={"none"}
      />
    ),
    onPress: async () => {
      navigation.push("Tasks");
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
      <FileIcon
        width={width[20]}
        height={height[20]}
        strokeWidth={borderWidth.md}
        stroke={theme.textInverse}
        fill={"none"}
      />
    ),
    onPress: async () => {
      navigation.push("Tasks");
    },
  };

  const pipelineData: ModuleData[] = [leads];
  const actionsData: ModuleData[] = [tasks, notes, followUps];

  return { pipelineData, actionsData };
};

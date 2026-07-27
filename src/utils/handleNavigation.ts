import { StackActions } from "@react-navigation/native";
import { userNavigationRef } from "@/navigation/UserNavigation";
import { ProjectRecord } from "@/store/slices/projectSlice/projectSliceTypes";
import { openAddProjectBottomSheet } from "@/screens/dashboard/utils/addProjectBottomSheetService";
import { LeadRecord } from "@/store/slices/activeLeadGlobal";

export const handleNavigation = (
  activeSubButtonGlobal: string | null,
  project: ProjectRecord,
  activeLead: LeadRecord,
) => {
  console.log("Hit handle navigation", project);
  if (activeSubButtonGlobal === "tasks") {
    userNavigationRef.dispatch(
      StackActions.push("Tasks", {
        screen: "AddTask",
        params: {
          voiceInput: false,
          onRefresh: () => {},
        },
      }),
    );
  } else if (activeSubButtonGlobal === "lead-tasks") {
    userNavigationRef.dispatch(
      StackActions.push("Tasks", {
        screen: "AddTask",
        params: {
          voiceInput: false,
          onRefresh: () => {},
          lead_id: activeLead.id,
        },
      }),
    );
  } else if (activeSubButtonGlobal === "followups") {
    userNavigationRef.dispatch(
      StackActions.push("Tasks", {
        screen: "AddTask",
        params: {
          voiceInput: false,
          onRefresh: () => {},
          task_type: "followup",
        },
      }),
    );
  } else if (activeSubButtonGlobal === "lead-followups") {
    console.log("IN correct if for navigation", activeLead);
    userNavigationRef.dispatch(
      StackActions.push("Tasks", {
        screen: "AddTask",
        params: {
          voiceInput: false,
          onRefresh: () => {},
          task_type: "followup",
          lead_id: activeLead.id,
        },
      }),
    );
  } else if (activeSubButtonGlobal === "notes") {
    userNavigationRef.dispatch(
      StackActions.push("Notes", {
        screen: "AddNote",
        params: {
          project_id: project.id,
          project,
        },
      }),
    );
  } else if (activeSubButtonGlobal === "leads-notes") {
    userNavigationRef.dispatch(
      StackActions.push("Notes", {
        screen: "AddNote",
        params: {
          project_id: activeLead.id,
          project: activeLead,
        },
      }),
    );
  } else if (
    activeSubButtonGlobal === "leads" ||
    activeSubButtonGlobal === "dashboard"
  ) {
    console.log("Hitting for leads");
    openAddProjectBottomSheet();
  }
};

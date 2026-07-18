import { StackActions } from "@react-navigation/native";
import { userNavigationRef } from "@/navigation/UserNavigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ProjectRecord } from "@/store/slices/projectSlice/projectSliceTypes";

export const handleNavigation = (
  activeSubButtonGlobal: string | null,
  project: ProjectRecord,
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
  }
};

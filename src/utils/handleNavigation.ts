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
      StackActions.push("AddTask", {
        voiceInput: false,
        onRefresh: () => {},
      }),
    );
  } else if (activeSubButtonGlobal === "followups") {
    userNavigationRef.dispatch(
      StackActions.push("AddTask", {
        voiceInput: false,
        onRefresh: () => {},
        task_type: "followup",
      }),
    );
  } else if (activeSubButtonGlobal === "notes") {
    userNavigationRef.dispatch(
      StackActions.push("AddNote", {
        project_id: project.id,
        project,
      }),
    );
  }
};

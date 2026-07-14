import { StackActions } from "@react-navigation/native";
import { userNavigationRef } from "@/navigation/UserNavigation";

export const handleNavigation = (activeSubButtonGlobal: string | null) => {
  console.log("Hit handle navigation");
  if (activeSubButtonGlobal === "tasks") {
    userNavigationRef.dispatch(
      StackActions.push("AddTask", {
        params: {
          voiceInput: false,
          onRefresh: () => {},
        },
      }),
    );
  }
};

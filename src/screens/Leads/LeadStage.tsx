import ProjectHistory from "@/components/common/ProjectHistory";
import { setActiveSubButtonGlobal } from "@/store/slices/activeSubButtonGlobal";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
export const LeadStage = ({ route }: { route: any }) => {
  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
      dispatch(setActiveSubButtonGlobal("lead-stage"));
    }, []),
  );
  return <ProjectHistory route={route} />;
};

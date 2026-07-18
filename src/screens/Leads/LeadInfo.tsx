import ProjectInfo from "@/components/common/ProjectInfo";
import { center, fullHeight, fullWidth, xstack, ystack } from "@/design/layout";
import { spacing } from "@/design/spacing";
import { Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setActiveSubButtonGlobal } from "@/store/slices/activeSubButtonGlobal";
export const LeadInfo = ({ route }: { route: any }) => {
  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
      dispatch(setActiveSubButtonGlobal("lead-info"));
    }, []),
  );
  return <ProjectInfo route={route} />;
};

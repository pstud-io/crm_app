import ProjectInfo from "@/components/common/ProjectInfo";
import { center, fullHeight, fullWidth, xstack, ystack } from "@/design/layout";
import { spacing } from "@/design/spacing";
import { Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { setActiveSubButtonGlobal } from "@/store/slices/activeSubButtonGlobal";
import AddProject from "@/components/common/AddProject/AddProject";
import BottomSheet, { BottomSheetModal } from "@gorhom/bottom-sheet";
import EditProjectBottomSheet from "./components/EditProjectBottomSheet";
export const LeadInfo = ({ route }: { route: any }) => {
  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
      dispatch(setActiveSubButtonGlobal("lead-info"));
    }, []),
  );

  const editProjectRef = useRef<BottomSheetModal>(null);
  const editProjectDataRef = useRef<any>(null);
  const editProjectFunctions = {
    open: (data: { section: string; fields: any[]; allFields: any[] }) => {
      console.log("Hit edit project functions", data);
      editProjectDataRef.current = data;
      editProjectRef.current?.present();
    },
    close: () => {
      editProjectDataRef.current = null;
      editProjectRef.current?.dismiss();
    },
  };

  return (
    <>
      <ProjectInfo route={route} editProjectFunctions={editProjectFunctions} />
      <EditProjectBottomSheet
        onRefresh={() => {}}
        editProjectBottomSheetRef={editProjectRef}
        editProjectDataRef={editProjectDataRef}
        editProjectFunctions={editProjectFunctions}
      />
    </>
  );
};

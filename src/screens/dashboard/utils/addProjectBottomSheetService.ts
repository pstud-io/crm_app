import { createRef } from "react";
import BottomSheet, { BottomSheetModal } from "@gorhom/bottom-sheet";

export const addProjectBottomSheetRef = createRef<BottomSheetModal>();

export const openAddProjectBottomSheet = () => {
  console.log("In open add project bottom sheet");
  console.log("service current:", addProjectBottomSheetRef.current);
  addProjectBottomSheetRef.current?.present();
};

export const closeAddProjectBottomSheet = () => {
  addProjectBottomSheetRef.current?.dismiss();
};

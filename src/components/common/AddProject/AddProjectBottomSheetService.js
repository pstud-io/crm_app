// BottomSheetService.js
import { createRef } from "react";
import { Keyboard } from "react-native";

export const addProjectBottomSheetRef = createRef();

export const openAddProjectBottomSheet = async () => {
  console.log("In open add project bottom sheet");
  console.log("service current:", addProjectBottomSheetRef.current);
  await addProjectBottomSheetRef.current?.expand();
};

export const closeAddProjectBottomSheet = async () => {
  await addProjectBottomSheetRef.current?.close();
};

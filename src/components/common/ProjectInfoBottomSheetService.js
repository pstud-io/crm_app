// BottomSheetService.js
import { createRef } from "react";

export const projectInfoBottomSheetRef = createRef();

export const openProjectInfoBottomSheet = () => {
  projectInfoBottomSheetRef.current?.expand();
};

export const closeProjectInfoBottomSheet = () => {
  projectInfoBottomSheetRef.current?.close();
};

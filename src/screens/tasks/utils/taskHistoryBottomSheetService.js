// BottomSheetService.js
import { createRef } from "react";
import { Keyboard } from "react-native";

export const taskHistoryBottomSheetRef = createRef();
export const activeTaskHistory = createRef();

export const openTaskHistoryBottomSheet = (task) => {
  activeTaskHistory.current = task;
  taskHistoryBottomSheetRef.current?.present();
};

export const closeTaskHistoryBottomSheet = () => {
  Keyboard.dismiss();
  taskHistoryBottomSheetRef.current?.dismiss();
};

// BottomSheetService.js
import { createRef } from "react";
import { Keyboard } from "react-native";

export const overtimeBottomSheetRef = createRef();
export const dateRefForOvertime = createRef();

export const openOvertimeBottomSheet = () => {
  overtimeBottomSheetRef.current?.present();
};

export const closeOvertimeBottomSheet = () => {
  Keyboard.dismiss();
  overtimeBottomSheetRef.current?.dismiss();
};

// BottomSheetService.js
import { createRef } from "react";
import { Keyboard } from "react-native";

export const punchOutBottomSheetRef = createRef();
export const dateRefForRegularization = createRef();

export const openPunchOutBottomSheet = () => {
  punchOutBottomSheetRef.current?.present();
};

export const closePunchOutBottomSheet = () => {
  Keyboard.dismiss();
  punchOutBottomSheetRef.current?.dismiss();
};

export const regularizationBottomSheetRef = createRef();
export const regularizationDataRef = createRef();

export const openRegularizationBottomSheet = (data) => {
  regularizationDataRef.current = data;
  if (regularizationBottomSheetRef?.current) {
    regularizationBottomSheetRef.current.present();
  }
};

export const closeRegularizationBottomSheet = () => {
  Keyboard.dismiss();
  regularizationBottomSheetRef.current?.dismiss();
};

export const requestLeaveBottomSheetRef = createRef(null);

export const openRequestLeaveBottomSheet = () => {
  requestLeaveBottomSheetRef.current?.present();
};

export const closeRequestLeaveBottomSheet = () => {
  Keyboard.dismiss();
  requestLeaveBottomSheetRef.current?.dismiss();
};

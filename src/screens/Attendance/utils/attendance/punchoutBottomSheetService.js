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
export const openRegularizationBottomSheet = (item) => {
  console.log(item);
  dateRefForRegularization.current = item;
  regularizationDataRef.current = item;
  regularizationBottomSheetRef.current?.present();
};

export const closeRegularizationBottomSheet = () => {
  Keyboard.dismiss();
  regularizationBottomSheetRef.current?.dismiss();
};

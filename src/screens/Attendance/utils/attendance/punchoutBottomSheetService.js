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

export const punchInBottomSheetRef = createRef();
export const punchInBottomSheetExtraDataRef = createRef();
export const dateRefForRegularizationPunchIn = createRef();

export const openPunchInBottomSheet = (attendance_id) => {
  punchInBottomSheetExtraDataRef.current = attendance_id;
  console.log("before presenting", attendance_id);
  punchInBottomSheetRef.current?.present();
};

export const closePunchInBottomSheet = () => {
  Keyboard.dismiss();
  punchInBottomSheetRef.current?.dismiss();
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

// BottomSheetService.js
import { createRef } from "react";
import { Keyboard } from "react-native";

export const newCommentBottomSheetRef = createRef();

export const openNewCommentBottomSheet = () => {
  console.log("Run openNewCommentBottomSheet");
  newCommentBottomSheetRef.current?.present();
};

export const closeNewCommentBottomSheet = async () => {
  Keyboard.dismiss();
  await newCommentBottomSheetRef.current?.dismiss();
};

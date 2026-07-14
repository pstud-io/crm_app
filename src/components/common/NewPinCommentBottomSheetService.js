// BottomSheetService.js
import { createRef } from "react";
import { Keyboard } from "react-native";

export const openNewPinCommentBottomSheet = async (
  data,
  newPinCommentBottomSheetRef,
  urlRefForMedia,
) => {
  console.log("Run openNewPinCommentBottomSheet", data);
  urlRefForMedia.current = data;
  await newPinCommentBottomSheetRef.current?.present();
};

export const closeNewPinCommentBottomSheet = async (
  newPinCommentBottomSheetRef,
  urlRefForMedia,
) => {
  Keyboard.dismiss();
  urlRefForMedia.current = null;
  await newPinCommentBottomSheetRef.current?.dismiss();
};

// BottomSheetService.js
import { createRef } from "react";

export const projectInfoBottomSheetRef = createRef();

export const openProjectInfoBottomSheet = () => {
  projectInfoBottomSheetRef.current?.expand();
};

export const closeProjectInfoBottomSheet = () => {
  projectInfoBottomSheetRef.current?.close();
};

export const projectInfoAddressBottomSheetRef = createRef();

export const openProjectInfoAddressBottomSheet = () => {
  projectInfoAddressBottomSheetRef.current?.present();
};

export const closeProjectInfoAddressBottomSheet = () => {
  projectInfoAddressBottomSheetRef.current?.dismiss();
};

export const projectExtraInfoBottomSheetRef = createRef();

export const openProjectExtraInfoBottomSheet = () => {
  projectExtraInfoBottomSheetRef.current?.present();
};

export const closeProjectExtraInfoBottomSheet = () => {
  projectExtraInfoBottomSheetRef.current?.dismiss();
};

export const projectClientInfoBottomSheetRef = createRef();

export const openProjectClientInfoBottomSheet = () => {
  projectClientInfoBottomSheetRef.current?.present();
};

export const closeProjectClientInfoBottomSheet = () => {
  projectClientInfoBottomSheetRef.current?.dismiss();
};

export const projectOtherInfoBottomSheetRef = createRef();

export const openProjectOtherInfoBottomSheet = () => {
  projectOtherInfoBottomSheetRef.current?.present();
};

export const closeProjectOtherInfoBottomSheet = () => {
  projectOtherInfoBottomSheetRef.current?.dismiss();
};

export const projectDocumentsBottomSheetRef = createRef();

export const openProjectDocumentsBottomSheet = () => {
  projectDocumentsBottomSheetRef.current?.present();
};

export const closeProjectDocumentsBottomSheet = () => {
  projectDocumentsBottomSheetRef.current?.dismiss();
};

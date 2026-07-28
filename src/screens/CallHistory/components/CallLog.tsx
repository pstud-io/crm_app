import { useCallDetection } from "@/hooks/useCallDetection";
import { useEffect, useRef, useState } from "react";
import { NativeModules, PermissionsAndroid } from "react-native";
import Popover from "react-native-popover-view";
import CallLogPopover from "./CallLogPopover";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import CallLogBottomSheet from "./CallLogBottomSheet";

export const CallLog = () => {
  const [granted, setGranted] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const callLogPopoverRef = useRef<Popover | null>(null);
  const callLogBottomSheetRef = useRef<BottomSheetModal>(null);
  const openCallLogBottomSheet = () => {
    callLogBottomSheetRef.current?.present();
  };
  const closeCallLogBottomSheet = () => {
    callLogBottomSheetRef.current?.dismiss();
  };

  useEffect(() => {
    async function requestPermissions() {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
      ]);

      const granted =
        result[PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        result[PermissionsAndroid.PERMISSIONS.READ_CALL_LOG] ===
          PermissionsAndroid.RESULTS.GRANTED;

      console.log(result);

      setGranted(granted);
    }

    requestPermissions();
  }, []);

  useCallDetection(granted, openCallLogBottomSheet);
  console.log("NativeModules.CallDetectionManager");
  console.log(NativeModules.CallDetectionManager);
  console.log("Android module");
  console.log(NativeModules.CallDetectionManagerAndroid);
  return (
    <BottomSheetModalProvider>
      <CallLogPopover
        showPopover={showPopover}
        setShowPopover={setShowPopover}
        callLogPopoverRef={callLogPopoverRef}
        openCallLogBottomSheet={openCallLogBottomSheet}
      />
      <CallLogBottomSheet
        callLogBottomSheetRef={callLogBottomSheetRef}
        closeCallLogBottomSheet={closeCallLogBottomSheet}
      />
    </BottomSheetModalProvider>
  );
};

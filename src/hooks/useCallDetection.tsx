import { setCallHistory } from "@/store/slices/callHistorySlice";
import { RootState } from "@/store/store";
import { universalPopoverRef } from "@/utils/universalPopover";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { AppState, Platform } from "react-native";
import CallDetectorManager from "react-native-call-detection";
import { useDispatch, useSelector } from "react-redux";
import * as Sentry from "@sentry/react-native";

export function useCallDetection(
  enabled: boolean,
  openCallLogBottomSheet: () => void,
) {
  const connectedAt = useRef<number | null>(null);
  const detector = useRef<InstanceType<typeof CallDetectorManager> | null>(
    null,
  );

  const dispatch = useDispatch();

  const callHistory = useSelector((state: RootState) => state.callHistory);

  const callHistoryRef = useRef(callHistory);

  const getiOSDuration = () => {
    const duration =
      connectedAt.current == null
        ? 0
        : Math.floor((Date.now() - connectedAt.current) / 1000);
    connectedAt.current = null;
    return duration;
  };

  useEffect(() => {
    callHistoryRef.current = callHistory;
  }, [callHistory]);

  useEffect(() => {
    if (!enabled && Platform.OS === "android") return;
    console.log("[Hook] Before new CallDetection");

    detector.current = new CallDetectorManager(
      (event, phoneNumber, duration, answered) => {
        switch (event) {
          case "Dialing":
            console.log("Dailing");
            dispatch(
              setCallHistory({
                ...callHistoryRef.current,
                contacted_on: new Date().toISOString(),
              }),
            );
            break;

          case "Connected":
            console.log("Connected");
            connectedAt.current = Date.now();
            break;

          case "Disconnected":
            console.log("Disconnected");
            const iOSDuration = getiOSDuration();
            const finalDuration =
              Platform.OS === "android" ? duration : iOSDuration;
            const timeOutSeconds = Platform.OS === "android" ? 500 : 250;

            dispatch(
              setCallHistory({
                ...callHistoryRef.current,
                duration: finalDuration,
              }),
            );

            // setShowPopover(true);
            setTimeout(() => {
              openCallLogBottomSheet();
            }, timeOutSeconds);

            break;

          case "Incoming":
            console.log("Incoming");
            break;

          case "Offhook":
            console.log("Offhook");
            dispatch(
              setCallHistory({
                ...callHistoryRef.current,
                contacted_on: new Date().toISOString(),
              }),
            );
            break;

          case "Missed":
            console.log("Missed");
            break;
        }
      },
      false,
    );

    console.log("[Hook] After new CallDetectionr");

    return () => {
      detector.current?.dispose();
    };
  }, [enabled]);
}

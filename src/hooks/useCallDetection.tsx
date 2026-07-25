import { useCallHistory } from "@/screens/CallHistory/hooks/useCallHistory";
import { setCallHistory } from "@/store/slices/callHistorySlice";
import { RootState } from "@/store/store";
import { universalPopoverRef } from "@/utils/universalPopover";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Platform } from "react-native";
import CallDetectorManager from "react-native-call-detection";
import { useDispatch, useSelector } from "react-redux";

export function useCallDetection(
  enabled: boolean,
  setShowPopover: Dispatch<SetStateAction<boolean>>,
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
        console.log("Call Event:", event, phoneNumber, duration, answered);

        switch (event) {
          case "Dialing":
            console.log("Dialing");
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
            console.log("Answered:", answered);
            console.log("Duration:", duration, iOSDuration);
            console.log("The ref is", universalPopoverRef.current);
            const finalDuration =
              Platform.OS === "android" ? duration : iOSDuration;
            console.log(
              "Call history before dispatch ",
              callHistoryRef.current,
            );
            dispatch(
              setCallHistory({
                ...callHistoryRef.current,
                duration: finalDuration,
              }),
            );
            setShowPopover(true);
            break;

          case "Incoming":
            console.log("Incoming");
            break;

          case "Offhook":
            console.log("Offhook");
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

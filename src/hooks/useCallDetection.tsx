import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import CallDetectorManager from "react-native-call-detection";

export function useCallDetection(enabled: boolean) {
  const detector = useRef<InstanceType<typeof CallDetectorManager> | null>(
    null,
  );
  useEffect(() => {
    if (!enabled && Platform.OS === "android") return;
    // detector.current = new CallDetectorManager(() => {}, false);

    detector.current = new CallDetectorManager(
      (event, phoneNumber, duration, answered) => {
        console.log("Call Event:", event, phoneNumber, duration, answered);

        switch (event) {
          case "Dialing":
            console.log("Dialing");
            break;

          case "Connected":
            console.log("Connected");
            break;

          case "Disconnected":
            console.log("Disconnected");
            console.log("Answered:", answered);
            console.log("Duration:", duration);
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

    return () => {
      detector.current?.dispose();
    };
  }, [enabled]);
}

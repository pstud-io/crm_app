import { SH } from "../utils";
import useKeyboardStatus from "./useKeyboardStatus";
import { Platform } from "react-native";
export const useResovleSheetHeight = () => {
  const isKeyboardActive = useKeyboardStatus();
  const resolveHeight = () => {
    if (Platform.OS === "android") {
      if (isKeyboardActive) {
        return SH(36);
      } else {
        return SH(0);
      }
    } else {
      return SH(0);
    }
  };
  return { resolveHeight };
};

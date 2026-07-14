import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";

const showEvent =
  Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";

const hideEvent =
  Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

const useKeyboardStatus = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(showEvent, () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return keyboardVisible;
};

export default useKeyboardStatus;

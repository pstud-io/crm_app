import { useEffect, useRef, useState } from "react";
import { Keyboard, Platform, Animated } from "react-native";

export const useHideOnKeyboardShow = () => {
  const [isHidden, setIsHidden] = useState(false);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (Platform.OS !== "ios") return;

    const showSub = Keyboard.addListener("keyboardWillShow", () => {
      setIsHidden(true);
      opacity.setValue(0);
    });

    const hideSub = Keyboard.addListener("keyboardWillHide", () => {
      // setTimeout(() => {
      setIsHidden(false);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      // }, 100);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return {
    isHidden, // logical visibility
    animatedStyle: { opacity }, // animated style for fade-in
  };
};

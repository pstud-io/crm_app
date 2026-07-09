import { useForm, Controller } from "react-hook-form";
import {
  Image,
  Keyboard,
  KeyboardEvent,
  KeyboardEventName,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import {
  SignInFormSchemaPassword,
  SignInFormTypePassword,
} from "./types/signinTypes";
import { useSignInEndpoints } from "./hooks/useSignInEndpoints";
import {
  bottomCenter,
  center,
  fullSize,
  fullWidth,
  noPadding,
  topCenter,
  ystack,
} from "@/design/layout";
import images from "@/images";
import { spacing } from "@/design/spacing";
import { useEffect, useState } from "react";
import { body, heading } from "@/design/typography";
import { borderRadius } from "@/design/borders";
import { StatusBar } from "expo-status-bar";
import { Button } from "@/components/Button";
import { OTPForm } from "./components/OTPForm";
import { PasswordForm } from "./components/PasswordForm";
export const SignIn = () => {
  console.count("SignIn render");
  const { theme, isDark } = useTheme();
  const cardHeight = useSharedValue<number>(80);
  const radius = useSharedValue<number>(borderRadius.extreme);
  const [authModeOTP, setAuthModeOTP] = useState<boolean>(true);

  useEffect(() => {
    const keyboardShow: KeyboardEventName =
      Platform.OS == "android" ? "keyboardDidShow" : "keyboardWillShow";
    const keyboardHide: KeyboardEventName =
      Platform.OS == "android" ? "keyboardDidHide" : "keyboardWillHide";

    const show = Keyboard.addListener(keyboardShow, (e) => {
      console.log("Keyboard shown");
      cardHeight.value = withTiming(100, {
        duration: Platform.OS === "android" ? 300 : 400,
      });
      radius.value = withTiming(0);
    });

    const hide = Keyboard.addListener(keyboardHide, () => {
      cardHeight.value = withTiming(80);
      radius.value = withTiming(borderRadius.extreme);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    height: `${cardHeight.value}%`,
    borderTopLeftRadius: radius.value,
  }));

  return (
    <>
      <Pressable
        id="signin"
        onPress={() => Keyboard.dismiss()}
        style={[
          ystack,
          fullSize,
          bottomCenter,
          { gap: spacing.lg, backgroundColor: theme.backgroundInverse },
        ]}
      >
        {/* <Image source={images.logo} resizeMode="contain" style={styles.logo} /> */}

        <Animated.View
          id="signin"
          style={[
            ystack,
            fullWidth,
            topCenter,
            animatedStyle,
            {
              backgroundColor: theme.background,
              paddingHorizontal: spacing.max,
              gap: spacing.xl,
            },
          ]}
        >
          <Text
            style={[
              heading.sm.semiBold,
              {
                color: theme.text,
                paddingTop: spacing.max,
                paddingBottom: spacing.lg,
              },
            ]}
          >
            Login
          </Text>
          {authModeOTP && <OTPForm />}
          {!authModeOTP && <PasswordForm />}

          <Button
            label={authModeOTP ? "Login using Password" : "Login using OTP"}
            loading={false}
            onPress={() => setAuthModeOTP(!authModeOTP)}
            style={{ ...fullWidth }}
            themeInverse
          />
        </Animated.View>
        <StatusBar style={isDark ? "light" : "dark"} />
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  logo: { height: 45, width: 200, marginBottom: 20 },
  textInput: {
    fontFamily: "Inter-Medium",
    fontSize: 15,
    includeFontPadding: false,
    color: "#000fff",
    paddingLeft: 4,
    backgroundColor: "#fff000",
  },
});

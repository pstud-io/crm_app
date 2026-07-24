import {
  Image,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useDispatch } from "react-redux";

import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
} from "react-native-keyboard-controller";

import { useTheme } from "@/hooks/useTheme";
import images from "@/images";
import { spacing } from "@/design/spacing";
import { body } from "@/design/typography";
import { borderRadius } from "@/design/borders";
import {
  bottomCenter,
  fullSize,
  fullWidth,
  topCenter,
  ystack,
} from "@/design/layout";
import { Button } from "@/components/Button";
import { OTPForm } from "./components/OTPForm";
import { PasswordForm } from "./components/PasswordForm";
import { setActiveSubButtonGlobal } from "@/store/slices/activeSubButtonGlobal";
import { View } from "react-native";

export const SignIn = () => {
  const { theme, isDark } = useTheme();

  const dispatch = useDispatch();

  const [authModeOTP, setAuthModeOTP] = useState(true);

  const cardHeight = useSharedValue(100);
  const radius = useSharedValue(borderRadius.none);

  const animatedStyle = useAnimatedStyle(() => ({
    height: `${cardHeight.value}%`,
    borderTopLeftRadius: radius.value,
  }));

  useFocusEffect(
    useCallback(() => {
      dispatch(setActiveSubButtonGlobal("auth"));
    }, []),
  );

  return (
    <>
      <Pressable
        style={[
          ystack,
          fullSize,
          bottomCenter,
          {
            backgroundColor: theme.backgroundInverse,
          },
        ]}
        onPress={Keyboard.dismiss}
      >
        <Animated.View
          style={[
            fullWidth,
            animatedStyle,
            {
              backgroundColor: theme.background,
            },
          ]}
        >
          <KeyboardAwareScrollView
            bottomOffset={24}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: spacing.max,
              paddingVertical: spacing.max,
              // paddingTop: 40,
              gap: 16,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Image
                source={images.logo}
                resizeMode="contain"
                style={styles.logo}
              />

              <Text
                style={[
                  styles.welcomeTitle,
                  {
                    ...body.xxl.semiBold,
                  },
                ]}
              >
                Welcome Back
              </Text>

              <Text
                style={[
                  styles.subText,
                  {
                    ...body.md.regular,
                  },
                ]}
              >
                {authModeOTP
                  ? "Enter your phone number to share OTP"
                  : "Enter your phone number & password to access your account"}
              </Text>
            </View>

            {authModeOTP ? <OTPForm /> : <PasswordForm />}

            <Button
              label={authModeOTP ? "Login using Password" : "Login using OTP"}
              themeInverse
              style={fullWidth}
              onPress={() => setAuthModeOTP((v) => !v)}
              loading={false}
            />
          </KeyboardAwareScrollView>
        </Animated.View>

        <StatusBar style={isDark ? "light" : "dark"} />
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 200,
    height: 45,
    marginBottom: 16,
  },

  welcomeTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: "#000",
    includeFontPadding: false,
    marginBottom: 12,
  },

  subText: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    includeFontPadding: false,
    // marginBottom: 24,
  },
});

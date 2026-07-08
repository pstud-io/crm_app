import { useForm, Controller } from "react-hook-form";
import {
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { SignInFormSchema, SignInFormType } from "./types/signinTypes";
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
import { useState } from "react";
import { body, heading } from "@/design/typography";
import { borderRadius } from "@/design/borders";
import { StatusBar } from "expo-status-bar";
import { Button } from "@/components/Button";
export const SignIn = () => {
  const { theme, isDark } = useTheme();
  const { setRole } = useAuth();
  const { signingIn, onSubmitSignIn } = useSignInEndpoints();
  const [authMode, setAuthMode] = useState<"otp" | "password">("otp");
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormType>({
    resolver: zodResolver(SignInFormSchema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      password: "",
    },
  });

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

        <Pressable
          id="signin"
          onPress={() => Keyboard.dismiss()}
          style={[
            ystack,
            fullWidth,
            topCenter,
            {
              backgroundColor: theme.background,
              height: "80%",
              borderTopLeftRadius: borderRadius.extreme,
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
          <View
            style={[
              ystack,
              fullWidth,
              {
                backgroundColor: theme.header,
                padding: spacing.md,
                borderRadius: borderRadius.lg,
                gap: spacing.sm,
                boxShadow: theme.shadow.xs,
              },
            ]}
          >
            <Text style={[body.sm.regular, { color: theme.text }]}>
              Phone Number
            </Text>
            <Controller
              control={control}
              rules={{
                maxLength: 100,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  onChangeText={onChange}
                  value={value}
                  placeholder="9999999999"
                  style={[body.sm.regular, noPadding]}
                  placeholderTextColor={theme.placeholderText}
                  onBlur={onBlur}
                />
              )}
              name="username"
            />
            {errors.username && (
              <Text style={[body.xs.regular, { color: theme.error }]}>
                {errors.username.message}
              </Text>
            )}
          </View>
          <View
            style={[
              ystack,
              fullWidth,
              {
                backgroundColor: theme.header,
                padding: spacing.md,
                borderRadius: borderRadius.lg,
                gap: spacing.sm,
                boxShadow: theme.shadow.xs,
              },
            ]}
          >
            <Text style={[body.sm.regular, { color: theme.text }]}>
              Password
            </Text>
            <Controller
              control={control}
              rules={{
                required: true,
                minLength: 8,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  onChangeText={onChange}
                  value={value}
                  placeholder="********"
                  onBlur={onBlur}
                  style={[body.sm.regular, noPadding]}
                  placeholderTextColor={theme.placeholderText}
                />
              )}
              name="password"
            />
            {errors.password && (
              <Text style={[body.xs.regular, { color: theme.error }]}>
                {errors.password.message}
              </Text>
            )}
          </View>
          <View
            style={[
              ystack,
              fullWidth,
              center,
              { gap: spacing.lg, paddingVertical: spacing.lg },
            ]}
          >
            <Button
              label={signingIn ? "Signing In..." : "Login"}
              loading={signingIn}
              onPress={handleSubmit(async (data: SignInFormType) => {
                await onSubmitSignIn(data, setRole);
              })}
              style={{ ...fullWidth }}
            />
            <Text style={[body.xs.regular, { color: theme.text }]}>or</Text>
            <Button
              label={
                authMode === "password" ? "Login using " : "Login using OTP"
              }
              loading={false}
              onPress={() => {}}
              style={{ ...fullWidth }}
              themeInverse
            />
          </View>
        </Pressable>
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

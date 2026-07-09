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
import {
  SignInFormSchemaPassword,
  SignInFormTypePassword,
} from "../types/signinTypes";
import { useSignInEndpoints } from "../hooks/useSignInEndpoints";
export const PasswordForm = () => {
  console.count("SignIn render");
  const { theme, isDark } = useTheme();
  const { setRole } = useAuth();
  const { signingIn, onSubmitSignIn } = useSignInEndpoints();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormTypePassword>({
    resolver: zodResolver(SignInFormSchemaPassword),
    mode: "onBlur",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <>
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
              style={[body.sm.regular, noPadding, { color: theme.text }]}
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
        <Text style={[body.sm.regular, { color: theme.text }]}>Password</Text>
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
              style={[body.sm.regular, noPadding, { color: theme.text }]}
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
      <View style={[ystack, fullWidth, center, { gap: spacing.lg }]}>
        <Button
          label={signingIn ? "Signing In..." : "Login"}
          loading={signingIn}
          onPress={handleSubmit(async (data: SignInFormTypePassword) => {
            await onSubmitSignIn(data, setRole);
          })}
          style={{ ...fullWidth }}
        />
        <Text style={[body.xs.regular, { color: theme.text }]}>or</Text>
      </View>
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

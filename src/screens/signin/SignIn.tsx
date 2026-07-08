import { useForm, Controller } from "react-hook-form";
import { Button, Image, StyleSheet, Text, TextInput, View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { SignInFormSchema, SignInFormType } from "./types/signinTypes";
import { useSignInEndpoints } from "./hooks/useSignInEndpoints";
import {
  center,
  fullSize,
  fullWidth,
  topCenter,
  ystack,
} from "@/design/layout";
import images from "@/images";
import { spacing } from "@/design/spacing";
import { useState } from "react";
import { body } from "@/design/typography";
export const SignIn = () => {
  const { theme } = useTheme();
  const { setRole } = useAuth();
  const { loading, onSubmitSignIn } = useSignInEndpoints();
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
      <View
        id="signin"
        style={[
          ystack,
          fullSize,
          topCenter,
          { paddingTop: spacing.max, gap: 16 },
        ]}
      >
        <Image source={images.logo} resizeMode="contain" style={styles.logo} />
        <View
          id="signin"
          style={[
            ystack,
            fullWidth,
            topCenter,
            { gap: 8, backgroundColor: "#fff000" },
          ]}
        >
          <Text style={[body.xxl.semiBold]}>Welcome Back</Text>
          <Text style={[body.md.regular]}>
            {authMode === "password"
              ? "Enter your phone number & password to access your account"
              : "Enter your phone number to share OTP"}
          </Text>
        </View>
        <Controller
          control={control}
          rules={{
            maxLength: 100,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onChangeText={onChange}
              value={value}
              placeholder="User ID"
              onBlur={onBlur}
              placeholderTextColor={theme.text}
            />
          )}
          name="username"
        />
        {errors.username && (
          <Text style={{ color: "red", fontSize: 12 }}>
            {errors.username.message}
          </Text>
        )}
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
              placeholder="Password"
              onBlur={onBlur}
              placeholderTextColor={theme.text}
            />
          )}
          name="password"
        />
        {errors.password && (
          <Text style={{ color: "red", fontSize: 12 }}>
            {errors.password.message}
          </Text>
        )}
        <Button
          title={loading ? "Signing In..." : "Login"}
          disabled={loading}
          onPress={handleSubmit(async (data: SignInFormType) => {
            await onSubmitSignIn(data, setRole);
          })}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  logo: { height: 45, width: 200, marginBottom: 20 },
});

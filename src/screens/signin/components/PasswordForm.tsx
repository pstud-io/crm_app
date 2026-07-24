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
import { Colors, SF, SH, SW } from "@/utils";
import { PasswordOutlineIcon, UserOutline } from "@/svg";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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

  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <>
      <View style={{ width: "100%" }}>
        <View>
          <Text style={[styles.label, { ...body.sm.regular }]}>
            Phone Number *
          </Text>

          <View style={styles.inputWrapper}>
            <>
              <UserOutline
                fill={Colors.gray_text_color}
                width={SH(20)}
                height={SH(20)}
                style={{}}
              />
              <View style={styles.verticalDivider} />
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
                    // style={[body.sm.regular, noPadding, { color: theme.text }]}
                    style={[styles.textInput, { ...body.md.regular }]}
                    placeholderTextColor={theme.placeholderText}
                    onBlur={onBlur}
                  />
                )}
                name="username"
              />
              {/* {errors.username && (
                <Text style={[body.xs.regular, { color: theme.error }]}>
                  {errors.username.message}
                </Text>
              )} */}
              {/* {otpSent && (
            <MaterialCommunityIcons
              name="close-circle"
              size={SH(20)}
              color={Colors.gray_text_color}
              onPress={() => {
                setOtpSent(false);
                setOtp(["", "", "", ""]);
                setTimer(60);
              }}
            />
          )} */}
            </>
          </View>
        </View>
        {/* <View
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
              // style={[body.sm.regular, noPadding, { color: theme.text }]}
              style={[styles.textInput, { ...body.md.regular }]}
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
      </View> */}
        <View>
          <Text style={[styles.label, { ...body.sm.regular }]}>Password *</Text>
          <View style={styles.inputWrapper}>
            <PasswordOutlineIcon
              width={SH(20)}
              height={SH(20)}
              fill={Colors.gray_text_color}
            />
            <View style={styles.verticalDivider} />
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
                  secureTextEntry={!passwordVisible}
                  onBlur={onBlur}
                  style={[styles.textInput, { ...body.md.regular }]}
                  placeholderTextColor={theme.placeholderText}
                />
              )}
              name="password"
            />
            {/* {errors.password && (
              <Text style={[body.xs.regular, { color: theme.error }]}>
                {errors.password.message}
              </Text>
            )} */}
            <MaterialCommunityIcons
              name={passwordVisible ? "eye" : "eye-off"}
              size={SH(20)}
              color={Colors.gray_text_color}
              onPress={() => setPasswordVisible(!passwordVisible)}
            />
          </View>

          {/* <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={[styles.forgotText, { ...body.sm.regular }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity> */}
        </View>
        {/* <View
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
      </View> */}
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
  container: { paddingHorizontal: SW(20), flexGrow: 1, alignItems: "center" },
  logo: { height: SH(45), width: SW(200), marginBottom: SH(20) },
  welcomeTitle: {
    fontFamily: "Inter-Bold",
    fontSize: SF(24),
    color: "#000",
    includeFontPadding: false,
  },
  subTextContainer: {
    height: SH(44),
    justifyContent: "center",
    marginTop: SH(8),
  },
  subText: {
    fontFamily: "Inter-Regular",
    fontSize: SF(13),
    color: "#666",
    textAlign: "center",
    includeFontPadding: false,
  },
  label: {
    alignSelf: "flex-start",
    fontFamily: "Inter-SemiBold",
    fontSize: SF(14),
    marginTop: SH(24),
    marginBottom: SH(8),
    includeFontPadding: false,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: SH(48),
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 8,
    paddingHorizontal: SW(14),
    backgroundColor: "#fcfcfc",
  },
  countryCode: {
    fontFamily: "Inter-Medium",
    marginLeft: SW(10),
    marginRight: SW(4),
    fontSize: SF(15),
    includeFontPadding: false,
    color: "#000",
  },
  verticalDivider: {
    width: 1,
    height: SH(20),
    backgroundColor: "#D0D5DD",
    marginHorizontal: SW(8),
  },
  textInput: {
    flex: 1,
    fontFamily: "Inter-Medium",
    fontSize: SF(15),
    includeFontPadding: false,
    color: "#000",
    paddingLeft: SW(4),
  },
  forgotBtn: { alignSelf: "flex-end", marginTop: SH(12) },
  forgotText: {
    color: "#666",
    fontSize: SF(13),
    includeFontPadding: false,
    fontFamily: "Inter-Medium",
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    gap: SW(10),
  },
  otpInput: {
    width: SH(48),
    height: SH(48),
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: SW(6),
    textAlign: "center",
    fontSize: SF(20),
    backgroundColor: "#fcfcfc",
    fontFamily: "Inter-Bold",
    includeFontPadding: false,
  },
  timerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
  },
  timerText: { color: "#666", fontSize: SF(12), includeFontPadding: false },
  timerValue: {
    color: Colors.primary,
    fontFamily: "Inter-SemiBold",
    includeFontPadding: false,
  },
  resendActive: {
    color: Colors.primary,
    fontFamily: "Inter-Bold",
    textDecorationLine: "underline",
    includeFontPadding: false,
  },
  buttonFullWidth: { width: "100%" },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SH(24),
  },
  line: { flex: 1, height: 1, backgroundColor: "#EAECF0" },
  orText: {
    marginHorizontal: 10,
    color: "#98A2B3",
    fontSize: SF(12),
    includeFontPadding: false,
  },
  secondaryBtn: {
    width: "100%",
    height: SH(44),
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryBtnText: {
    color: Colors.primary,
    fontFamily: "Inter-SemiBold",
    fontSize: SF(15),
    includeFontPadding: false,
  },
});

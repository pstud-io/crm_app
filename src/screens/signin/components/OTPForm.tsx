import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useSignInEndpoints } from "../hooks/useSignInEndpoints";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import PhoneInput, { ICountry } from "rn-international-phone-number";
import { Controller, useForm } from "react-hook-form";
import {
  OTPType,
  SignInFormSchemaOTP,
  SignInFormTypeOTP,
} from "../types/signinTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Keyboard,
  KeyboardEventName,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { center, fullWidth, noPadding, ystack } from "@/design/layout";
import { spacing } from "@/design/spacing";
import { borderRadius, borderWidth } from "@/design/borders";
import { body } from "@/design/typography";
import { Button } from "@/components/Button";
import { removeSpaces } from "../utils/signInFunctions";
import { secondaryColors } from "@/design/colors";

export const OTPForm = () => {
  console.count("SignIn render");
  const { theme, isDark } = useTheme();
  const { setRole } = useAuth();
  const { signingIn, onSubmitSignIn, sendOTP, sendingOTP } =
    useSignInEndpoints();
  const [country, setCountry] = useState<ICountry | null>(null);
  const [otpSent, setOTPSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<OTPType>(["", "", "", ""]);
  const otpInputs = useRef<Array<TextInput | null>>([]);
  const [timer, setTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    getValues,
    trigger,
    watch,
    formState: { errors },
  } = useForm<SignInFormTypeOTP>({
    resolver: zodResolver(SignInFormSchemaOTP),
    mode: "onBlur",
    defaultValues: {
      username: "",
      otp: "",
    },
  });

  const otpValue = watch("otp");

  useEffect(() => {
    if (!otpSent || timer <= 0) {
      if (timer === 0) setCanResend(true);
      return;
    }

    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [otpSent, timer]);

  useEffect(() => {
    if (!otpSent || otpValue.length !== 4 || signingIn) return;

    const submit = async () => {
      await onSubmitSignIn(
        {
          username: removeSpaces(getValues("username")),
          otp: otpValue,
        },
        setRole,
      );
    };

    submit();
  }, [otpValue, signingIn]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      const otpArray: OTPType = [
        value[0] ?? "",
        value[1] ?? "",
        value[2] ?? "",
        value[3] ?? "",
      ];
      setOtp(otpArray);

      // SAFE FOCUS
      setTimeout(() => {
        otpInputs.current?.[3]?.focus?.();
      }, 0);

      return;
    }

    const newOtp: OTPType = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      otpInputs.current?.[index + 1]?.focus?.();
    }
  };

  const handleResend = () => {
    setTimer(60);
    setCanResend(false);
    sendOTP(removeSpaces(getValues("username")), setOTPSent);
  };

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
            <PhoneInput
              value={value}
              onChangePhoneNumber={onChange}
              onBlur={onBlur}
              country={country}
              onChangeCountry={setCountry}
              placeholder="9999999999"
              placeholderTextColor={theme.placeholderText}
              style={[
                body.sm.regular,
                noPadding,
                { color: theme.text, backgroundColor: theme.background },
              ]}
              modalType="popup"
              maxLength={11}
              defaultCountry="IN"
              phoneInputStyles={{
                callingCode: { ...body.md.medium, color: theme.text },
                divider: {
                  height: 16,
                },
                flag: {
                  fontSize: 16,
                },
                caret: {
                  fontSize: 8,
                },
                input: {
                  color: theme.text,
                },
                flagContainer: {
                  padding: 0,
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  backgroundColor: theme.background,
                },
                container: {
                  height: 44,
                  borderColor: theme.border,
                  borderWidth: 1,
                  backgroundColor: theme.background,
                  borderRadius: borderRadius.md,
                  overflow: "hidden",
                },
              }}
              modalStyles={{
                flag: {
                  fontSize: 16,
                },
                callingCode: {
                  ...body.sm.medium,
                  color: theme.text,
                  width: 50,
                  flex: 0,
                },
                countryName: {
                  ...body.sm.medium,
                  color: theme.text,
                  flex: 0,
                },
                countryItem: {
                  gap: 8,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  padding: 10,
                  borderWidth: borderWidth.hw,
                  borderColor: theme.border,
                },
                countryInfo: {
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                },
                searchInput: {
                  ...body.sm.medium,
                  color: theme.text,
                  padding: 0,
                  margin: 0,
                  borderWidth: borderWidth.hw,
                  borderColor: theme.border,
                },
              }}
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
      {otpSent && (
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
            Enter OTP
          </Text>
          <Controller
            control={control}
            name="otp"
            render={({ field: { value = "", onChange } }) => {
              const otp = [
                value[0] ?? "",
                value[1] ?? "",
                value[2] ?? "",
                value[3] ?? "",
              ];

              const handleOtpChange = (text: string, index: number) => {
                let newOtp = [...otp];

                if (text.length > 1) {
                  newOtp = [
                    text[0] ?? "",
                    text[1] ?? "",
                    text[2] ?? "",
                    text[3] ?? "",
                  ];

                  onChange(newOtp.join(""));

                  setTimeout(() => {
                    otpInputs.current[3]?.focus();
                  }, 0);

                  return;
                }

                newOtp[index] = text;
                onChange(newOtp.join(""));

                if (text && index < 3) {
                  otpInputs.current[index + 1]?.focus();
                }
              };

              return (
                <View style={styles.otpRow}>
                  {otp.map((digit, i) => (
                    <TextInput
                      key={i}
                      ref={(el) => {
                        otpInputs.current[i] = el;
                      }}
                      style={[
                        styles.otpInput,
                        body.md.regular,
                        { color: theme.text },
                      ]}
                      keyboardType="number-pad"
                      maxLength={i === 0 ? 4 : 1}
                      value={digit}
                      onChangeText={(text) => handleOtpChange(text, i)}
                      textContentType="oneTimeCode"
                      autoComplete={
                        Platform.OS === "android" ? "sms-otp" : "one-time-code"
                      }
                      onKeyPress={({ nativeEvent }) => {
                        if (nativeEvent.key === "Backspace") {
                          const newOtp = [...otp];

                          if (otp[i]) {
                            newOtp[i] = "";
                          } else if (i > 0) {
                            newOtp[i - 1] = "";
                            otpInputs.current[i - 1]?.focus();
                          }

                          onChange(newOtp.join(""));
                        }
                      }}
                    />
                  ))}
                </View>
              );
            }}
          />
          <View style={styles.timerRow}>
            <Text style={[styles.timerText, { ...body.sm.regular }]}>
              OTP sent successfully
            </Text>
            {canResend ? (
              <Pressable onPress={handleResend}>
                <Text style={[styles.resendActive, { ...body.sm.regular }]}>
                  Resend OTP
                </Text>
              </Pressable>
            ) : (
              <Text style={[styles.timerValue, { ...body.sm.regular }]}>
                {timer} seconds
              </Text>
            )}
          </View>
          {errors.otp && (
            <Text style={[body.xs.regular, { color: theme.error }]}>
              {errors.otp.message}
            </Text>
          )}
        </View>
      )}
      <View style={[ystack, fullWidth, center, { gap: spacing.lg }]}>
        <Button
          label={
            !otpSent
              ? "Send OTP"
              : sendingOTP
                ? "Sending OTP..."
                : signingIn
                  ? "Signing In..."
                  : "Submit OTP"
          }
          loading={signingIn || sendingOTP}
          onPress={async () => {
            if (!otpSent) {
              const valid = await trigger("username");
              if (valid)
                await sendOTP(removeSpaces(getValues("username")), setOTPSent);
              return;
            }
            if (otpSent) {
              handleSubmit(async (data) => {
                await onSubmitSignIn(data, setRole);
              })();
            }
          }}
          style={{ ...fullWidth }}
        />
        <Text style={[body.xs.regular, { color: theme.text }]}>or</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  logo: { height: 45, width: 200, marginBottom: 20 },

  otpRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    gap: 10,
  },
  otpInput: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 20,
    backgroundColor: "#fcfcfc",
    fontFamily: "Inter-Bold",
    includeFontPadding: false,
  },
  timerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  timerText: { color: "#666", fontSize: 12, includeFontPadding: false },
  timerValue: {
    color: secondaryColors.gray[500],
    fontFamily: "Inter-SemiBold",
    includeFontPadding: false,
  },
  resendActive: {
    color: secondaryColors.gray[500],
    ...body.xxs.regular,
    textDecorationLine: "underline",
    includeFontPadding: false,
  },
});

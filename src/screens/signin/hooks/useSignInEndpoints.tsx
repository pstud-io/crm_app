import { Dispatch, SetStateAction, useState } from "react";
import { signIn } from "../utils/signInEndpoints";
import {
  SignInFormTypeOTP,
  SignInFormTypePassword,
} from "../types/signinTypes";
import { Role } from "@/types/AuthTypes";
import { storeToken } from "@/utils/authFunctions";
import { apiEndpoint } from "@/api/client";
import axios from "axios";
import Toast from "react-native-toast-message";
export const useSignInEndpoints = () => {
  const [signingIn, setSigningIn] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const onSubmitSignIn = async (
    data: SignInFormTypeOTP | SignInFormTypePassword,
    setRole: Dispatch<SetStateAction<Role>>,
  ) => {
    console.log("Data auth", data);
    setSigningIn(true);
    try {
      const response = await signIn(data);
      await storeToken(response.data.result.token);
      setRole(Role.USER);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Sign-in error:", error.message);
      } else {
        console.error("Sign-in error:", error);
      }
    } finally {
      setSigningIn(false);
    }
  };

  const sendOTP = async (
    username: string,
    setOtpSent: Dispatch<SetStateAction<boolean>>,
  ) => {
    setSendingOTP(true);
    try {
      const response = await axios.post(`${apiEndpoint}/auth/send-otp/`, {
        username,
      });
      if (response.status >= 200 && response.status < 300) {
        setOtpSent(true);
        Toast.show({
          type: "success",
          text1: "OTP Sent",
          text2: "Please check your mobile device",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "OTP Failed",
        text2:
          error?.response?.data?.message ||
          "Unable to send OTP. Please try again.",
      });
    } finally {
      setSendingOTP(false);
    }
  };

  return { signingIn, onSubmitSignIn, sendOTP, sendingOTP };
};

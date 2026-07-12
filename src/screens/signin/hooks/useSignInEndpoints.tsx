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
import { useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import { useGeneralEndpoints } from "@/hooks/useGeneralEndpoints";
import { saveProfile } from "@/store/slices/profileSlice";
import { saveToken } from "@/store/slices/authSlice";

export const useSignInEndpoints = () => {
  const [signingIn, setSigningIn] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const dispatch = useDispatch();
  const { getOrganizationPermissions, getOrganizationDetails, getProjects } =
    useGeneralEndpoints();

  const handleAuthSuccess = async (result: any) => {
    const {
      token,
      organization_id,
      permissions,
      is_admin,
      name,
      phone,
      organization_contact_id,
      organization_details,
      fk_user_role,
    } = result;
    console.log("Result of login", result);
    const logo_url = organization_details?.asset_details?.url;

    if (permissions) {
      console.log("In permissions");
      saveToken(token, dispatch);
      saveProfile(
        {
          name,
          phone,
          organization_contact_id,
          organization_id,
          logo_url,
          is_admin,
          organization_details,
          fk_user_role,
        },
        dispatch,
      );
      await getProjects([], () => {}, 1, true, "", 1);
      return true;
    }
    return false;
  };

  const onSubmitSignIn = async (
    data: SignInFormTypeOTP | SignInFormTypePassword,
    setRole: Dispatch<SetStateAction<Role>>,
  ) => {
    console.log("Data auth", data);
    setSigningIn(true);
    try {
      const response = await signIn(data);
      console.log("the response is", response?.data?.result);
      await storeToken(response.data.result.token);
      setRole(Role.USER);
      await handleAuthSuccess(response.data.result);
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
    } catch (error: any) {
      if (error instanceof Error) {
        Toast.show({
          type: "error",
          text1: "OTP Failed",
          text2: error?.message || "Unable to send OTP. Please try again.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "OTP Failed",
          text2:
            error?.response?.data?.message ||
            "Unable to send OTP. Please try again.",
        });
      }
    } finally {
      setSendingOTP(false);
    }
  };

  return { signingIn, onSubmitSignIn, sendOTP, sendingOTP };
};

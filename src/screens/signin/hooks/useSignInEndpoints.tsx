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
import { saveProfile } from "@/store/slices/profileSlice/profileSlice";
import { saveToken } from "@/store/slices/authSlice/authSlice";
import { ProfileSliceState } from "@/store/slices/profileSlice/profileSliceTypes";
import { setSelectedProject } from "@/store/slices/projectSlice/projectSlice";
import { savePermissions } from "@/store/slices/permissionSlice";

export const useSignInEndpoints = () => {
  const [signingIn, setSigningIn] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const dispatch = useDispatch();

  const onSubmitSignIn = async (
    data: SignInFormTypeOTP | SignInFormTypePassword,
    setRole: Dispatch<SetStateAction<Role>>,
  ) => {
    console.log("Data auth", data);
    setSigningIn(true);
    try {
      const response = await signIn(data);
      const result = response.data.result;
      console.log("Result of login", result);
      const {
        token,
        name,
        phone,
        is_admin,
        permissions,
        fk_user_role,
        organization_contact_id,
        organization_details,
        organization_id,
      } = result;
      const profile: ProfileSliceState = {
        name,
        phone,
        is_admin,
        permissions,
        fk_user_role,
        organization_contact_id,
        organization_details,
        organization_id,
        logo_url: organization_details?.asset_details?.url,
      };
      console.log("the response is", result);
      setRole(Role.USER);
      saveToken(token, dispatch);
      saveProfile(profile, dispatch);
      savePermissions(permissions, dispatch);
      dispatch(
        setSelectedProject({
          id: "all_projects",
          project_name: "All Leads",
        }),
      );
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

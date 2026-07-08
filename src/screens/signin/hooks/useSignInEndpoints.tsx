import { Dispatch, SetStateAction, useState } from "react";
import { signIn } from "../utils/signInEndpoints";
import { SignInFormType } from "../types/signinTypes";
import { Role } from "@/types/AuthTypes";
import { storeToken } from "@/utils/authFunctions";

export const useSignInEndpoints = () => {
  const [signingIn, setSigningIn] = useState(false);

  const onSubmitSignIn = async (
    data: SignInFormType,
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

  return { signingIn, onSubmitSignIn };
};

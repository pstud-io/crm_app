import { api } from "@/api/client";
import {
  SignInFormTypePassword,
  SignInFormTypeOTP,
} from "../types/signinTypes";
import { removeSpaces } from "./signInFunctions";

export const signIn = async (
  data: SignInFormTypePassword | SignInFormTypeOTP,
) => {
  const payload = {
    ...data,
    username: removeSpaces(data.username),
  };
  return await api.post("/auth/login", payload);
};

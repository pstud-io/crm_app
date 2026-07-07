import { api } from "@/api/client";
import { SignInFormType } from "../types/signinTypes";

export const signIn = async (data: SignInFormType) => {
  return await api.post("/auth/login", data);
};

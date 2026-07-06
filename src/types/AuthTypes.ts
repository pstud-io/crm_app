// schemas/formSchema.ts
import { Dispatch, SetStateAction } from "react";
import * as z from "zod";

export const SignInFormSchema = z.object({
  userID: z.string().trim().min(1, "User ID is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignInFormType = z.infer<typeof SignInFormSchema>;

export enum Role {
  USER = "user",
  GUEST = "guest",
}

export type AuthContextType = {
  role: Role;
  authLoading: boolean;
  signIn: (role: Role) => void;
  signOut: () => void;
  setAuthLoading: Dispatch<SetStateAction<boolean>>;
  setRole: Dispatch<SetStateAction<Role>>;
};

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const apiEndpoint = "https://www.app.projectstudio.ai" as const;

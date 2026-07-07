// schemas/formSchema.ts
import { Dispatch, SetStateAction } from "react";

export enum Role {
  USER = "user",
  GUEST = "guest",
}

export type AuthContextType = {
  role: Role;
  authLoading: boolean;
  setAuthLoading: Dispatch<SetStateAction<boolean>>;
  setRole: Dispatch<SetStateAction<Role>>;
};

export interface AuthProviderProps {
  children: React.ReactNode;
}

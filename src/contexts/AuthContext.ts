import { AuthContextType } from "@/types/AuthTypes";
import { createContext } from "react";

export const AuthContext: React.Context<AuthContextType | undefined> =
  createContext<AuthContextType | undefined>(undefined);

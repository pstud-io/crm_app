import React, { createContext, useEffect, useMemo, useState } from "react";
import {
  AuthContextType,
  AuthProviderProps,
  Role,
  apiEndpoint,
} from "@/types/AuthTypes";
import { AuthContext } from "@/contexts/AuthContext";

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [role, setRole] = useState<Role>(Role.GUEST);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const signIn: () => void = () => {
    setRole(Role.USER);
  };
  const signOut: () => void = () => {
    setRole(Role.GUEST);
  };

  const value: AuthContextType = useMemo(
    () => ({
      role,
      authLoading,
      signIn,
      signOut,
      setRole,
      setAuthLoading,
    }),
    [role, authLoading, signIn, signOut, setRole, setAuthLoading],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

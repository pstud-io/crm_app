import React, { useMemo, useState } from "react";
import { AuthContextType, AuthProviderProps, Role } from "@/types/AuthTypes";
import { AuthContext } from "@/contexts/AuthContext";

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [role, setRole] = useState<Role>(Role.GUEST);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const value: AuthContextType = useMemo(
    () => ({
      role,
      authLoading,
      setRole,
      setAuthLoading,
    }),
    [role, authLoading, setRole, setAuthLoading],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

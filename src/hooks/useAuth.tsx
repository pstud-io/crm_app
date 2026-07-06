import { AuthContext } from "@/contexts/AuthContext";
import { AuthContextType } from "@/types/AuthTypes";
import { useContext } from "react";

export function useAuth() {
  const context: AuthContextType | undefined = useContext(AuthContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}

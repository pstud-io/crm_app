import { ThemeContext } from "@/contexts/ThemeContext";
import { ThemeContextType } from "@/types/themeTypes";
import { useContext } from "react";

export function useTheme() {
  const context: ThemeContextType | undefined = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}

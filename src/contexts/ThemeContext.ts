import React, { createContext } from "react";
import { ThemeContextType } from "@/types/themeTypes";

export const ThemeContext: React.Context<ThemeContextType | undefined> =
  createContext<ThemeContextType | undefined>(undefined);

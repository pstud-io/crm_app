import { ActivityIndicator } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { AuthNavigation } from "./auth/AuthNavigation";
import { useTheme } from "@/hooks/useTheme";
import { UserNavigation } from "./auth/UserNavigation";
export const Navigation = () => {
  const { role, authLoading } = useAuth();
  const { theme } = useTheme();
  if (authLoading) {
    return <ActivityIndicator color={theme.text} />;
  }

  switch (role) {
    case "user":
      return <UserNavigation />;
    case "guest":
      return <AuthNavigation />;
  }
};

import { ActivityIndicator } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { AuthNavigation } from "./AuthNavigation";
import { useTheme } from "@/hooks/useTheme";
import { UserNavigation } from "./UserNavigation";
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

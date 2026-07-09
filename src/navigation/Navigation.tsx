import { ActivityIndicator, Text, View } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { AuthNavigation } from "./AuthNavigation";
import { useTheme } from "@/hooks/useTheme";
import { UserNavigation } from "./UserNavigation";
import { center, fullScreen, SCREEN_HEIGHT, xstack } from "@/design/layout";
import { borderRadius } from "@/design/borders";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { body, heading } from "@/design/typography";
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

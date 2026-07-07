import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Role } from "@/types/AuthTypes";
import { removeToken } from "@/utils/authFunctions";
import { StatusBar } from "expo-status-bar";
import { View, Text, Button } from "react-native";

export const Dashboard = () => {
  const { isDark } = useTheme();
  const { setRole } = useAuth();
  return (
    <View>
      <Text>Hi from dashboard</Text>
      <Button
        title="Log Out!"
        onPress={async () => {
          setRole(Role.GUEST);
          await removeToken();
        }}
      />
      <StatusBar style={isDark ? "light" : "dark"} />
    </View>
  );
};

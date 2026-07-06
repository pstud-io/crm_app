import { useTheme } from "@/hooks/useTheme";
import { StatusBar } from "expo-status-bar";
import { View, Text } from "react-native";

export const Dashboard = () => {
  const { isDark } = useTheme();
  return (
    <View>
      <Text>Hi from dashboard</Text>
      <StatusBar style={isDark ? "light" : "dark"} />
    </View>
  );
};

import { useTheme } from "@/hooks/useTheme";
import { StatusBar } from "expo-status-bar";
import { View, Text } from "react-native";

export const Auth = () => {
  const { isDark } = useTheme();
  return (
    <View>
      <Text>Hi from auth</Text>
      <StatusBar style={isDark ? "light" : "dark"} />
    </View>
  );
};

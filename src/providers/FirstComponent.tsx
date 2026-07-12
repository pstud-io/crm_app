import { Button, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Sentry from "@sentry/react-native";
import { useTheme } from "@/hooks/useTheme";
import { ThemeMode } from "@/types/themeTypes";
import { body } from "@/design/typography";
import { useAuth } from "@/hooks/useAuth";
import { Role } from "@/types/AuthTypes";
import { removeToken } from "@/utils/authFunctions";

export const FirstComponent = () => {
  const { theme, isDark, themeMode, updateTheme, THEME_KEY, setThemeMode } =
    useTheme();
  const { setRole } = useAuth();
  console.log("This is the theme", theme, themeMode);
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text
        style={{
          ...body.sm.bold,
          color: theme.text,
        }}
      >
        Open up App.tsx to start working on your app!
      </Text>
      <Button
        title="Try!"
        onPress={() => {
          Sentry.captureException(new Error("First error"));
        }}
      />
      <Button
        title="Toggle Theme!"
        onPress={() => {
          if (isDark) {
            updateTheme(ThemeMode.Light, THEME_KEY, setThemeMode);
          } else {
            updateTheme(ThemeMode.Dark, THEME_KEY, setThemeMode);
          }
        }}
      />
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

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

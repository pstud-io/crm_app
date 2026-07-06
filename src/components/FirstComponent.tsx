import { Button, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Sentry from "@sentry/react-native";
import { useTheme } from "@/hooks/useTheme";
import { ThemeMode } from "@/types/themeTypes";
import { body } from "@/design/typography";
import { borderRadius } from "@/design/borders";

export const FirstComponent = () => {
  const { theme, isDark, themeMode, updateTheme, THEME_KEY, setThemeMode } =
    useTheme();
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
      <View
        style={{
          backgroundColor: "#fff000",
          width: 200,
          height: 200,
          boxShadow: theme.shadow.md,
          borderRadius: borderRadius.lg,
        }}
      >
        <Text>Hi</Text>
      </View>
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
      <StatusBar style={isDark ? "light" : "dark"} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

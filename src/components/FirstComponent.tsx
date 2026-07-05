import { Button, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Sentry from "@sentry/react-native";
import { useTheme } from "@/hooks/useTheme";
import { ThemeMode } from "@/types/themeTypes";
import { body } from "@/design/typography";

export const FirstComponent = () => {
  const { theme, isDark, themeMode, updateTheme, THEME_KEY, setThemeMode } =
    useTheme();
  console.log("This is the theme", theme, themeMode);
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={{ ...body.sm.bold }}>
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

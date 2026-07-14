import { useMemo } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface SpacingProps {
  space: number | string;
  horizontal?: boolean;
  backgroundColor?: string;
}

export default function Spacing({
  space,
  horizontal = false,
  backgroundColor = "transparent",
}: SpacingProps) {
  const styles = useMemo(
    () =>
      StyleSheet.create({
        spacerStyle: {
          [horizontal ? "width" : "height"]: space,
          backgroundColor,
        } as ViewStyle,
      }),
    [horizontal, space, backgroundColor],
  );

  return <View style={styles.spacerStyle} />;
}

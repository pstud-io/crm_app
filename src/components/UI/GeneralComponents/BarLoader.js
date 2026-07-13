import { View, Animated, StyleSheet } from "react-native";
import { useEffect, useRef } from "react";

const Bar = ({ delay, style }) => {
  const heightAnim = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(heightAnim, {
          toValue: 24,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(heightAnim, {
          toValue: 8,
          duration: 300,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.bar,
        {
          height: heightAnim,
        },
        style,
      ]}
    />
  );
};

export const BarLoader = ({ style }) => {
  return (
    <View style={styles.barContainer}>
      <Bar delay={0} style={style} />
      <Bar delay={120} style={style} />
      <Bar delay={240} style={style} />
      <Bar delay={360} style={style} />
    </View>
  );
};

const styles = StyleSheet.create({
  barContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  bar: {
    width: 6,
    borderRadius: 3,
    backgroundColor: "#4F8EF7",
    marginHorizontal: 4,
  },
});

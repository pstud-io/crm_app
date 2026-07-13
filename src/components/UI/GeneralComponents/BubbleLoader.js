import { View, Animated, StyleSheet } from "react-native";
import { useEffect, useRef } from "react";
import { SW } from "../../../utils";

const Bubble = ({ delay, style }) => {
  const scale = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(scale, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          transform: [{ scale }],
        },
        style,
      ]}
    />
  );
};

export const BubbleLoader = ({ style }) => {
  return (
    <View style={styles.bubbleContainer}>
      <Bubble delay={0} style={style} />
      <Bubble delay={150} style={style} />
      <Bubble delay={300} style={style} />
    </View>
  );
};

const styles = StyleSheet.create({
  bubbleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  bubble: {
    width: SW(10),
    height: SW(10),
    borderRadius: SW(5),
    backgroundColor: "#4F8EF7",
    marginHorizontal: SW(4),
  },
});

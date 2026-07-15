import { View, StyleSheet } from "react-native";
import { SW } from "@/utils";

export default function TimelineDot({
  color,
  borderColor = "white",
  circleShadow = true,
  width = SW(20),
  height = SW(20),
}) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <View
        style={[
          styles.circle,
          circleShadow && styles.circleShadow,
          { backgroundColor: color, borderColor: borderColor },
          { width: width, height: height },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  line: {
    position: "absolute",
    width: 2,
    height: "100%",
    backgroundColor: "#ddd", // light gray line
  },
  circle: {
    borderRadius: SW(15),
    borderWidth: SW(3),
    borderColor: "white", // white border around circle
    elevation: 2, // shadow on Android
  },
  circleShadow: {
    shadowColor: "#000", // shadow on iOS
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
});

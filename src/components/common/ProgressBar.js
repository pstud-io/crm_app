import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors, SH, SW, SF } from "../../utils";
import { formElementsStyles } from "../UI/Dropdown/formElementStyles";
import { MinusCircleOutline, PlusCircleOutline } from "../../svg";
import { primaryColors } from "../UI/DesignSystem/colorPalette";

const ProgressBar = ({
  children,
  progress,
  incrementProgress,
  decrementProgress,
}) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Text style={formElementsStyles.titleStyle}>Update Progress</Text>
      <View style={styles.progressBarContainer}>
        <TouchableOpacity onPress={decrementProgress}>
          <MinusCircleOutline
            stroke={primaryColors.button.active}
            width={SW(20)}
            height={SW(20)}
            strokeWidth={SW(1.5)}
          />
        </TouchableOpacity>

        {/* <View style={styles.progressBackground}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
          <Text style={styles.progressPercentage}>{progress}%</Text>
        </View> */}
        {children}

        <TouchableOpacity onPress={incrementProgress}>
          <PlusCircleOutline
            stroke={primaryColors.button.active}
            width={SW(20)}
            height={SW(20)}
            strokeWidth={SW(1.5)}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    gap: SW(12),
  },
  progressButton: {
    width: SW(14),
    height: SW(14),
    borderRadius: SW(8),
    borderColor: Colors.primary,
    borderWidth: SW(1.5),
    backgroundColor: Colors.theme_background,
    justifyContent: "center",
    alignItems: "center",
  },
  progressBackground: {
    height: SH(30),
    backgroundColor: "#e0e0e0",
    borderRadius: SH(5),
    marginHorizontal: SW(10),
    overflow: "hidden",
    width: "60%",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
  },
  progressPercentage: {
    position: "absolute",
    color: Colors.white,
    fontSize: SF(11),
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
    top: SH(10),
  },
});

export default ProgressBar;

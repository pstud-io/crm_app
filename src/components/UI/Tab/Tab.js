import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Colors, SH, SW } from "../../../utils";
import { Shadow } from "react-native-shadow-2";
import { body } from "../DesignSystem/typography";
export const Tab = ({
  active,
  icon,
  text,
  index,
  onPress,
  style,
  activeStyle,
}) => {
  //   if (!icon && !text) {
  //     throw new Error("Atleast icon or string should be there");
  //   }
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        { flex: 1 },
        active && { zIndex: 2, position: "relative" },
        style,
      ]}
    >
      <Shadow
        disabled={!active}
        distance={SW(4)}
        startColor="rgba(0,0,0,0.12)"
        offset={[0, 4]}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "100%",
            height: "100%",
            borderRadius: SW(6),
            backgroundColor: "white",
            ...activeStyle,
          }}
        >
          {icon && <>{icon}</>}
          {text && (
            <Text
              style={[
                { ...body.xs.medium },
                active
                  ? { ...styles.activetextColor }
                  : { ...styles.textColor },
              ]}
            >
              {text}
            </Text>
          )}
        </View>
      </Shadow>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
  },
  activeTabContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: SH(4),
    },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    gap: 4,
    borderRadius: SW(6),
    flex: 1,
    height: "100%",
  },
  textColor: {
    color: Colors.black_text_color,
  },
  activetextColor: {
    color: Colors.primary,
  },
});

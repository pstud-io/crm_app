import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Colors, SW, SH, SF } from "../../utils";
import { formElementsStyles } from "../UI/Dropdown/formElementStyles";
export const ProjectInfoCardItem = ({
  label,
  value,
  color,
  size,
  location = false,
}) => {
  const handleOpenInChrome = async () => {
    console.log("Location is pressed", value, supported);
    const supported = await Linking.canOpenURL(value);
    if (supported) {
      await Linking.openURL(value);
    } else {
      console.warn("Can't open URL:", value);
    }
  };
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
      <Text style={formElementsStyles.titleStyle}>{label}</Text>
      {location ? (
        <TouchableOpacity
          style={{ maxWidth: "60%" }}
          onPress={async () => await handleOpenInChrome()}
        >
          <Text
            style={formElementsStyles.titleStyle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {value}
          </Text>
        </TouchableOpacity>
      ) : (
        <Text
          style={{
            fontSize: size || SF(13),
            color: color || Colors.black_text_color,
            maxWidth: "60%",
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {value}
        </Text>
      )}
    </View>
  );
};

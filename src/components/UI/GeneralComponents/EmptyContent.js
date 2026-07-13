import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, Dimensions } from "react-native";
import { EmptyState } from "../../../illustrations";
import { Colors, SW } from "../../../utils";
const EmptyContent = ({ onPress }) => {
  const navigation = useNavigation();
  const { width, height } = Dimensions.get("window");

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        display: "flex",
        flexDirection: "row",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <EmptyState width={SW(width * 0.5)} />
    </TouchableOpacity>
  );
};
export default EmptyContent;

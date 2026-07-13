import { ActivityIndicator, View, Text } from "react-native";
import Toast from "react-native-toast-message";

export const toastConfig = {
  loadingToast: () => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        backgroundColor: "#333",
        borderRadius: 20,
        opacity: 0.5,
        zIndex: 1,
      }}
    >
      <ActivityIndicator color="#fff" />
    </View>
  ),
};

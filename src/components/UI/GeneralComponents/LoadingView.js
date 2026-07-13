import LottieView from "lottie-react-native";
import images from "../../../images";
import { Colors, SH, SW } from "../../../utils";
export const LoadingView = () => {
  return (
    <LottieView
      source={images.pageLoader}
      autoPlay
      loop={true}
      style={{
        width: SW(70),
        height: SH(70),
        justifyContent: "center",
        alignSelf: "center",
        flex: 1,
      }}
    />
  );
};

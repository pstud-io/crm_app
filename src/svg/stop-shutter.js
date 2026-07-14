import Svg, { Path, Rect } from "react-native-svg";
import { Colors, SH } from "../utils";
const StopShutterOutline = ({
  width = SH(32),
  height = SH(32),
  fill = Colors.red,
  stroke = Colors.white,
  strokeWidth = 2,
  style,
  ...props
}) => {
  return (
    <Svg
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill={fill}
      style={style}
      stroke={stroke}
      strokeWidth={strokeWidth}
    >
      <Rect
        x="72"
        y="72"
        width="112"
        height="112"
        rx="16"
        fill="red"
        stroke={"transparent"}
      />
      <Path
        d="M127.857 254.307C58.1321 254.307 1.40662 197.581 1.40662 127.857C1.40662 58.1321 58.1321 1.40659 127.857 1.40659C197.581 1.40659 254.307 58.1321 254.307 127.857C254.307 197.581 197.581 254.307 127.857 254.307ZM127.857 7.02659C61.2315 7.02659 7.02662 61.2315 7.02662 127.857C7.02662 194.482 61.2315 248.687 127.857 248.687C194.482 248.687 248.687 194.482 248.687 127.857C248.687 61.2315 194.482 7.02659 127.857 7.02659Z"
        fill="white"
      />
    </Svg>
  );
};

export default StopShutterOutline;

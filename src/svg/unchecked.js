import Svg, { Path, Rect } from "react-native-svg";
import { Colors, SH } from "../utils";
const Unchecked = ({
  width = SH(32),
  height = SH(32),
  fill = "transparent",
  stroke = Colors.white,
  strokeWidth = 2,
  style,
  ...props
}) => {
  return (
    <Svg
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill={fill}
      style={style}
      stroke={stroke}
      strokeWidth={strokeWidth}
    >
      <Path
        d="M5 0.5H11C13.4853 0.5 15.5 2.51472 15.5 5V11C15.5 13.4853 13.4853 15.5 11 15.5H5C2.51472 15.5 0.5 13.4853 0.5 11V5C0.5 2.51472 2.51472 0.5 5 0.5Z"
        stroke={stroke}
      />
    </Svg>
  );
};

export default Unchecked;

import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";
import { Colors, SH } from "../utils";
const ArrowUpRightIcon = ({
  width = SH(20),
  height = SH(20),
  fill = "transparent",
  stroke = Colors.white,
  strokeWidth = 2,
  style,
  ...props
}) => {
  return (
    <Svg
      width={width}
      height={height}
      fill={fill}
      style={style}
      stroke={stroke}
      strokeWidth={strokeWidth}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M5.83325 14.1667L14.1666 5.83337M14.1666 5.83337H5.83325M14.1666 5.83337V14.1667"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ArrowUpRightIcon;

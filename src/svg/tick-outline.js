import Svg, { Path } from "react-native-svg";
import { Colors, SH } from "../utils";
const TickOutline = ({
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
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill={fill}
      style={style}
      stroke={stroke}
      strokeWidth={strokeWidth}
    >
      <Path
        d="M4.89163 13.2687L9.16582 17.5427L18.7085 8"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default TickOutline;

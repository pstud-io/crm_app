import Svg, { Path, Rect } from "react-native-svg";
import { Colors, SH } from "../utils";
const Checked = ({
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
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      style={style}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    >
      <Path
        d="M5 0.5H11C13.4853 0.5 15.5 2.51472 15.5 5V11C15.5 13.4853 13.4853 15.5 11 15.5H5C2.51472 15.5 0.5 13.4853 0.5 11V5C0.5 2.51472 2.51472 0.5 5 0.5Z"
        fill={fill}
        stroke={stroke}
      />
      <Path
        d="M11.875 5.77344L7.23438 10.4141L5.125 8.30469"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default Checked;

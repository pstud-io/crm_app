import Svg, { Circle, Path } from "react-native-svg";
import { Colors, SH } from "../utils";
const CircleFilled = ({
  width = SH(32),
  height = SH(32),
  fill = Colors.white,
  stroke = Colors.white,
  strokeWidth = 0,
  style,
  ...props
}) => {
  return (
    <Svg
      width={width}
      height={height}
      style={style}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill="none"
      viewBox="0 0 6 6"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Circle cx="3" cy="3" r="3" fill={fill} />
    </Svg>
  );
};

export default CircleFilled;

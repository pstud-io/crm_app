import Svg, { Path } from "react-native-svg";
import { Colors, SH, SW } from "../utils";
const Flag = ({
  width = SH(24),
  height = SH(24),
  fill = "transparent",
  stroke = Colors.white,
  strokeWidth = SW(2),
  style,
  ...props
}) => {
  return (
    <Svg
      viewBox="0 -960 960 960"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      style={style}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    >
      <Path d="M220.08-124.08v-663.84h543.84l-119.9 172.29 119.9 172.28H268.04v319.27h-47.96Zm47.96-367.23h398.85l-82.97-124.57 82.97-124.08H268.04v248.65Zm0 0v-248.65V-491.31Z" />
    </Svg>
  );
};

export default Flag;

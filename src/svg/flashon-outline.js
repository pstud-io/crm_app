import Svg, { Path } from "react-native-svg";
import { Colors, SH } from "../utils";
const FlashOnOutline = ({
  width = SH(32),
  height = SH(32),
  fill = Colors.white,
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
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path d="M13.225 9l5.025-7h-7.972l-3.3 11h5.359l-2.452 8.648.75.364L20.374 9zm.438 3H8.322l2.7-9H16.3l-5.025 7h7.101l-6.7 8.953z" />
    </Svg>
  );
};

export default FlashOnOutline;

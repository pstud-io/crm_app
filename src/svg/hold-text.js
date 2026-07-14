<svg
  width="16"
  height="16"
  viewBox="0 0 16 16"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <circle cx="8" cy="8" r="8" fill="#D92D20" />
  <rect x="5.33301" y="5.33301" width="5.33333" height="5.33333" fill="white" />
</svg>;

import Svg, { Circle, Path, Rect } from "react-native-svg";
import { Colors, SH } from "../utils";
const HoldText = ({
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
      <Circle cx="8" cy="8" r="8" fill="#D92D20" />
      <Rect
        x="5.33301"
        y="5.33301"
        width="5.33333"
        height="5.33333"
        fill={fill}
      />
    </Svg>
  );
};

export default HoldText;

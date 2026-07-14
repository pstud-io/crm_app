import React from "react";
import Svg, { Path } from "react-native-svg";
import { Colors, SH } from "../utils";
const ChevronDown = ({
  width,
  height,
  style = {},
  strokeWidth = 2,
  stroke = Colors.black_text_color,
  ...props
}) => {
  return (
    <Svg
      width={width}
      height={width * 0.5}
      viewBox="0 0 14 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <Path
        d="M13 1L7 7L1 0.999999"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default ChevronDown;

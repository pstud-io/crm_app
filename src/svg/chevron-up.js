import React from "react";
import Svg, { Path } from "react-native-svg";
import { Colors, SH } from "../utils";
const ChevronUp = ({
  width = SH(24),
  height = SH(24),
  fill = Colors.primary,
  style = {},
  ...props
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 14 14"
      fill="none"
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M13 8L7 2L1 8"
        stroke="#D9D9D9"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default ChevronUp;

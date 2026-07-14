import React from "react";
import Svg, { Path } from "react-native-svg";
import { SH, Colors, SW } from "../utils";

const BackOutlineIcon = ({
  width = SW(24),
  height = SH(24),
  stroke = "#141414",
  strokeWidth = SW(2),
  ...props
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M16 4L8 12L16 20"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default BackOutlineIcon;

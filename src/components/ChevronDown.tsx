import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const ChevronDown = ({
  width,
  height,
  style,
  strokeWidth,
  stroke,
}: SvgProps) => {
  return (
    <Svg
      width={width}
      height={(height as number) * 0.5}
      viewBox="0 0 14 9"
      fill="none"
      style={style}
      stroke={stroke}
      strokeWidth={strokeWidth}
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

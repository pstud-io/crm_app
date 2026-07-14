import React from "react";
import Svg, { Path, Rect, Defs, ClipPath, G } from "react-native-svg";
import { Colors, SH } from "../utils";

const ManPowerOutlineIcon = ({
  width = SH(20),
  height = SH(20),
  color = "#007BFF",
  ...props
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M9.9999 0.800049C8.89521 0.800049 7.9999 1.69536 7.9999 2.80005C7.9999 3.90474 8.89521 4.80005 9.9999 4.80005C11.1046 4.80005 11.9999 3.90474 11.9999 2.80005C11.9999 1.69536 11.1046 0.800049 9.9999 0.800049ZM9.9999 5.60005C8.01084 5.60005 6.3999 7.21099 6.3999 9.20005V12.8L7.79365 13.3563L8.07959 18.8H11.9202L12.2062 13.3563L13.5999 12.8V9.20005C13.5999 7.21099 11.989 5.60005 9.9999 5.60005Z"
        fill={color}
      />
    </Svg>
  );
};

export default ManPowerOutlineIcon;

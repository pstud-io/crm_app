import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

const CloseOutlineIcon = ({
  width,
  height,
  fill,
  strokeWidth,
  ...props
}: SvgProps) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill={fill}
      strokeWidth={strokeWidth}
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 9.97876L18.5593 3.41881C19.1176 2.8604 20.0229 2.8604 20.5812 3.41881C21.1396 3.97721 21.1396 4.88257 20.5812 5.44098L14.0229 12L20.5812 18.559C21.1396 19.1174 21.1396 20.0228 20.5812 20.5812C20.0229 21.1396 19.1176 21.1396 18.5593 20.5812L12 14.0212L5.44073 20.5812C4.88238 21.1396 3.97711 21.1396 3.41876 20.5812C2.86041 20.0228 2.86041 19.1174 3.41876 18.559L9.9771 12L3.41876 5.44098C2.86041 4.88257 2.86041 3.97721 3.41876 3.41881C3.97711 2.8604 4.88238 2.8604 5.44073 3.41881L12 9.97876Z"
        fill={fill}
        strokeWidth={strokeWidth}
      />
    </Svg>
  );
};

export default CloseOutlineIcon;

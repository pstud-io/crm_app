import React from "react";
import Svg, { Path } from "react-native-svg";
import { SF, Colors, SH } from "../utils";

const DownArrowOutlineIcon = ({
  width = SH(16),
  height = SH(16),
  color = Colors.gray_text_color,
  ...props
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <Path
        d="M7.99999 3.81262L10.6935 6.50611C10.9866 6.79927 11.462 6.79927 11.7551 6.50611C12.0483 6.21294 12.0483 5.73763 11.7551 5.44447L8.53032 2.21967C8.23743 1.92678 7.76256 1.92678 7.46966 2.21967L4.24487 5.44447C3.9517 5.73763 3.9517 6.21294 4.24487 6.50611C4.53803 6.79927 5.01334 6.79927 5.30651 6.50611L7.99999 3.81262Z"
        fill={color}
      />
      <Path
        d="M11.7551 9.49389C11.462 9.20073 10.9866 9.20073 10.6935 9.49389L7.99999 12.1874L5.30651 9.49389C5.01334 9.20073 4.53803 9.20073 4.24487 9.49389C3.9517 9.78706 3.9517 10.2624 4.24487 10.5555L7.46966 13.7803C7.76256 14.0732 8.23743 14.0732 8.53032 13.7803L11.7551 10.5555C12.0483 10.2624 12.0483 9.78706 11.7551 9.49389Z"
        fill={color}
      />
    </Svg>
  );
};

export default DownArrowOutlineIcon;

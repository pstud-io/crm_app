import React from "react";
import Svg, { Path } from "react-native-svg";
import { SH } from "../utils";

const DownArrowMainIcon = ({
  width = SH(24),
  height = SH(24),
  strokeWidth = 1,
  color = "#007BFF",
  ...props
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M12 12.6796L15.6525 9.11809C15.8153 8.9593 16.0757 8.96092 16.2385 9.12133L16.8781 9.75813C17.0409 9.92179 17.0409 10.1843 16.8765 10.3463L12.2946 14.8785C12.2132 14.9595 12.1074 15 12 15C11.8926 15 11.7868 14.9595 11.7054 14.8785L7.1235 10.3463C6.95911 10.1843 6.95911 9.92179 7.12187 9.75813L7.76155 9.12133C7.92431 8.96092 8.18474 8.9593 8.34751 9.11809L12 12.6796Z"
        fill="#007BFF"
      />
    </Svg>
  );
};

export default DownArrowMainIcon;

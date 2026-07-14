import React from "react";
import Svg, { Path } from "react-native-svg";
import PropTypes from "prop-types";
import { Colors, SH } from "../utils";

const SuccessTickOutlineIcon = ({
  width = SH(51),
  height = SH(51),
  stroke = Colors.white,
  strokeWidth = 1,
  fill = "#0AC27D",
  ...props
}) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 51 51"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      {...props}
    >
      <Path
        d="M10.9166 4.66675C7.4886 4.66675 4.66663 7.48872 4.66663 10.9167V40.0834C4.66663 43.5114 7.4886 46.3334 10.9166 46.3334H40.0833C43.5113 46.3334 46.3333 43.5114 46.3333 40.0834V23.4167H42.1666V40.0834C42.1666 41.2387 41.2386 42.1668 40.0833 42.1668H10.9166C9.76132 42.1668 8.83329 41.2387 8.83329 40.0834V10.9167C8.83329 9.76145 9.76132 8.83342 10.9166 8.83342H29.6666V4.66675H10.9166ZM43.1513 8.65438L23.791 29.1785L16.1412 21.5287L13.1953 24.4747L23.8764 35.1558L46.1827 11.5149L43.1513 8.65438Z"
        fill={fill}
      />
    </Svg>
  );
};

SuccessTickOutlineIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.string,
};

export default SuccessTickOutlineIcon;

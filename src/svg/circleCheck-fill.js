import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { SH } from '../utils';

const CircleCheckFilledIcon = ({ width = SH(20), height = SH(20), color = "#54FF5B", strokeColor = "white", ...props }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle cx="10" cy="10" r="10" fill={color} />
      <Path
        d="M4.54544 10.9091L7.72726 14.0909L15.4545 6.36363"
        stroke={strokeColor}
        strokeWidth="1.81818"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default CircleCheckFilledIcon;

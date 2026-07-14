import React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';
import { SH } from '../utils';

const ProfileFilledIconTwo = ({ width = SH(63), height = SH(64), color1 = "white", color2 = "#0083C9", ...props }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 63 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect
        y="0.5"
        width="63"
        height="63"
        rx="31.5"
        fill={color1}
      />
      <Path
        d="M31.0528 38.4461C22.3951 38.4461 15 39.8111 15 45.2711C15 50.7331 22.3489 52.1463 31.0528 52.1463C39.7105 52.1463 47.1056 50.7833 47.1056 45.3213C47.1056 39.8593 39.7587 38.4461 31.0528 38.4461Z"
        fill={color2}
      />
      <Path
        opacity="0.4"
        d="M31.0528 33.2458C36.9504 33.2458 41.6757 28.5185 41.6757 22.6229C41.6757 16.7273 36.9504 12 31.0528 12C25.1572 12 20.4299 16.7273 20.4299 22.6229C20.4299 28.5185 25.1572 33.2458 31.0528 33.2458Z"
        fill={color2}
      />
    </Svg>
  );
};

export default ProfileFilledIconTwo;

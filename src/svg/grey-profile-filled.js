import React from 'react';
import Svg, { Rect, Path, G, Ellipse, Defs, ClipPath } from 'react-native-svg';
import { Colors, SH } from '../utils';

const GreyProfileFilledIcon = ({ width = SH(37), height = SH(37), color1 = "#F7F7F7", color2 = "#999999", ...props }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
      <G clip-path="url(#clip0_79_574)">
        <Rect width="37" height="37" rx="6.16667" fill="#DCDCDC" />
        <G clip-path="url(#clip1_79_574)">
          <Rect width="37.6167" height="37.6167" transform="translate(-0.616669 -0.616577)" fill="#EEEEEE" />
          <Path opacity="0.5" d="M31.1377 29.9163C31.1377 28.2162 30.8028 26.5328 30.1522 24.9621C29.5016 23.3914 28.548 21.9643 27.3459 20.7621C26.1437 19.56 24.7166 18.6064 23.1459 17.9558C21.5752 17.3052 19.8918 16.9703 18.1917 16.9703C16.4916 16.9703 14.8082 17.3052 13.2375 17.9558C11.6668 18.6064 10.2396 19.56 9.03749 20.7621C7.83534 21.9643 6.88175 23.3914 6.23115 24.9621C5.58055 26.5328 5.2457 28.2162 5.2457 29.9163L18.1917 29.9163H31.1377Z" fill="#007BFF" />
          <Ellipse opacity="0.3" cx="18.1917" cy="13.0621" rx="6.47499" ry="6.25172" fill="black" />
        </G>
      </G>
      <Defs>
        <ClipPath id="clip0_79_574">
          <Rect width="37" height="37" rx="6.16667" fill="white" />
        </ClipPath>
        <ClipPath id="clip1_79_574">
          <Rect width="37.6167" height="37.6167" fill="white" transform="translate(-0.616669 -0.616577)" />
        </ClipPath>
      </Defs>
    </Svg>


  );
};

export default GreyProfileFilledIcon;

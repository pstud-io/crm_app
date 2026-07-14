import React from 'react';
import { Svg, Circle, Path } from 'react-native-svg';

const AscendingFilledIcon = ({ width = 20, height = 20, color = '#0083C9' }) => (
  <Svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Circle cx="10" cy="10" r="10" fill="white" />
    <Path
      d="M7 11.9091L10.1818 15.0909M10.1818 15.0909V5M10.1818 15.0909L13.4545 11.8182"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default AscendingFilledIcon;

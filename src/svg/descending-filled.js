import React from 'react';
import { Svg, Circle, Path } from 'react-native-svg';

const DescendingFilledIcon = ({ width = 20, height = 20, color = '#0083C9' }) => (
  <Svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Circle cx="10" cy="10" r="10" transform="matrix(1 0 0 -1 0 20)" fill="white" />
    <Path
      d="M7 8.09094L10.1818 4.90912M10.1818 4.90912V15M10.1818 4.90912L13.4545 8.18183"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default DescendingFilledIcon;

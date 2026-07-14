import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { SH } from '../utils';

const DownArrowFilledIcon = ({ width = SH(6), height = SH(5), color = "#878787", ...props }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 6 5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M3.48329 4.18958C3.23168 4.49129 2.76821 4.49129 2.5166 4.18958L0.396908 1.64783C0.0550909 1.23795 0.346547 0.615389 0.880249 0.615389L5.11964 0.615389C5.65334 0.615389 5.9448 1.23795 5.60298 1.64783L3.48329 4.18958Z"
        fill={color}
      />
      <Path
        d="M3.48329 4.18958C3.23168 4.49129 2.76821 4.49129 2.5166 4.18958L0.396908 1.64783C0.0550909 1.23795 0.346547 0.615389 0.880249 0.615389L5.11964 0.615389C5.65334 0.615389 5.9448 1.23795 5.60298 1.64783L3.48329 4.18958Z"
        fill="black"
        fillOpacity="0.2"
      />
    </Svg>
  );
};

export default DownArrowFilledIcon;

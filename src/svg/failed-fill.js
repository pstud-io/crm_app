import React from 'react';
import { Svg, Circle, Path } from 'react-native-svg';

const FailedFilledIcon = ({ width = 22, height = 22, color = '#FF7E7E' }) => (
  <Svg width={width} height={height} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Circle cx="11" cy="11" r="10" fill={color} />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 10.1017L13.9152 7.18614C14.1634 6.93795 14.5657 6.93795 14.8139 7.18614C15.062 7.43432 15.062 7.8367 14.8139 8.08488L11.8991 11L14.8139 13.9151C15.062 14.1633 15.062 14.5657 14.8139 14.8139C14.5657 15.062 14.1634 15.062 13.9152 14.8139L11 11.8983L8.08477 14.8139C7.83661 15.062 7.43427 15.062 7.18612 14.8139C6.93796 14.5657 6.93796 14.1633 7.18612 13.9151L10.1009 11L7.18612 8.08488C6.93796 7.8367 6.93796 7.43432 7.18612 7.18614C7.43427 6.93795 7.83661 6.93795 8.08477 7.18614L11 10.1017Z"
      fill="white"
    />
  </Svg>
);

export default FailedFilledIcon;

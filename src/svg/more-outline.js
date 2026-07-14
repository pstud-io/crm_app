import React from 'react';
import Svg, { G, Path, Defs, ClipPath, Rect } from 'react-native-svg';
import { Colors, SH } from '../utils';
const MoreOutlineIcon = ({ width = SH(24), height = SH(24), fill = Colors.primary, ...props }) => {
    return (
        <Svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M12.25 2C6.73603 2 2.25 6.48604 2.25 12C2.25 17.514 6.73603 22 12.25 22C17.764 22 22.25 17.514 22.25 12C22.25 6.48604 17.764 2 12.25 2ZM7.75 10.5C8.5785 10.5 9.25 11.1715 9.25 12C9.25 12.8285 8.5785 13.5 7.75 13.5C6.9215 13.5 6.25 12.8285 6.25 12C6.25 11.1715 6.9215 10.5 7.75 10.5ZM12.25 10.5C13.0785 10.5 13.75 11.1715 13.75 12C13.75 12.8285 13.0785 13.5 12.25 13.5C11.4215 13.5 10.75 12.8285 10.75 12C10.75 11.1715 11.4215 10.5 12.25 10.5ZM16.75 10.5C17.5785 10.5 18.25 11.1715 18.25 12C18.25 12.8285 17.5785 13.5 16.75 13.5C15.9215 13.5 15.25 12.8285 15.25 12C15.25 11.1715 15.9215 10.5 16.75 10.5Z" fill="#BFBFBF" />
        </Svg>

    );
};

export default MoreOutlineIcon;

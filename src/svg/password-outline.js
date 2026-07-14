import React from 'react';
import Svg, { Path, ClipPath, Defs, Rect } from 'react-native-svg';
import { Colors, SH } from '../utils';

const PasswordOutlineIcon = ({ width = SH(18), height = SH(20), fill = "#A6A6A6", ...props }) => {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            fill="none"
            viewBox="0 0 18 20"
        >
            <Path
                fill={fill}
                fillRule="evenodd"
                d="M9 2a3 3 0 0 0-3 3v1h6V5a3 3 0 0 0-3-3M4 5v1H3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-1V5A5 5 0 0 0 4 5M3 8a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1zm7 4a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0z"
                clipRule="evenodd"
            ></Path>
        </Svg>
    )
}

export default PasswordOutlineIcon
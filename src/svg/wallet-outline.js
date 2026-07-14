import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { Colors, SH } from '../utils';

const WalletOutlineIcon = ({ width = SH(34), height = SH(34), fill = "#0083C9", ...props }) => {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 34 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M3.1875 4.25C2.0145 4.25 1.0625 5.202 1.0625 6.375C1.0625 7.548 2.0145 8.5 3.1875 8.5H5.3125V29.75H28.6875V8.5H30.8125C31.9855 8.5 32.9375 7.548 32.9375 6.375C32.9375 5.202 31.9855 4.25 30.8125 4.25H3.1875ZM7.4375 6.375H26.5625V27.625H7.4375V6.375Z"
                fill={fill}
            />
            <Path
                d="M13 11.6875V12.8466H15C15.8516 12.8466 16.9707 13.4488 17.3594 14.5852H13V15.7443H17.4844C17.3301 17.2566 15.9863 18.0625 15 18.0625H13V19.4933L18.125 24.4375H19.6875L14.2812 19.2216H15C16.6172 19.2216 18.3379 17.8361 18.4844 15.7443H21V14.5852H18.4062C18.2539 13.8993 17.9297 13.3129 17.5 12.8466H21V11.6875H13Z"
                fill={fill}
            />
        </Svg>
    );
};

export default WalletOutlineIcon;

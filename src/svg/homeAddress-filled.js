import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { Colors, SH } from '../utils';

const HomeAddressFilledIcon = ({ width = SH(24), height = SH(24), color = Colors.primary, ...props }) => {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M12 2.09961L1 12H4V21H9V14H15V21H20V12H23L19 8.40039V4H17V6.59961L12 2.09961Z"
                fill={color}
            />
        </Svg>
    );
};

export default HomeAddressFilledIcon;

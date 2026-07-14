import React from "react";
import Svg, { Path, Rect, Defs, ClipPath, G } from "react-native-svg";
import { Colors, SH } from "../utils";
import { primaryColors } from "../components/UI/DesignSystem/colorPalette";

const FolderOutlineIcon = ({
  width = SH(20),
  height = SH(20),
  fill = primaryColors.brand[1000],
  ...props
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 18 18"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M3.1875 3C2.26219 3 1.5 3.76219 1.5 4.6875V13.3125C1.5 14.2378 2.26219 15 3.1875 15H14.8125C15.7378 15 16.5 14.2378 16.5 13.3125V6.5625C16.5 5.63719 15.7378 4.875 14.8125 4.875H9.01611L7.3396 3.47827C6.96902 3.16954 6.50219 3 6.01978 3H3.1875ZM3.1875 4.125H6.01978C6.23937 4.125 6.45096 4.20201 6.61963 4.34253L7.93359 5.4375L6.61963 6.53247C6.45096 6.67299 6.23937 6.75 6.01978 6.75H2.625V4.6875C2.625 4.37006 2.87006 4.125 3.1875 4.125ZM9.01611 6H14.8125C15.1299 6 15.375 6.24506 15.375 6.5625V13.3125C15.375 13.6299 15.1299 13.875 14.8125 13.875H3.1875C2.87006 13.875 2.625 13.6299 2.625 13.3125V7.875H6.01978C6.50219 7.875 6.96902 7.70546 7.3396 7.39673L9.01611 6Z"
        fill={fill}
      />
    </Svg>
  );
};

export default FolderOutlineIcon;

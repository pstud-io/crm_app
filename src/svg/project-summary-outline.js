import React from "react";
import Svg, { Path, Rect, Defs, ClipPath, G } from "react-native-svg";
import { Colors, SH } from "../utils";
import { primaryColors } from "../components/UI/DesignSystem/colorPalette";

const ProjectSummaryOutlineIcon = ({
  width = SH(20),
  height = SH(20),
  color = Colors.primary,
  fill = primaryColors.brand[1000],
  ...props
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 21 20"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M5.85 2C4.69609 2 3.75 2.90104 3.75 4V16C3.75 17.099 4.69609 18 5.85 18H15.65C16.8039 18 17.75 17.099 17.75 16V6.39063L13.1398 2H5.85ZM5.85 3.33333H12.15V7.33333H16.35V16C16.35 16.375 16.0437 16.6667 15.65 16.6667H5.85C5.45625 16.6667 5.15 16.375 5.15 16V4C5.15 3.625 5.45625 3.33333 5.85 3.33333ZM13.55 4.27604L15.3602 6H13.55V4.27604ZM6.55 8.66667V10H7.95V8.66667H6.55ZM9.35 8.66667V10H14.95V8.66667H9.35ZM6.55 11.3333V12.6667H7.95V11.3333H6.55ZM9.35 11.3333V12.6667H14.95V11.3333H9.35ZM6.55 14V15.3333H7.95V14H6.55ZM9.35 14V15.3333H14.95V14H9.35Z"
        fill={fill}
      />
    </Svg>
  );
};

export default ProjectSummaryOutlineIcon;

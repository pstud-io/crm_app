import React from "react";
import Svg, { Path, Rect, Defs, ClipPath, G } from "react-native-svg";
import { Colors, SH } from "../utils";
import { primaryColors } from "../components/UI/DesignSystem/colorPalette";

const ProfileOutlineIcon = ({
  width = SH(24),
  height = SH(24),
  color = primaryColors.brand[1000],
  ...props
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M10.5 3.125C8.09033 3.125 6.125 5.09033 6.125 7.5C6.125 9.00635 6.89404 10.3442 8.05859 11.1328C5.82959 12.0898 4.25 14.3018 4.25 16.875H5.5C5.5 15.0684 6.45459 13.4961 7.88281 12.6172C8.30273 13.6475 9.32568 14.375 10.5 14.375C11.6743 14.375 12.6973 13.6475 13.1172 12.6172C14.5454 13.4961 15.5 15.0684 15.5 16.875H16.75C16.75 14.3018 15.1704 12.0898 12.9414 11.1328C14.106 10.3442 14.875 9.00635 14.875 7.5C14.875 5.09033 12.9097 3.125 10.5 3.125ZM10.5 4.375C12.2334 4.375 13.625 5.7666 13.625 7.5C13.625 9.2334 12.2334 10.625 10.5 10.625C8.7666 10.625 7.375 9.2334 7.375 7.5C7.375 5.7666 8.7666 4.375 10.5 4.375ZM10.5 11.875C11.0127 11.875 11.501 11.9482 11.9648 12.0898C11.7476 12.6929 11.1812 13.125 10.5 13.125C9.81885 13.125 9.25244 12.6929 9.03516 12.0898C9.49902 11.9482 9.98731 11.875 10.5 11.875Z"
        fill={color}
      />
    </Svg>
  );
};

export default ProfileOutlineIcon;

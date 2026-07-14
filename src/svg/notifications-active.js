import React from "react";
import Svg, { Path, ClipPath, Defs, Rect, Circle } from "react-native-svg";
import { Colors, SH } from "../utils";

const NotificationsReadIcon = ({
  width = SH(24),
  height = SH(24),
  fill = "#A6A6A6",
  ...props
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 18 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M16.2491 16.0001H1.75107C1.14857 16.0001 0.596073 15.6966 0.273573 15.1876C-0.0489271 14.6786 -0.0889271 14.0501 0.167573 13.5051L1.50007 10.8241V7.69056C1.50007 3.57106 4.63557 0.197059 8.63857 0.00855894C10.7141 -0.0854411 12.6786 0.644059 14.1761 2.07256C15.6751 3.50206 16.5001 5.42956 16.5001 7.50006V10.8241L17.8251 13.4906C18.0886 14.0501 18.0491 14.6791 17.7266 15.1881C17.4041 15.6971 16.8516 16.0001 16.2491 16.0001ZM6.04507 17.0001C6.28407 18.4166 7.51607 19.5001 9.00007 19.5001C10.4841 19.5001 11.7156 18.4166 11.9551 17.0001H6.04507Z"
        fill="#D9D9D9"
      />
    </Svg>
  );
};

export default NotificationsReadIcon;

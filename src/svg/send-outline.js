import React from "react";
import Svg, { Path, Rect, Defs, ClipPath, G } from "react-native-svg";
import { Colors, SH } from "../utils";

const SendOutlineIcon = ({
  width = SH(24),
  height = SH(24),
  color = Colors.gray_text_color,
  ...props
}) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={color}
      width={width}
      height={height}
    >
      <Path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
    </Svg>
  );
};

export default SendOutlineIcon;

{
  /* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="#181D27" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg> */
}

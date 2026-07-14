import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";
import { Colors, SH } from "../utils";
const LockIcon = ({
  width = SH(20),
  height = SH(20),
  fill = "transparent",
  stroke = Colors.white,
  strokeWidth = 2,
  style,
  ...props
}) => {
  return (
    <Svg
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      style={style}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    >
      <Path
        d="M5.83333 9.16663V5.83329C5.83333 4.72822 6.27232 3.66842 7.05372 2.88701C7.83512 2.10561 8.89493 1.66663 10 1.66663C11.1051 1.66663 12.1649 2.10561 12.9463 2.88701C13.7277 3.66842 14.1667 4.72822 14.1667 5.83329V9.16663M4.16667 9.16663H15.8333C16.7538 9.16663 17.5 9.91282 17.5 10.8333V16.6666C17.5 17.5871 16.7538 18.3333 15.8333 18.3333H4.16667C3.24619 18.3333 2.5 17.5871 2.5 16.6666V10.8333C2.5 9.91282 3.24619 9.16663 4.16667 9.16663Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default LockIcon;

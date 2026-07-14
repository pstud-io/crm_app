import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";
import { Colors, SH, SW } from "../utils";
const ClipboardIcon = ({
  width = SH(20),
  height = SH(20),
  fill = "transparent",
  stroke = Colors.white,
  strokeWidth = SW(1),
  style,
  ...props
}) => {
  return (
    <Svg
      width={width}
      height={height}
      fill={fill}
      style={style}
      stroke={stroke}
      strokeWidth={strokeWidth}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M13.3335 3.33341H15.0002C15.4422 3.33341 15.8661 3.50901 16.1787 3.82157C16.4912 4.13413 16.6668 4.55805 16.6668 5.00008V16.6667C16.6668 17.1088 16.4912 17.5327 16.1787 17.8453C15.8661 18.1578 15.4422 18.3334 15.0002 18.3334H5.00016C4.55814 18.3334 4.13421 18.1578 3.82165 17.8453C3.50909 17.5327 3.3335 17.1088 3.3335 16.6667V5.00008C3.3335 4.55805 3.50909 4.13413 3.82165 3.82157C4.13421 3.50901 4.55814 3.33341 5.00016 3.33341H6.66683M7.50016 1.66675H12.5002C12.9604 1.66675 13.3335 2.03984 13.3335 2.50008V4.16675C13.3335 4.62699 12.9604 5.00008 12.5002 5.00008H7.50016C7.03993 5.00008 6.66683 4.62699 6.66683 4.16675V2.50008C6.66683 2.03984 7.03993 1.66675 7.50016 1.66675Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ClipboardIcon;

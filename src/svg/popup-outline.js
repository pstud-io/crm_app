import Svg, { Path } from "react-native-svg";
import { Colors, SH } from "../utils";
const PopupOutline = ({
  width = SH(32),
  height = SH(32),
  fill = Colors.white,
  stroke = Colors.white,
  strokeWidth = 2,
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
      viewBox="0 0 52 52"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M3.5 48C7.30761 44.1924 11.75 39.75 11.75 39.75L16.625 34.875L21.5 30M21.5 30V36.5M21.5 30H15"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M28 5C28 3.34315 29.3431 2 31 2H47C48.6569 2 50 3.34315 50 5V21C50 22.6569 48.6569 24 47 24H31C29.3431 24 28 22.6569 28 21V5Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <Path
        d="M46 30.3125V33.125V38.75V44C46 47.3137 43.3137 50 40 50H8C4.68629 50 2 47.3137 2 44V12C2 8.68629 4.68629 6 8 6H13H18.5H21.25"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default PopupOutline;

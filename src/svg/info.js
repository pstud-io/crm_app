import Svg, { Path } from "react-native-svg";
import { Colors, SH, SW } from "../utils";

const InfoOutline = ({
  width = SW(32),
  height = SH(32),
  fill = "transparent",
  stroke = Colors.white,
  strokeWidth = SW(2),
  style,
  ...props
}) => {
  return (
    <Svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill={fill}
      style={style}
      stroke={stroke}
      strokeWidth={strokeWidth}
    >
      <Path
        d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default InfoOutline;

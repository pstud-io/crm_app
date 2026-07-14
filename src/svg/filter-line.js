import Svg, { Path } from "react-native-svg";
import { Colors, SH } from "../utils";
const FilterLine = ({
  width = SH(20),
  height = SH(20),
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
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M5 10H15M2.5 5H17.5M7.5 15H12.5"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default FilterLine;

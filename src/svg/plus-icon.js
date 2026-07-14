import Svg, { Path } from "react-native-svg";
import { Colors, SH } from "../utils";
const PlusIcon = ({
  width = SH(24),
  height = SH(24),
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
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M12 5V19M5 12H19"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default PlusIcon;

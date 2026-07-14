import Svg, { Path } from "react-native-svg";
import { Colors, SH } from "../utils";

const LocationOutline = ({
  width = SH(14),
  height = SH(16),
  fill = "none",
  stroke = Colors.white,
  strokeWidth = 2,
  style,
  ...props
}) => {
  return (
    <Svg
      viewBox="0 0 14 16"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill={fill}
      style={style}
      {...props}
    >
      <Path
        d="M13 6.66797C13 11.3346 7 15.3346 7 15.3346C7 15.3346 1 11.3346 1 6.66797C1 5.07667 1.63214 3.55055 2.75736 2.42533C3.88258 1.30011 5.4087 0.667969 7 0.667969C8.5913 0.667969 10.1174 1.30011 11.2426 2.42533C12.3679 3.55055 13 5.07667 13 6.66797Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 8.66797C8.10457 8.66797 9 7.77254 9 6.66797C9 5.5634 8.10457 4.66797 7 4.66797C5.89543 4.66797 5 5.5634 5 6.66797C5 7.77254 5.89543 8.66797 7 8.66797Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default LocationOutline;
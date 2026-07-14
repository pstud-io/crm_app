import Svg, { Path } from "react-native-svg";
import { Colors, SH } from "../utils";

const MapOutline = ({
  width = SH(16),
  height = SH(16),
  fill = "none",
  stroke = Colors.white,
  strokeWidth = 2,
  style,
  ...props
}) => {
  return (
    <Svg
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill={fill}
      style={style}
      {...props}
    >
      <Path
        d="M5.33329 11.6667L0.666626 14.3333V3.66667L5.33329 1M5.33329 11.6667L10.6666 14.3333M5.33329 11.6667V1M10.6666 14.3333L15.3333 11.6667V1L10.6666 3.66667M10.6666 14.3333V3.66667M10.6666 3.66667L5.33329 1"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default MapOutline;
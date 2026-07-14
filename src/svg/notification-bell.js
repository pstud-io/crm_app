import Svg, { Path, Rect } from "react-native-svg";
import { Colors, SH } from "../utils";
const NotificationIcon = ({
  width = SH(26),
  height = SH(26),
  fill = "transparent",
  stroke = Colors.white,
  strokeWidth = 1,
  style,
  ...props
}) => {
  return (
    <Svg
      viewBox="0 0 22 22"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      style={style}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    >
      <Path
        d="M9.41211 19.25C9.57302 19.5287 9.80446 19.7601 10.0831 19.921C10.3618 20.0819 10.678 20.1666 10.9998 20.1666C11.3216 20.1666 11.6377 20.0819 11.9164 19.921C12.1951 19.7601 12.4265 19.5287 12.5874 19.25"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2.9895 14.0475C2.86975 14.1788 2.79072 14.342 2.76203 14.5173C2.73334 14.6927 2.75622 14.8726 2.82789 15.0351C2.89957 15.1977 3.01694 15.336 3.16573 15.4331C3.31452 15.5301 3.48833 15.5819 3.666 15.582H18.3327C18.5103 15.5821 18.6842 15.5305 18.833 15.4336C18.9819 15.3367 19.0994 15.1986 19.1713 15.0362C19.2432 14.8737 19.2663 14.6939 19.2378 14.5185C19.2094 14.3432 19.1306 14.1798 19.011 14.0484C17.7918 12.7917 16.4993 11.4561 16.4993 7.33203C16.4993 5.87334 15.9199 4.47439 14.8884 3.44294C13.857 2.41149 12.458 1.83203 10.9993 1.83203C9.54064 1.83203 8.14169 2.41149 7.11024 3.44294C6.07879 4.47439 5.49933 5.87334 5.49933 7.33203C5.49933 11.4561 4.20591 12.7917 2.9895 14.0475Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default NotificationIcon;

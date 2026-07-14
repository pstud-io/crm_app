import Svg, { Path } from "react-native-svg";
import { Colors, SH } from "../utils";
const MusicOutline = ({
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
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill={fill}
      style={style}
      stroke={stroke}
      strokeWidth={2}
    >
      <Path
        d="M97.25 167.75C97.25 178.106 88.8553 186.5 78.5 186.5C68.1447 186.5 59.75 178.106 59.75 167.75C59.75 157.394 68.1447 149 78.5 149C88.8553 149 97.25 157.394 97.25 167.75Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <Path
        d="M172.25 155.25C172.25 165.606 163.856 174 153.5 174C143.144 174 134.75 165.606 134.75 155.25C134.75 144.894 143.144 136.5 153.5 136.5C163.856 136.5 172.25 144.894 172.25 155.25Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <Path d="M97.25 167.75V99" stroke={stroke} strokeWidth={strokeWidth} />
      <Path d="M172.25 155.25V86.5" stroke={stroke} strokeWidth={strokeWidth} />
      <Path
        d="M139.344 72.4666L114.344 80.7999C106.094 83.55 101.968 84.925 99.6089 88.1987C97.2494 91.4722 97.2494 95.8205 97.2494 104.517V123.998C96.1243 84.25 165.5 87 172.249 98.998V96.1837C172.249 80.3558 172.249 72.4419 167.058 68.7004C161.867 64.9588 154.359 67.4614 139.344 72.4666Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Path
        d="M126.45 254.307C56.7255 254.307 0 197.581 0 127.857C0 58.1321 56.7255 1.40659 126.45 1.40659C196.175 1.40659 252.9 58.1321 252.9 127.857C252.9 197.581 196.175 254.307 126.45 254.307ZM126.45 7.02659C59.8249 7.02659 5.62 61.2315 5.62 127.857C5.62 194.482 59.8249 248.687 126.45 248.687C193.075 248.687 247.28 194.482 247.28 127.857C247.28 61.2315 193.075 7.02659 126.45 7.02659Z"
        fill={fill}
      />
    </Svg>
  );
};

export default MusicOutline;

import Svg, { Path } from "react-native-svg";
import { Colors, SH } from "../utils";
const PlayOutline = ({
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
        d="M93.5 68.9375C95.6657 67.6872 98.3343 67.6872 100.5 68.9375L192.935 122.305C195.1 123.555 196.435 125.866 196.435 128.367C196.435 130.868 195.1 133.179 192.935 134.43L100.5 187.797C98.3343 189.047 95.6657 189.047 93.5 187.797C91.3342 186.546 90 184.235 90 181.734V75C90 72.4991 91.3342 70.1879 93.5 68.9375Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Path
        d="M126.45 254.307C56.7255 254.307 0 197.581 0 127.857C0 58.1321 56.7255 1.40659 126.45 1.40659C196.175 1.40659 252.9 58.1321 252.9 127.857C252.9 197.581 196.175 254.307 126.45 254.307ZM126.45 7.02659C59.8249 7.02659 5.62 61.2315 5.62 127.857C5.62 194.482 59.8249 248.687 126.45 248.687C193.075 248.687 247.28 194.482 247.28 127.857C247.28 61.2315 193.075 7.02659 126.45 7.02659Z"
        fill={fill}
      />
    </Svg>
  );
};

export default PlayOutline;

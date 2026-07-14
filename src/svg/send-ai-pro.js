import Svg, {
  Defs,
  FeBlend,
  FeColorMatrix,
  FeFlood,
  FeGaussianBlur,
  FeOffset,
  Filter,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";
import { Colors, SH } from "../utils";
const SendAIPro = ({
  width = SH(32),
  height = SH(32),
  fill = "transparent",
  stroke = Colors.white,
  strokeWidth = 2,
  style,
  ...props
}) => {
  return (
    <Svg
      viewBox="0 0 37 37"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      style={style}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    >
      <G filter="url(#filter0_d_1337_2164)">
        <Rect
          x="2.1001"
          y="1.05005"
          width="32"
          height="32"
          rx="8"
          fill="url(#paint0_linear_1337_2164)"
        />
        <Path
          d="M25.6001 9.55005L17.3501 17.8M25.6001 9.55005L20.3501 24.55L17.3501 17.8M25.6001 9.55005L10.6001 14.8L17.3501 17.8"
          stroke={stroke}
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <Filter
          id="filter0_d_1337_2164"
          x="9.75132e-05"
          y="4.87566e-05"
          width="36.2"
          height="36.2"
          filterUnits="userSpaceOnUse"
        >
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <FeOffset dy="1.05" />
          <FeGaussianBlur stdDeviation="1.05" />
          <FeColorMatrix
            type="matrix"
            values="0 0 0 0 0.0392157 0 0 0 0 0.0496732 0 0 0 0 0.0705882 0 0 0 0.05 0"
          />
          <FeBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1337_2164"
          />
          <FeBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1337_2164"
            result="shape"
          />
        </Filter>
        <LinearGradient
          id="paint0_linear_1337_2164"
          x1="-2.26354"
          y1="1.05005"
          x2="37.8112"
          y2="6.69257"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#3D57EB" />
          <Stop offset="0.543625" stopColor="#753DEC" />
          <Stop offset="1" stopColor="#C02C98" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};

export default SendAIPro;

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
const MicAIPro = ({
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
          d="M23.3501 15.55V17.05C23.3501 18.4424 22.797 19.7778 21.8124 20.7624C20.8278 21.7469 19.4925 22.3 18.1001 22.3M18.1001 22.3C16.7077 22.3 15.3724 21.7469 14.3878 20.7624C13.4032 19.7778 12.8501 18.4424 12.8501 17.05V15.55M18.1001 22.3V25.3M15.1001 25.3H21.1001M18.1001 8.80005C17.5034 8.80005 16.9311 9.0371 16.5091 9.45906C16.0872 9.88102 15.8501 10.4533 15.8501 11.05V17.05C15.8501 17.6468 16.0872 18.2191 16.5091 18.641C16.9311 19.063 17.5034 19.3 18.1001 19.3C18.6968 19.3 19.2691 19.063 19.6911 18.641C20.113 18.2191 20.3501 17.6468 20.3501 17.05V11.05C20.3501 10.4533 20.113 9.88102 19.6911 9.45906C19.2691 9.0371 18.6968 8.80005 18.1001 8.80005Z"
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

export default MicAIPro;

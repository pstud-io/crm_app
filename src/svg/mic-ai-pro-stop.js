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
const MicAIProStop = ({
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
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 37 37"
      width={width}
      height={height}
      style={style}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    >
      <G filter="url(#filter0_d_3810_18726)">
        <Rect
          x="2.1001"
          y="1.04999"
          width="32"
          height="32"
          rx="8"
          fill="url(#paint0_linear_3810_18726)"
        />
        <Path
          d="M20.3501 14.8H15.8501V19.3H20.3501V14.8Z"
          fill="white"
          stroke={stroke}
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M18.1001 24.55C22.2422 24.55 25.6001 21.1921 25.6001 17.05C25.6001 12.9079 22.2422 9.54999 18.1001 9.54999C13.958 9.54999 10.6001 12.9079 10.6001 17.05C10.6001 21.1921 13.958 24.55 18.1001 24.55Z"
          stroke={stroke}
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <Filter
          id="filter0_d_3810_18726"
          x="9.75132e-05"
          y="-1.22786e-05"
          width="36.2"
          height="36.2"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
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
            result="effect1_dropShadow_3810_18726"
          />
          <FeBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_3810_18726"
            result="shape"
          />
        </Filter>
        <LinearGradient
          id="paint0_linear_3810_18726"
          x1="-2.26354"
          y1="1.04999"
          x2="37.8112"
          y2="6.69251"
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

export default MicAIProStop;

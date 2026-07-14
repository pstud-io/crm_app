import Svg, {
  ClipPath,
  Defs,
  FeBlend,
  FeColorMatrix,
  FeFlood,
  FeGaussianBlur,
  FeMorphology,
  FeOffset,
  Filter,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";
import { Colors, SH } from "../utils";
const RocketOutlineB = ({
  width = SH(56),
  height = SH(56),
  fill = "transparent",
  stroke = Colors.white,
  strokeWidth = 2,
  style,
  ...props
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      {...props}
    >
      <Path
        d="M0 8C0 3.58172 3.58172 0 8 0H24C28.4183 0 32 3.58172 32 8V24C32 28.4183 28.4183 32 24 32H8C3.58172 32 0 28.4183 0 24V8Z"
        fill="url(#paint0_linear_4630_1175)"
      />

      <G clipPath="url(#clip0_4630_1175)">
        <Path
          d="M14.6243 18.3366C14.5648 18.1059 14.4445 17.8953 14.276 17.7268C14.1076 17.5584 13.897 17.4381 13.6663 17.3786L9.5763 16.3239C9.50652 16.3041 9.44511 16.2621 9.40138 16.2042C9.35765 16.1463 9.33398 16.0758 9.33398 16.0033C9.33398 15.9307 9.35765 15.8602 9.40138 15.8023C9.44511 15.7444 9.50652 15.7024 9.5763 15.6826L13.6663 14.6273C13.8969 14.5678 14.1074 14.4476 14.2759 14.2793C14.4444 14.1109 14.5647 13.9005 14.6243 13.6699L15.679 9.57993C15.6986 9.50987 15.7406 9.44815 15.7985 9.40419C15.8565 9.36022 15.9272 9.33643 16 9.33643C16.0727 9.33643 16.1435 9.36022 16.2014 9.40419C16.2594 9.44815 16.3014 9.50987 16.321 9.57993L17.375 13.6699C17.4345 13.9006 17.5547 14.1112 17.7232 14.2797C17.8917 14.4481 18.1023 14.5684 18.333 14.6279L22.423 15.6819C22.4933 15.7013 22.5553 15.7433 22.5995 15.8013C22.6437 15.8594 22.6677 15.9303 22.6677 16.0033C22.6677 16.0762 22.6437 16.1472 22.5995 16.2052C22.5553 16.2632 22.4933 16.3052 22.423 16.3246L18.333 17.3786C18.1023 17.4381 17.8917 17.5584 17.7232 17.7268C17.5547 17.8953 17.4345 18.1059 17.375 18.3366L16.3203 22.4266C16.3007 22.4966 16.2587 22.5584 16.2008 22.6023C16.1428 22.6463 16.072 22.6701 15.9993 22.6701C15.9266 22.6701 15.8558 22.6463 15.7978 22.6023C15.7399 22.5584 15.6979 22.4966 15.6783 22.4266L14.6243 18.3366Z"
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <Path
          d="M21.334 10V12.6667"
          stroke="white"
          strokeWidth="0.928869"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <Path
          d="M22.6667 11.3271H20"
          stroke="white"
          strokeWidth="0.928869"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <Path
          d="M10.666 19.3311V20.6644"
          stroke="white"
          strokeWidth="0.928869"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <Path
          d="M11.3333 19.9961H10"
          stroke="white"
          strokeWidth="0.928869"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>

      <Defs>
        <LinearGradient
          id="paint0_linear_4630_1175"
          x1="32"
          y1="32"
          x2="-1.53991"
          y2="30.107"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#9B8779" />
          <Stop offset="1" stopColor="#6B4F3A" />
        </LinearGradient>

        <ClipPath id="clip0_4630_1175">
          <Rect
            width="16"
            height="16"
            fill="white"
            transform="translate(8 8)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default RocketOutlineB;

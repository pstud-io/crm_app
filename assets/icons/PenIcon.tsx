import Svg, { ClipPath, Defs, G, Path, Rect, SvgProps } from "react-native-svg";
const PenIcon = ({
  width,
  height,
  fill,
  stroke,
  strokeWidth,
  style,
  ...props
}: SvgProps) => {
  return (
    <Svg
      width={width}
      height={height}
      fill={fill}
      style={style}
      stroke={stroke}
      strokeWidth={strokeWidth}
      viewBox="0 0 20 20"
    >
      <G clip-path="url(#clip0_4981_20875)">
        <Path
          d="M14.116 4.54126C14.4685 4.18888 14.6665 3.71091 14.6666 3.2125C14.6666 2.71409 14.4687 2.23607 14.1163 1.8836C13.7639 1.53112 13.286 1.33307 12.7876 1.33301C12.2892 1.33295 11.8111 1.53088 11.4587 1.88326L2.56133 10.7826C2.40654 10.9369 2.29207 11.127 2.228 11.3359L1.34733 14.2373C1.3301 14.2949 1.3288 14.3562 1.34356 14.4145C1.35833 14.4728 1.38861 14.5261 1.43119 14.5686C1.47378 14.6111 1.52708 14.6413 1.58544 14.656C1.64379 14.6707 1.70504 14.6693 1.76266 14.6519L4.66466 13.7719C4.87344 13.7084 5.06345 13.5947 5.218 13.4406L14.116 4.54126Z"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_4981_20875">
          <Rect width="16" height="16" fill={fill} />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default PenIcon;

import Svg, { Circle, Path, SvgProps } from "react-native-svg";
const CircleFilledIcon = ({
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
      style={style}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill="none"
      viewBox="0 0 6 6"
    >
      <Circle cx="3" cy="3" r="3" fill={fill} />
    </Svg>
  );
};

export default CircleFilledIcon;

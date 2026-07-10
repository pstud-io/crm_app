import Svg, { Path, SvgProps } from "react-native-svg";
const PlusIcon = ({
  width,
  height,
  fill,
  stroke,
  strokeWidth,
  style,
}: SvgProps) => {
  return (
    <Svg
      width={width}
      height={height}
      fill={fill}
      style={style}
      stroke={stroke}
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
    >
      <Path
        d="M12 5V19M5 12H19"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default PlusIcon;

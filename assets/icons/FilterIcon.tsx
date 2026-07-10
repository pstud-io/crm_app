import Svg, { Path, SvgProps } from "react-native-svg";
const FilterIcon = ({
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
      viewBox="0 0 20 20"
    >
      <Path
        d="M5 10H15M2.5 5H17.5M7.5 15H12.5"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default FilterIcon;

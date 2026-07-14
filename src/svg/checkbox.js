import Svg, { Path, Rect } from "react-native-svg";
import { Colors, SH } from "../utils";
import { primaryColors } from "../components/UI/DesignSystem/colorPalette";
const Checkbox = ({
  width = SH(16),
  height = SH(16),
  fill = "transparent",
  stroke = Colors.black_text_color,
  strokeWidth = 1,
  style,
  isSelected,
  ...props
}) => {
  return (
    <Svg
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill={fill}
      style={style}
      stroke={stroke}
      strokeWidth={strokeWidth}
    >
      {isSelected ? (
        <>
          <Path
            d="M5 0.5H11C13.4853 0.5 15.5 2.51472 15.5 5V11C15.5 13.4853 13.4853 15.5 11 15.5H5C2.51472 15.5 0.5 13.4853 0.5 11V5C0.5 2.51472 2.51472 0.5 5 0.5Z"
            fill={primaryColors.gray[100]}
            stroke={primaryColors.brand[1000]}
          />
          <Path
            d="M11.875 5.77344L7.23438 10.4141L5.125 8.30469"
            stroke={primaryColors.brand[1000]}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <Path
          d="M5 0.5H11C13.4853 0.5 15.5 2.51472 15.5 5V11C15.5 13.4853 13.4853 15.5 11 15.5H5C2.51472 15.5 0.5 13.4853 0.5 11V5C0.5 2.51472 2.51472 0.5 5 0.5Z"
          stroke={stroke}
        />
      )}
    </Svg>
  );
};

export default Checkbox;

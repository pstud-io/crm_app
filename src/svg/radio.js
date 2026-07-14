import Svg, { Path, Circle } from "react-native-svg";
import { Colors, SW } from "../utils";
import { primaryColors } from "../components/UI/DesignSystem/colorPalette";
const Radio = ({
  width = SW(32),
  height = SH(32),
  stroke = Colors.white,
  strokeWidth = 2,
  selected,
  style,
  ...props
}) => {
  return (
    <Svg
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      style={style}
    >
      {selected ? (
        <>
          <Path
            d="M8 0.5C12.1421 0.5 15.5 3.85786 15.5 8C15.5 12.1421 12.1421 15.5 8 15.5C3.85786 15.5 0.5 12.1421 0.5 8C0.5 3.85786 3.85786 0.5 8 0.5Z"
            fill={Colors.white}
            stroke={primaryColors.brand[1000]}
            strokeWidth={strokeWidth}
          />
          <Circle
            cx="8"
            cy="8"
            r={height / 4}
            fill={primaryColors.brand[1000]}
          />
        </>
      ) : (
        <Path
          d="M8 0.5C12.1421 0.5 15.5 3.85786 15.5 8C15.5 12.1421 12.1421 15.5 8 15.5C3.85786 15.5 0.5 12.1421 0.5 8C0.5 3.85786 3.85786 0.5 8 0.5Z"
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill={"transparent"}
        />
      )}
    </Svg>
  );
};

export default Radio;

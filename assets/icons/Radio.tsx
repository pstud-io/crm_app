import Svg, { Path, Circle, SvgProps } from "react-native-svg";
import { primaryColors } from "@/design/colors";
const Radio = ({
  width = 32,
  height = 32,
  stroke = "white",
  strokeWidth = 2,
  selected,
  style,
  ...props
}: { selected: boolean | undefined } & SvgProps) => {
  return (
    <Svg viewBox="0 0 16 16" width={width} height={height} style={style}>
      {selected ? (
        <>
          <Path
            d="M8 0.5C12.1421 0.5 15.5 3.85786 15.5 8C15.5 12.1421 12.1421 15.5 8 15.5C3.85786 15.5 0.5 12.1421 0.5 8C0.5 3.85786 3.85786 0.5 8 0.5Z"
            fill={"white"}
            stroke={primaryColors.brand[900]}
            strokeWidth={strokeWidth}
          />
          <Circle
            cx="8"
            cy="8"
            r={(height as number) / 4}
            fill={primaryColors.brand[900]}
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

import Svg, { Path } from "react-native-svg";
import { Colors, SH } from "../utils";
import { primaryColors } from "../components/UI/DesignSystem/colorPalette";
const Trolley = ({
  width = SH(22),
  height = SH(22),
  fill = "transparent",
  stroke = primaryColors.brand[1000],
  strokeWidth = 2,
  style,
  ...props
}) => {
  return (
    <Svg
      viewBox="0 -960 960 960"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      style={style}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    >
      <Path d="M180-280v-480H90v-60h150v480h600v60H180Zm68.85 177.69q-28.77 0-49-20.23t-20.23-49q0-28.77 20.23-49t49-20.23q28.77 0 49 20.23t20.23 49q0 28.77-20.23 49t-49 20.23Zm46.54-293.07v-209.23h209.22v209.23H295.39Zm59.99-60h89.24v-89.23h-89.24v89.23Zm220.01 60v-209.23h209.22v209.23H575.39Zm59.99-60h89.24v-89.23h-89.24v89.23Zm86.2 332.84q-20.04-20.23-20.04-49t20.04-49q20.04-20.23 48.77-20.23 28.73 0 49.19 20.23 20.46 20.23 20.46 49t-20.46 49q-20.46 20.23-49.19 20.23-28.73 0-48.77-20.23Zm-366.2-332.84h89.24-89.24Zm280 0h89.24-89.24Z" />
    </Svg>
  );
};

export default Trolley;

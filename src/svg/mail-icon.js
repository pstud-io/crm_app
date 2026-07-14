import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";
import { Colors, SH } from "../utils";
const MailIcon = ({
  width = SH(20),
  height = SH(20),
  fill = "transparent",
  stroke = Colors.white,
  strokeWidth = 2,
  style,
  ...props
}) => {
  return (
    <Svg
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      style={style}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    >
      <Path
        d="M18.3332 5.00004C18.3332 4.08337 17.5832 3.33337 16.6665 3.33337H3.33317C2.4165 3.33337 1.6665 4.08337 1.6665 5.00004M18.3332 5.00004V15C18.3332 15.9167 17.5832 16.6667 16.6665 16.6667H3.33317C2.4165 16.6667 1.6665 15.9167 1.6665 15V5.00004M18.3332 5.00004L9.99984 10.8334L1.6665 5.00004"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default MailIcon;

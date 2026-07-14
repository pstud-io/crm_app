import Svg, { Path } from "react-native-svg";
import { Colors, SH } from "../utils";
const VideoShutterOutline = ({
  width = SH(32),
  height = SH(32),
  fill = Colors.white,
  stroke = Colors.white,
  strokeWidth = 2,
  style,
  ...props
}) => {
  return (
    <Svg
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill={fill}
      style={style}
      stroke={stroke}
      strokeWidth={strokeWidth}
    >
      <Path
        d="M134 80.2999H68C57.8 80.2999 50 88.0999 50 98.2999V158.3C50 168.5 57.8 176.3 68 176.3H134C144.2 176.3 152 168.5 152 158.3V98.2999C152 88.0999 144.2 80.2999 134 80.2999Z"
        fill="white"
      />
      <Path
        d="M203 80.9C201.2 79.7 198.8 79.7 197 80.9L167 98.9C165.2 100.1 164 101.9 164 104.3V152.3C164 154.7 165.2 156.5 167 157.7L197 175.7C197.6 176.3 198.8 176.3 200 176.3C201.2 176.3 201.8 176.3 203 175.7C204.8 174.5 206 172.7 206 170.3V86.3C206 83.9 204.8 82.1 203 80.9Z"
        fill="white"
      />
      <Path
        d="M127.857 254.307C58.1321 254.307 1.40662 197.581 1.40662 127.857C1.40662 58.1321 58.1321 1.40659 127.857 1.40659C197.581 1.40659 254.307 58.1321 254.307 127.857C254.307 197.581 197.581 254.307 127.857 254.307ZM127.857 7.02659C61.2315 7.02659 7.02662 61.2315 7.02662 127.857C7.02662 194.482 61.2315 248.687 127.857 248.687C194.482 248.687 248.687 194.482 248.687 127.857C248.687 61.2315 194.482 7.02659 127.857 7.02659Z"
        fill="white"
      />
    </Svg>
  );
};

export default VideoShutterOutline;

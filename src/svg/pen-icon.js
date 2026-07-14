import Svg, { Path } from "react-native-svg";
import { Colors, SH } from "../utils";
const PenIcon = ({
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
      width={width}
      height={height}
      fill={fill}
      style={style}
      stroke={stroke}
      strokeWidth={strokeWidth}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M13.0892 17.7442C12.9329 17.9004 12.721 17.9882 12.5 17.9882C12.279 17.9882 12.0671 17.9004 11.9108 17.7442L10.5892 16.4225C10.4329 16.2663 10.3452 16.0543 10.3452 15.8334C10.3452 15.6124 10.4329 15.4005 10.5892 15.2442L15.2442 10.5892C15.4004 10.433 15.6124 10.3452 15.8333 10.3452C16.0543 10.3452 16.2662 10.433 16.4225 10.5892L17.7442 11.9109C17.9004 12.0671 17.9882 12.2791 17.9882 12.5C17.9882 12.721 17.9004 12.9329 17.7442 13.0892L13.0892 17.7442Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15 10.8333L13.8542 5.10496C13.823 4.94911 13.7479 4.80543 13.6378 4.69085C13.5276 4.57627 13.387 4.49558 13.2325 4.4583L2.69583 1.68996C2.55702 1.6564 2.41191 1.65908 2.27443 1.69773C2.13695 1.73639 2.01172 1.80972 1.91073 1.9107C1.80975 2.01169 1.73642 2.13692 1.69776 2.2744C1.65911 2.41188 1.65643 2.55699 1.68999 2.6958L4.45833 13.2325C4.49561 13.387 4.5763 13.5276 4.69088 13.6377C4.80546 13.7479 4.94914 13.823 5.105 13.8541L10.8333 15"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M1.91666 1.91663L7.98832 7.98829"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.16667 10.8333C10.0871 10.8333 10.8333 10.0871 10.8333 9.16667C10.8333 8.24619 10.0871 7.5 9.16667 7.5C8.24619 7.5 7.5 8.24619 7.5 9.16667C7.5 10.0871 8.24619 10.8333 9.16667 10.8333Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default PenIcon;

import Svg, { Path, Rect, SvgProps } from "react-native-svg";
const FileIcon = ({
  width,
  height,
  fill,
  stroke,
  strokeWidth,
  style,
}: SvgProps) => {
  return (
    <Svg
      viewBox="0 0 20 20"
      width={width}
      height={height}
      style={style}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    >
      <Path
        d="M11.6666 1.66666H4.99998C4.55795 1.66666 4.13403 1.84225 3.82147 2.15481C3.50891 2.46737 3.33331 2.8913 3.33331 3.33332V16.6667C3.33331 17.1087 3.50891 17.5326 3.82147 17.8452C4.13403 18.1577 4.55795 18.3333 4.99998 18.3333H15C15.442 18.3333 15.8659 18.1577 16.1785 17.8452C16.4911 17.5326 16.6666 17.1087 16.6666 16.6667V6.66666M11.6666 1.66666L16.6666 6.66666M11.6666 1.66666V6.66666H16.6666M13.3333 10.8333H6.66665M13.3333 14.1667H6.66665M8.33331 7.49999H6.66665"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default FileIcon;

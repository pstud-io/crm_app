export type InterFontFamily =
  | "Inter-Black"
  | "Inter-Bold"
  | "Inter-ExtraBold"
  | "Inter-ExtraLight"
  | "Inter-Light"
  | "Inter-Medium"
  | "Inter-Regular"
  | "Inter-SemiBold"
  | "Inter-Thin";

type TypographyWeight =
  | "thin"
  | "extraLight"
  | "light"
  | "regular"
  | "medium"
  | "semiBold"
  | "bold"
  | "extraBold"
  | "black";

type TypographySize = "xxl" | "xl" | "lg" | "md" | "sm" | "xs" | "xxs";

export type FontFamily = InterFontFamily;

export interface TypographyValues {
  fontFamily: FontFamily;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
}

export type HeadingTypography = Record<
  TypographySize,
  Record<TypographyWeight, TypographyValues>
>;

export type BodyTypography = Record<
  TypographySize,
  Record<TypographyWeight, TypographyValues>
>;

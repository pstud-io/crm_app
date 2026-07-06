export type BorderRadiusKeys =
  | "none"
  | "min"
  | "tiny"
  | "xxs"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "xxl"
  | "huge"
  | "max"
  | "full";

export type BorderRadius = Record<BorderRadiusKeys, number>;

export type BorderWidthKeys =
  | "none"
  | "hw"
  | "thin"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "thick";

export type BorderWidth = Record<BorderWidthKeys, number>;

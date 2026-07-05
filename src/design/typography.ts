import { BodyTypography, HeadingTypography } from "@/types/typhographyTypes";

function letterSpacingFromPercent(
  fontSize: number,
  letterSpacingPercent: number,
): number {
  return (letterSpacingPercent / 100) * fontSize;
}

export const heading: HeadingTypography = {
  xxl: {
    thin: {
      fontFamily: "Inter-Thin", // change based on weight
      fontSize: 72,
      lineHeight: 90,
      letterSpacing: letterSpacingFromPercent(72, -2),
    },
    extraLight: {
      fontFamily: "Inter-ExtraLight", // change based on weight
      fontSize: 72,
      lineHeight: 90,
      letterSpacing: letterSpacingFromPercent(72, -2),
    },
    light: {
      fontFamily: "Inter-Light", // change based on weight
      fontSize: 72,
      lineHeight: 90,
      letterSpacing: letterSpacingFromPercent(72, -2),
    },
    regular: {
      fontFamily: "Inter-Regular", // change based on weight
      fontSize: 72,
      lineHeight: 90,
      letterSpacing: letterSpacingFromPercent(72, -2),
    },
    medium: {
      fontFamily: "Inter-Medium", // change based on weight
      fontSize: 72,
      lineHeight: 90,
      letterSpacing: letterSpacingFromPercent(72, -2),
    },
    semiBold: {
      fontFamily: "Inter-SemiBold", // change based on weight
      fontSize: 72,
      lineHeight: 90,
      letterSpacing: letterSpacingFromPercent(72, -2),
    },
    bold: {
      fontFamily: "Inter-Bold", // change based on weight
      fontSize: 72,
      lineHeight: 90,
      letterSpacing: letterSpacingFromPercent(72, -2),
    },
    extraBold: {
      fontFamily: "Inter-ExtraBold", // change based on weight
      fontSize: 72,
      lineHeight: 90,
      letterSpacing: letterSpacingFromPercent(72, -2),
    },
    black: {
      fontFamily: "Inter-Black", // change based on weight
      fontSize: 72,
      lineHeight: 90,
      letterSpacing: letterSpacingFromPercent(72, -2),
    },
  },
  xl: {
    thin: {
      fontFamily: "Inter-Thin", // change based on weight
      fontSize: 60,
      lineHeight: 72,
      letterSpacing: letterSpacingFromPercent(60, -2),
    },
    extraLight: {
      fontFamily: "Inter-ExtraLight", // change based on weight
      fontSize: 60,
      lineHeight: 72,
      letterSpacing: letterSpacingFromPercent(60, -2),
    },
    light: {
      fontFamily: "Inter-Light", // change based on weight
      fontSize: 60,
      lineHeight: 72,
      letterSpacing: letterSpacingFromPercent(60, -2),
    },
    regular: {
      fontFamily: "Inter-Regular", // change based on weight
      fontSize: 60,
      lineHeight: 72,
      letterSpacing: letterSpacingFromPercent(60, -2),
    },
    medium: {
      fontFamily: "Inter-Medium", // change based on weight
      fontSize: 60,
      lineHeight: 72,
      letterSpacing: letterSpacingFromPercent(60, -2),
    },
    semiBold: {
      fontFamily: "Inter-SemiBold", // change based on weight
      fontSize: 60,
      lineHeight: 72,
      letterSpacing: letterSpacingFromPercent(60, -2),
    },
    bold: {
      fontFamily: "Inter-Bold", // change based on weight
      fontSize: 60,
      lineHeight: 72,
      letterSpacing: letterSpacingFromPercent(60, -2),
    },
    extraBold: {
      fontFamily: "Inter-ExtraBold", // change based on weight
      fontSize: 60,
      lineHeight: 72,
      letterSpacing: letterSpacingFromPercent(60, -2),
    },
    black: {
      fontFamily: "Inter-Black", // change based on weight
      fontSize: 60,
      lineHeight: 72,
      letterSpacing: letterSpacingFromPercent(60, -2),
    },
  },
  lg: {
    thin: {
      fontFamily: "Inter-Thin", // change based on weight
      fontSize: 48,
      lineHeight: 60,
      letterSpacing: letterSpacingFromPercent(48, -2),
    },
    extraLight: {
      fontFamily: "Inter-ExtraLight", // change based on weight
      fontSize: 48,
      lineHeight: 60,
      letterSpacing: letterSpacingFromPercent(48, -2),
    },
    light: {
      fontFamily: "Inter-Light", // change based on weight
      fontSize: 48,
      lineHeight: 60,
      letterSpacing: letterSpacingFromPercent(48, -2),
    },
    regular: {
      fontFamily: "Inter-Regular", // change based on weight
      fontSize: 48,
      lineHeight: 60,
      letterSpacing: letterSpacingFromPercent(48, -2),
    },
    medium: {
      fontFamily: "Inter-Medium", // change based on weight
      fontSize: 48,
      lineHeight: 60,
      letterSpacing: letterSpacingFromPercent(48, -2),
    },
    semiBold: {
      fontFamily: "Inter-SemiBold", // change based on weight
      fontSize: 48,
      lineHeight: 60,
      letterSpacing: letterSpacingFromPercent(48, -2),
    },
    bold: {
      fontFamily: "Inter-Bold", // change based on weight
      fontSize: 48,
      lineHeight: 60,
      letterSpacing: letterSpacingFromPercent(48, -2),
    },
    extraBold: {
      fontFamily: "Inter-ExtraBold", // change based on weight
      fontSize: 48,
      lineHeight: 60,
      letterSpacing: letterSpacingFromPercent(48, -2),
    },
    black: {
      fontFamily: "Inter-Black", // change based on weight
      fontSize: 48,
      lineHeight: 60,
      letterSpacing: letterSpacingFromPercent(48, -2),
    },
  },
  md: {
    thin: {
      fontFamily: "Inter-Thin", // change based on weight
      fontSize: 36,
      lineHeight: 48,
      letterSpacing: letterSpacingFromPercent(36, -2),
    },
    extraLight: {
      fontFamily: "Inter-ExtraLight", // change based on weight
      fontSize: 36,
      lineHeight: 48,
      letterSpacing: letterSpacingFromPercent(36, -2),
    },
    light: {
      fontFamily: "Inter-Light", // change based on weight
      fontSize: 36,
      lineHeight: 48,
      letterSpacing: letterSpacingFromPercent(36, -2),
    },
    regular: {
      fontFamily: "Inter-Regular", // change based on weight
      fontSize: 36,
      lineHeight: 48,
      letterSpacing: letterSpacingFromPercent(36, -2),
    },
    medium: {
      fontFamily: "Inter-Medium", // change based on weight
      fontSize: 36,
      lineHeight: 48,
      letterSpacing: letterSpacingFromPercent(36, -2),
    },
    semiBold: {
      fontFamily: "Inter-SemiBold", // change based on weight
      fontSize: 36,
      lineHeight: 48,
      letterSpacing: letterSpacingFromPercent(36, -2),
    },
    bold: {
      fontFamily: "Inter-Bold", // change based on weight
      fontSize: 36,
      lineHeight: 48,
      letterSpacing: letterSpacingFromPercent(36, -2),
    },
    extraBold: {
      fontFamily: "Inter-ExtraBold", // change based on weight
      fontSize: 36,
      lineHeight: 48,
      letterSpacing: letterSpacingFromPercent(36, -2),
    },
    black: {
      fontFamily: "Inter-Black", // change based on weight
      fontSize: 36,
      lineHeight: 48,
      letterSpacing: letterSpacingFromPercent(36, -2),
    },
  },
  sm: {
    thin: {
      fontFamily: "Inter-Thin", // change based on weight
      fontSize: 30,
      lineHeight: 40,
      letterSpacing: letterSpacingFromPercent(30, -2),
    },
    extraLight: {
      fontFamily: "Inter-ExtraLight", // change based on weight
      fontSize: 30,
      lineHeight: 40,
      letterSpacing: letterSpacingFromPercent(30, -2),
    },
    light: {
      fontFamily: "Inter-Light", // change based on weight
      fontSize: 30,
      lineHeight: 40,
      letterSpacing: letterSpacingFromPercent(30, -2),
    },
    regular: {
      fontFamily: "Inter-Regular", // change based on weight
      fontSize: 30,
      lineHeight: 40,
      letterSpacing: letterSpacingFromPercent(30, -2),
    },
    medium: {
      fontFamily: "Inter-Medium", // change based on weight
      fontSize: 30,
      lineHeight: 40,
      letterSpacing: letterSpacingFromPercent(30, -2),
    },
    semiBold: {
      fontFamily: "Inter-SemiBold", // change based on weight
      fontSize: 30,
      lineHeight: 40,
      letterSpacing: letterSpacingFromPercent(30, -2),
    },
    bold: {
      fontFamily: "Inter-Bold", // change based on weight
      fontSize: 30,
      lineHeight: 40,
      letterSpacing: letterSpacingFromPercent(30, -2),
    },
    extraBold: {
      fontFamily: "Inter-ExtraBold", // change based on weight
      fontSize: 30,
      lineHeight: 40,
      letterSpacing: letterSpacingFromPercent(30, -2),
    },
    black: {
      fontFamily: "Inter-Black", // change based on weight
      fontSize: 30,
      lineHeight: 40,
      letterSpacing: letterSpacingFromPercent(30, -2),
    },
  },
  xs: {
    thin: {
      fontFamily: "Inter-Thin", // change based on weight
      fontSize: 24,
      lineHeight: 32,
      letterSpacing: letterSpacingFromPercent(24, -2),
    },
    extraLight: {
      fontFamily: "Inter-ExtraLight", // change based on weight
      fontSize: 24,
      lineHeight: 32,
      letterSpacing: letterSpacingFromPercent(24, -2),
    },
    light: {
      fontFamily: "Inter-Light", // change based on weight
      fontSize: 24,
      lineHeight: 32,
      letterSpacing: letterSpacingFromPercent(24, -2),
    },
    regular: {
      fontFamily: "Inter-Regular", // change based on weight
      fontSize: 24,
      lineHeight: 32,
      letterSpacing: letterSpacingFromPercent(24, -2),
    },
    medium: {
      fontFamily: "Inter-Medium", // change based on weight
      fontSize: 24,
      lineHeight: 32,
      letterSpacing: letterSpacingFromPercent(24, -2),
    },
    semiBold: {
      fontFamily: "Inter-SemiBold", // change based on weight
      fontSize: 24,
      lineHeight: 32,
      letterSpacing: letterSpacingFromPercent(24, -2),
    },
    bold: {
      fontFamily: "Inter-Bold", // change based on weight
      fontSize: 24,
      lineHeight: 32,
      letterSpacing: letterSpacingFromPercent(24, -2),
    },
    extraBold: {
      fontFamily: "Inter-ExtraBold", // change based on weight
      fontSize: 24,
      lineHeight: 32,
      letterSpacing: letterSpacingFromPercent(24, -2),
    },
    black: {
      fontFamily: "Inter-Black", // change based on weight
      fontSize: 24,
      lineHeight: 32,
      letterSpacing: letterSpacingFromPercent(24, -2),
    },
  },
  xxs: {
    thin: {
      fontFamily: "Inter-Thin", // change based on weight
      fontSize: 22,
      lineHeight: 28,
      letterSpacing: letterSpacingFromPercent(22, -2),
    },
    extraLight: {
      fontFamily: "Inter-ExtraLight", // change based on weight
      fontSize: 22,
      lineHeight: 28,
      letterSpacing: letterSpacingFromPercent(22, -2),
    },
    light: {
      fontFamily: "Inter-Light", // change based on weight
      fontSize: 22,
      lineHeight: 28,
      letterSpacing: letterSpacingFromPercent(22, -2),
    },
    regular: {
      fontFamily: "Inter-Regular", // change based on weight
      fontSize: 22,
      lineHeight: 28,
      letterSpacing: letterSpacingFromPercent(22, -2),
    },
    medium: {
      fontFamily: "Inter-Medium", // change based on weight
      fontSize: 22,
      lineHeight: 28,
      letterSpacing: letterSpacingFromPercent(22, -2),
    },
    semiBold: {
      fontFamily: "Inter-SemiBold", // change based on weight
      fontSize: 22,
      lineHeight: 28,
      letterSpacing: letterSpacingFromPercent(22, -2),
    },
    bold: {
      fontFamily: "Inter-Bold", // change based on weight
      fontSize: 22,
      lineHeight: 28,
      letterSpacing: letterSpacingFromPercent(22, -2),
    },
    extraBold: {
      fontFamily: "Inter-ExtraBold", // change based on weight
      fontSize: 22,
      lineHeight: 28,
      letterSpacing: letterSpacingFromPercent(22, -2),
    },
    black: {
      fontFamily: "Inter-Black", // change based on weight
      fontSize: 22,
      lineHeight: 28,
      letterSpacing: letterSpacingFromPercent(22, -2),
    },
  },
} as const satisfies HeadingTypography;

export const body = {
  xxl: {
    thin: {
      fontFamily: "Inter-Thin", // change based on weight
      fontSize: 22,
      lineHeight: 28,
      letterSpacing: letterSpacingFromPercent(22, -2),
    },
    extraLight: {
      fontFamily: "Inter-ExtraLight", // change based on weight
      fontSize: 22,
      lineHeight: 28,
      letterSpacing: letterSpacingFromPercent(22, -2),
    },
    light: {
      fontFamily: "Inter-Light", // change based on weight
      fontSize: 22,
      lineHeight: 28,
      letterSpacing: letterSpacingFromPercent(22, -2),
    },
    regular: {
      fontFamily: "Inter-Regular", // change based on weight
      fontSize: 22,
      lineHeight: 28,
      letterSpacing: letterSpacingFromPercent(22, -2),
    },
    medium: {
      fontFamily: "Inter-Medium", // change based on weight
      fontSize: 22,
      lineHeight: 28,
      letterSpacing: letterSpacingFromPercent(22, -2),
    },
    semiBold: {
      fontFamily: "Inter-SemiBold", // change based on weight
      fontSize: 22,
      lineHeight: 28,
      letterSpacing: letterSpacingFromPercent(22, -2),
    },
    bold: {
      fontFamily: "Inter-Bold", // change based on weight
      fontSize: 22,
      lineHeight: 28,
      letterSpacing: letterSpacingFromPercent(22, -2),
    },
    extraBold: {
      fontFamily: "Inter-ExtraBold", // change based on weight
      fontSize: 22,
      lineHeight: 28,
      letterSpacing: letterSpacingFromPercent(22, -2),
    },
    black: {
      fontFamily: "Inter-Black", // change based on weight
      fontSize: 22,
      lineHeight: 28,
      letterSpacing: letterSpacingFromPercent(22, -2),
    },
  },
  xl: {
    thin: {
      fontFamily: "Inter-Thin", // change based on weight
      fontSize: 20,
      lineHeight: 26,
      letterSpacing: letterSpacingFromPercent(20, -2),
    },
    extraLight: {
      fontFamily: "Inter-ExtraLight", // change based on weight
      fontSize: 20,
      lineHeight: 26,
      letterSpacing: letterSpacingFromPercent(20, -2),
    },
    light: {
      fontFamily: "Inter-Light", // change based on weight
      fontSize: 20,
      lineHeight: 26,
      letterSpacing: letterSpacingFromPercent(20, -2),
    },
    regular: {
      fontFamily: "Inter-Regular", // change based on weight
      fontSize: 20,
      lineHeight: 26,
      letterSpacing: letterSpacingFromPercent(20, -2),
    },
    medium: {
      fontFamily: "Inter-Medium", // change based on weight
      fontSize: 20,
      lineHeight: 26,
      letterSpacing: letterSpacingFromPercent(20, -2),
    },
    semiBold: {
      fontFamily: "Inter-SemiBold", // change based on weight
      fontSize: 20,
      lineHeight: 26,
      letterSpacing: letterSpacingFromPercent(20, -2),
    },
    bold: {
      fontFamily: "Inter-Bold", // change based on weight
      fontSize: 20,
      lineHeight: 26,
      letterSpacing: letterSpacingFromPercent(20, -2),
    },
    extraBold: {
      fontFamily: "Inter-ExtraBold", // change based on weight
      fontSize: 20,
      lineHeight: 26,
      letterSpacing: letterSpacingFromPercent(20, -2),
    },
    black: {
      fontFamily: "Inter-Black", // change based on weight
      fontSize: 20,
      lineHeight: 26,
      letterSpacing: letterSpacingFromPercent(20, -2),
    },
  },
  lg: {
    thin: {
      fontFamily: "Inter-Thin", // change based on weight
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: letterSpacingFromPercent(18, -2),
    },
    extraLight: {
      fontFamily: "Inter-ExtraLight", // change based on weight
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: letterSpacingFromPercent(18, -2),
    },
    light: {
      fontFamily: "Inter-Light", // change based on weight
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: letterSpacingFromPercent(18, -2),
    },
    regular: {
      fontFamily: "Inter-Regular", // change based on weight
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: letterSpacingFromPercent(18, -2),
    },
    medium: {
      fontFamily: "Inter-Medium", // change based on weight
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: letterSpacingFromPercent(18, -2),
    },
    semiBold: {
      fontFamily: "Inter-SemiBold", // change based on weight
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: letterSpacingFromPercent(18, -2),
    },
    bold: {
      fontFamily: "Inter-Bold", // change based on weight
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: letterSpacingFromPercent(18, -2),
    },
    extraBold: {
      fontFamily: "Inter-ExtraBold", // change based on weight
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: letterSpacingFromPercent(18, -2),
    },
    black: {
      fontFamily: "Inter-Black", // change based on weight
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: letterSpacingFromPercent(18, -2),
    },
  },
  md: {
    thin: {
      fontFamily: "Inter-Thin", // change based on weight
      fontSize: 16,
      lineHeight: 18,
      letterSpacing: letterSpacingFromPercent(16, -2),
    },
    extraLight: {
      fontFamily: "Inter-ExtraLight", // change based on weight
      fontSize: 16,
      lineHeight: 18,
      letterSpacing: letterSpacingFromPercent(16, -2),
    },
    light: {
      fontFamily: "Inter-Light", // change based on weight
      fontSize: 16,
      lineHeight: 18,
      letterSpacing: letterSpacingFromPercent(16, -2),
    },
    regular: {
      fontFamily: "Inter-Regular", // change based on weight
      fontSize: 16,
      lineHeight: 18,
      letterSpacing: letterSpacingFromPercent(16, -2),
    },
    medium: {
      fontFamily: "Inter-Medium", // change based on weight
      fontSize: 16,
      lineHeight: 18,
      letterSpacing: letterSpacingFromPercent(16, -2),
    },
    semiBold: {
      fontFamily: "Inter-SemiBold", // change based on weight
      fontSize: 16,
      lineHeight: 18,
      letterSpacing: letterSpacingFromPercent(16, -2),
    },
    bold: {
      fontFamily: "Inter-Bold", // change based on weight
      fontSize: 16,
      lineHeight: 18,
      letterSpacing: letterSpacingFromPercent(16, -2),
    },
    extraBold: {
      fontFamily: "Inter-ExtraBold", // change based on weight
      fontSize: 16,
      lineHeight: 18,
      letterSpacing: letterSpacingFromPercent(16, -2),
    },
    black: {
      fontFamily: "Inter-Black", // change based on weight
      fontSize: 16,
      lineHeight: 18,
      letterSpacing: letterSpacingFromPercent(16, -2),
    },
  },
  sm: {
    thin: {
      fontFamily: "Inter-Thin", // change based on weight
      fontSize: 14,
      lineHeight: 17,
      letterSpacing: letterSpacingFromPercent(14, -2),
    },
    extraLight: {
      fontFamily: "Inter-ExtraLight", // change based on weight
      fontSize: 14,
      lineHeight: 17,
      letterSpacing: letterSpacingFromPercent(14, -2),
    },
    light: {
      fontFamily: "Inter-Light", // change based on weight
      fontSize: 14,
      lineHeight: 17,
      letterSpacing: letterSpacingFromPercent(14, -2),
    },
    regular: {
      fontFamily: "Inter-Regular", // change based on weight
      fontSize: 14,
      lineHeight: 17,
      letterSpacing: letterSpacingFromPercent(14, -2),
    },
    medium: {
      fontFamily: "Inter-Medium", // change based on weight
      fontSize: 14,
      lineHeight: 17,
      letterSpacing: letterSpacingFromPercent(14, -2),
    },
    semiBold: {
      fontFamily: "Inter-SemiBold", // change based on weight
      fontSize: 14,
      lineHeight: 17,
      letterSpacing: letterSpacingFromPercent(14, -2),
    },
    bold: {
      fontFamily: "Inter-Bold", // change based on weight
      fontSize: 14,
      lineHeight: 17,
      letterSpacing: letterSpacingFromPercent(14, -2),
    },
    extraBold: {
      fontFamily: "Inter-ExtraBold", // change based on weight
      fontSize: 14,
      lineHeight: 17,
      letterSpacing: letterSpacingFromPercent(14, -2),
    },
    black: {
      fontFamily: "Inter-Black", // change based on weight
      fontSize: 14,
      lineHeight: 17,
      letterSpacing: letterSpacingFromPercent(14, -2),
    },
  },
  xs: {
    thin: {
      fontFamily: "Inter-Thin", // change based on weight
      fontSize: 12,
      lineHeight: 15,
      letterSpacing: letterSpacingFromPercent(12, -2),
    },
    extraLight: {
      fontFamily: "Inter-ExtraLight", // change based on weight
      fontSize: 12,
      lineHeight: 15,
      letterSpacing: letterSpacingFromPercent(12, -2),
    },
    light: {
      fontFamily: "Inter-Light", // change based on weight
      fontSize: 12,
      lineHeight: 15,
      letterSpacing: letterSpacingFromPercent(12, -2),
    },
    regular: {
      fontFamily: "Inter-Regular", // change based on weight
      fontSize: 12,
      lineHeight: 15,
      letterSpacing: letterSpacingFromPercent(12, -2),
    },
    medium: {
      fontFamily: "Inter-Medium", // change based on weight
      fontSize: 12,
      lineHeight: 15,
      letterSpacing: letterSpacingFromPercent(12, -2),
    },
    semiBold: {
      fontFamily: "Inter-SemiBold", // change based on weight
      fontSize: 12,
      lineHeight: 15,
      letterSpacing: letterSpacingFromPercent(12, -2),
    },
    bold: {
      fontFamily: "Inter-Bold", // change based on weight
      fontSize: 12,
      lineHeight: 15,
      letterSpacing: letterSpacingFromPercent(12, -2),
    },
    extraBold: {
      fontFamily: "Inter-ExtraBold", // change based on weight
      fontSize: 12,
      lineHeight: 15,
      letterSpacing: letterSpacingFromPercent(12, -2),
    },
    black: {
      fontFamily: "Inter-Black", // change based on weight
      fontSize: 12,
      lineHeight: 15,
      letterSpacing: letterSpacingFromPercent(12, -2),
    },
  },
  xxs: {
    thin: {
      fontFamily: "Inter-Thin", // change based on weight
      fontSize: 10,
      lineHeight: 14,
      letterSpacing: letterSpacingFromPercent(10, -2),
    },
    extraLight: {
      fontFamily: "Inter-ExtraLight", // change based on weight
      fontSize: 10,
      lineHeight: 14,
      letterSpacing: letterSpacingFromPercent(10, -2),
    },
    light: {
      fontFamily: "Inter-Light", // change based on weight
      fontSize: 10,
      lineHeight: 14,
      letterSpacing: letterSpacingFromPercent(10, -2),
    },
    regular: {
      fontFamily: "Inter-Regular", // change based on weight
      fontSize: 10,
      lineHeight: 14,
      letterSpacing: letterSpacingFromPercent(10, -2),
    },
    medium: {
      fontFamily: "Inter-Medium", // change based on weight
      fontSize: 10,
      lineHeight: 14,
      letterSpacing: letterSpacingFromPercent(10, -2),
    },
    semiBold: {
      fontFamily: "Inter-SemiBold", // change based on weight
      fontSize: 10,
      lineHeight: 14,
      letterSpacing: letterSpacingFromPercent(10, -2),
    },
    bold: {
      fontFamily: "Inter-Bold", // change based on weight
      fontSize: 10,
      lineHeight: 14,
      letterSpacing: letterSpacingFromPercent(10, -2),
    },
    extraBold: {
      fontFamily: "Inter-ExtraBold", // change based on weight
      fontSize: 10,
      lineHeight: 14,
      letterSpacing: letterSpacingFromPercent(10, -2),
    },
    black: {
      fontFamily: "Inter-Black", // change based on weight
      fontSize: 10,
      lineHeight: 14,
      letterSpacing: letterSpacingFromPercent(10, -2),
    },
  },
} as const satisfies BodyTypography;

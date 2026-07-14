import { primaryColors, secondaryColors } from "@/design/colors";
const badgeColors = {
  primary: {
    background: primaryColors.brand[50],
    text: primaryColors.brand[600],
  },
  gray: {
    background: primaryColors.gray[100],
    text: primaryColors.gray[600],
  },
  error: {
    background: primaryColors.error[50],
    text: primaryColors.error[600],
  },
  warning: {
    background: primaryColors.warning[50],
    text: primaryColors.warning[600],
  },
  success: {
    background: primaryColors.success[50],
    text: primaryColors.success[600],
  },
  blueLight: {
    background: secondaryColors.blueLight[50],
    text: secondaryColors.blueLight[600],
  },
  blue: {
    background: secondaryColors.blue[50],
    text: secondaryColors.blue[600],
  },
  indigo: {
    background: secondaryColors.indigo[50],
    text: secondaryColors.indigo[600],
  },
  purple: {
    background: secondaryColors.purple[50],
    text: secondaryColors.purple[600],
  },
  pink: {
    background: secondaryColors.pink[50],
    text: secondaryColors.pink[600],
  },
  rose: {
    background: secondaryColors.rose[50],
    text: secondaryColors.rose[600],
  },
  orange: {
    background: secondaryColors.orange[50],
    text: secondaryColors.orange[600],
  },
  blueGray: {
    background: secondaryColors.blueGray[50],
    text: secondaryColors.blueGray[600],
  },
  outline: {
    background: primaryColors.gray[100],
    text: primaryColors.gray[500],
  },
  black: {
    background: primaryColors.gray[100],
    text: primaryColors.gray[900],
  },
  white: {
    background: primaryColors.gray[500],
    text: primaryColors.gray[25],
  },
} as const;

export type BadgeColor = keyof typeof badgeColors;

export type BadgeColorConfig = (typeof badgeColors)[BadgeColor];

export default badgeColors;

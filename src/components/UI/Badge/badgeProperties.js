import { SH, SW } from "../../../utils";
import { body } from "../DesignSystem/typography";

export const badgeProperties = {
  lg: {
    pv: SH(4),
    ph: SW(10),
    text: body.sm.regular,
  },
  md: {
    pv: SH(4),
    ph: SW(12),
    text: body.xs.regular,
  },
  sm: {
    pv: SH(2),
    ph: SW(8),
    text: body.xs.regular,
  },
  xs: {
    pv: SH(2),
    ph: SW(8),
    text: body.xxs.regular,
  },
};

export const noTextPadding = {
  lg: {
    ph: SH(8),
    pv: SW(8),
  },
  md: {
    ph: SH(6),
    pv: SW(6),
  },
  sm: {
    ph: SH(4),
    pv: SW(4),
  },
  xs: {
    ph: SH(2),
    pv: SW(2),
  },
};

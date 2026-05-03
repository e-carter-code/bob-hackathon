package com.legacylogic.loan.cobol;

import java.math.BigDecimal;
import java.math.RoundingMode;

/** COBOL-style ROUNDED arithmetic for PIC 9(3)V99 style fields (2 fractional digits). */
public final class CobolDecimal {
  private static final RoundingMode RM = RoundingMode.HALF_UP;

  private CobolDecimal() {}

  public static BigDecimal bd(String s) {
    return new BigDecimal(s);
  }

  /** ROUNDED to 2 decimal places (matches CALC-DTI-PCT / CALC-LTI-RATIO / CALC-DOWN-PCT). */
  public static BigDecimal round2(BigDecimal v) {
    return v.setScale(2, RM);
  }
}

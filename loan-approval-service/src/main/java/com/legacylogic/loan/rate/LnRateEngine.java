package com.legacylogic.loan.rate;

import com.legacylogic.loan.cobol.CobolDecimal;
import com.legacylogic.loan.model.ApplicantRecord;
import java.math.BigDecimal;
import java.math.RoundingMode;

/** Port of LNRATE.cbl — base rate + risk adjustment + high-DTI bump. */
public final class LnRateEngine {

  private LnRateEngine() {}

  public static BigDecimal computeApprovedApr(ApplicantRecord a, BigDecimal lkDtiPct, char lkRiskGrade) {
    BigDecimal base = paragraph1000BaseRate(a);
    BigDecimal addon = paragraph2000RiskAdjustment(lkRiskGrade, lkDtiPct);
    return CobolDecimal.round2(base.add(addon));
  }

  private static BigDecimal paragraph1000BaseRate(ApplicantRecord a) {
    if (a.isMortgage()) {
      return CobolDecimal.bd("6.75");
    }
    if (a.isAuto()) {
      return CobolDecimal.bd("7.50");
    }
    return CobolDecimal.bd("11.25");
  }

  private static BigDecimal paragraph2000RiskAdjustment(char lkRiskGrade, BigDecimal lkDtiPct) {
    BigDecimal addon;
    switch (lkRiskGrade) {
      case 'A' -> addon = CobolDecimal.bd("0.00");
      case 'B' -> addon = CobolDecimal.bd("1.25");
      case 'C' -> addon = CobolDecimal.bd("2.75");
      default -> addon = CobolDecimal.bd("4.50");
    }
    if (lkDtiPct.compareTo(CobolDecimal.bd("38.00")) > 0) {
      addon = addon.add(CobolDecimal.bd("0.50"));
    }
    return addon.setScale(2, RoundingMode.HALF_UP);
  }
}

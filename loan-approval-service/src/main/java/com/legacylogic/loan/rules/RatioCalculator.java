package com.legacylogic.loan.rules;

import com.legacylogic.loan.cobol.CobolDecimal;
import com.legacylogic.loan.model.ApplicantCalc;
import com.legacylogic.loan.model.ApplicantRecord;
import java.math.BigDecimal;
import java.math.RoundingMode;

/** LNRULES paragraph 2000-CALCULATE-RATIOS. */
public final class RatioCalculator {

  private RatioCalculator() {}

  public static void calculateRatios(ApplicantRecord a, ApplicantCalc c) {
    BigDecimal annual = BigDecimal.valueOf(a.applAnnualIncome());

    BigDecimal monthlyIncome;
    if (annual.compareTo(BigDecimal.ZERO) > 0) {
      monthlyIncome = CobolDecimal.round2(annual.divide(BigDecimal.valueOf(12), 12, RoundingMode.HALF_UP));
    } else {
      monthlyIncome = BigDecimal.ZERO;
    }
    c.setCalcMonthlyIncome(monthlyIncome);

    if (monthlyIncome.compareTo(BigDecimal.ZERO) > 0) {
      BigDecimal dti =
          CobolDecimal.round2(
              BigDecimal.valueOf(a.applMonthlyDebt())
                  .divide(monthlyIncome, 12, RoundingMode.HALF_UP)
                  .multiply(CobolDecimal.bd("100")));
      c.setCalcDtiPct(dti);
    } else {
      c.setCalcDtiPct(CobolDecimal.bd("999.99"));
    }

    if (a.applAnnualIncome() > 0) {
      BigDecimal lti =
          CobolDecimal.round2(
              BigDecimal.valueOf(a.applLoanAmount())
                  .divide(BigDecimal.valueOf(a.applAnnualIncome()), 12, RoundingMode.HALF_UP));
      c.setCalcLtiRatio(lti);
    } else {
      c.setCalcLtiRatio(CobolDecimal.bd("999.99"));
    }

    if (a.applLoanAmount() > 0) {
      BigDecimal downPct =
          CobolDecimal.round2(
              BigDecimal.valueOf(a.applDownPayment())
                  .divide(BigDecimal.valueOf(a.applLoanAmount()), 12, RoundingMode.HALF_UP)
                  .multiply(CobolDecimal.bd("100")));
      c.setCalcDownPct(downPct);
    } else {
      c.setCalcDownPct(BigDecimal.ZERO);
    }
  }
}

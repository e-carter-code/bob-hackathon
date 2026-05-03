package com.legacylogic.loan.model;

import java.math.BigDecimal;

/** Mirrors copy/APPLICANT.cpy — APPLICANT-CALC (working ratios). */
public final class ApplicantCalc {
  private BigDecimal calcMonthlyIncome = BigDecimal.ZERO;
  private BigDecimal calcDtiPct = BigDecimal.ZERO;
  private BigDecimal calcLtiRatio = BigDecimal.ZERO;
  private BigDecimal calcDownPct = BigDecimal.ZERO;

  public BigDecimal getCalcMonthlyIncome() {
    return calcMonthlyIncome;
  }

  public void setCalcMonthlyIncome(BigDecimal calcMonthlyIncome) {
    this.calcMonthlyIncome = calcMonthlyIncome;
  }

  public BigDecimal getCalcDtiPct() {
    return calcDtiPct;
  }

  public void setCalcDtiPct(BigDecimal calcDtiPct) {
    this.calcDtiPct = calcDtiPct;
  }

  public BigDecimal getCalcLtiRatio() {
    return calcLtiRatio;
  }

  public void setCalcLtiRatio(BigDecimal calcLtiRatio) {
    this.calcLtiRatio = calcLtiRatio;
  }

  public BigDecimal getCalcDownPct() {
    return calcDownPct;
  }

  public void setCalcDownPct(BigDecimal calcDownPct) {
    this.calcDownPct = calcDownPct;
  }
}

package com.legacylogic.loan.model;

/** Mirrors copy/APPLICANT.cpy — APPLICANT-REC (fixed-width batch line). */
public record ApplicantRecord(
    String applId,
    String applName,
    String applLoanType,
    int applAnnualIncome,
    int applLoanAmount,
    int applMonthlyDebt,
    int applCreditScore,
    int applEmpMonths,
    int applBankruptYears,
    int applDelinqCount,
    int applDownPayment
) {
  public boolean isMortgage() {
    return "MT".equals(applLoanType);
  }

  public boolean isAuto() {
    return "AU".equals(applLoanType);
  }

  public boolean isPersonal() {
    return "PL".equals(applLoanType);
  }
}

package com.legacylogic.loan.model;

import java.math.BigDecimal;

/** Mirrors copy/DECISION.cpy — DECISION-REC + linkage APR. */
public final class DecisionRecord {
  /** 'A' approved, 'R' review, 'D' declined — DECISION-CODE */
  private char decisionCode = 'A';
  private char riskGrade = 'U';
  private BigDecimal approvedApr = BigDecimal.ZERO;
  private String reasonCode = "    ";
  private String reasonText = "";

  public char getDecisionCode() {
    return decisionCode;
  }

  public void setDecisionCode(char decisionCode) {
    this.decisionCode = decisionCode;
  }

  public char getRiskGrade() {
    return riskGrade;
  }

  public void setRiskGrade(char riskGrade) {
    this.riskGrade = riskGrade;
  }

  public BigDecimal getApprovedApr() {
    return approvedApr;
  }

  public void setApprovedApr(BigDecimal approvedApr) {
    this.approvedApr = approvedApr;
  }

  public String getReasonCode() {
    return reasonCode;
  }

  public void setReasonCode(String reasonCode) {
    this.reasonCode = reasonCode != null ? reasonCode : "    ";
  }

  public String getReasonText() {
    return reasonText;
  }

  public void setReasonText(String reasonText) {
    this.reasonText = reasonText != null ? reasonText : "";
  }

  public boolean isApproved() {
    return decisionCode == 'A';
  }

  public boolean isReview() {
    return decisionCode == 'R';
  }

  public boolean isDeclined() {
    return decisionCode == 'D';
  }
}

package com.legacylogic.loan.model;

/** Mirrors copy/DECISION.cpy — RULE-FLAGS. */
public final class RuleFlags {
  private boolean hardDecline;
  private boolean manualReview;

  public boolean isHardDecline() {
    return hardDecline;
  }

  public void setHardDecline(boolean hardDecline) {
    this.hardDecline = hardDecline;
  }

  public boolean isManualReview() {
    return manualReview;
  }

  public void setManualReview(boolean manualReview) {
    this.manualReview = manualReview;
  }
}

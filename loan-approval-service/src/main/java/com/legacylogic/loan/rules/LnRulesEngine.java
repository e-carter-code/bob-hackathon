package com.legacylogic.loan.rules;

import com.legacylogic.loan.cobol.CobolDecimal;
import com.legacylogic.loan.model.ApplicantCalc;
import com.legacylogic.loan.model.ApplicantRecord;
import com.legacylogic.loan.model.DecisionRecord;
import com.legacylogic.loan.model.RuleFlags;
import java.math.BigDecimal;

/**
 * Port of LNRULES.cbl — same PERFORM order: 1000-INITIALIZE, 2000-CALCULATE-RATIOS (caller),
 * 3000-HARD-DECLINE-RULES, optional 4000/5000/6000 when NO-HARD-DECLINE after 3000.
 */
public final class LnRulesEngine {

  private LnRulesEngine() {}

  public static void applyRules(ApplicantRecord a, ApplicantCalc c, DecisionRecord d, RuleFlags f) {
    paragraph1000Initialize(d, f);
    RatioCalculator.calculateRatios(a, c);
    paragraph3000HardDeclineRules(a, c, d, f);

    if (!f.isHardDecline()) {
      paragraph4000DownPaymentRule(a, c, d, f);
      paragraph5000RiskGradeRule(a, c, d, f);
      paragraph6000FinalDecision(d, f);
    }
  }

  private static void paragraph1000Initialize(DecisionRecord d, RuleFlags f) {
    f.setHardDecline(false);
    f.setManualReview(false);
    d.setDecisionCode('A');
    d.setRiskGrade('U');
    d.setApprovedApr(java.math.BigDecimal.ZERO);
    d.setReasonCode("    ");
    d.setReasonText("");
  }

  private static void paragraph3000HardDeclineRules(
      ApplicantRecord a, ApplicantCalc c, DecisionRecord d, RuleFlags f) {
    if (a.applCreditScore() < 580) {
      paragraph9100DeclineCredit(d, f);
    } else if (c.getCalcDtiPct().compareTo(CobolDecimal.bd("43.00")) > 0) {
      paragraph9200DeclineDti(d, f);
    } else if (c.getCalcLtiRatio().compareTo(CobolDecimal.bd("5.00")) > 0) {
      paragraph9300DeclineLti(d, f);
    } else if (a.applEmpMonths() < 24) {
      paragraph9400DeclineEmployment(d, f);
    } else if (a.applBankruptYears() < 7) {
      paragraph9500DeclineBankruptcy(d, f);
    } else if (a.applDelinqCount() > 2) {
      paragraph9600DeclineDelinq(d, f);
    }
  }

  private static void paragraph4000DownPaymentRule(
      ApplicantRecord a, ApplicantCalc c, DecisionRecord d, RuleFlags f) {
    if (a.isMortgage()) {
      if (c.getCalcDownPct().compareTo(CobolDecimal.bd("5.00")) < 0) {
        d.setReasonCode("D003");
        d.setReasonText("DECLINED - MORTGAGE DOWN PAYMENT BELOW 5%");
        f.setHardDecline(true);
        d.setDecisionCode('D');
      } else if (c.getCalcDownPct().compareTo(CobolDecimal.bd("20.00")) < 0) {
        f.setManualReview(true);
        d.setReasonCode("R101");
        d.setReasonText("REVIEW - MORTGAGE DOWN PAYMENT BELOW 20%");
      }
    } else if (a.isAuto()) {
      if (c.getCalcDownPct().compareTo(CobolDecimal.bd("10.00")) < 0) {
        f.setManualReview(true);
        d.setReasonCode("R102");
        d.setReasonText("REVIEW - AUTO DOWN PAYMENT BELOW 10%");
      }
    }
  }

  private static void paragraph5000RiskGradeRule(
      ApplicantRecord a, ApplicantCalc c, DecisionRecord d, RuleFlags f) {
    if (f.isHardDecline()) {
      return;
    }
    int score = a.applCreditScore();
    BigDecimal dti = c.getCalcDtiPct();

    if (score >= 740) {
      if (dti.compareTo(CobolDecimal.bd("30.00")) <= 0) {
        d.setRiskGrade('A');
      } else {
        d.setRiskGrade('B');
      }
    } else if (score >= 680) {
      if (dti.compareTo(CobolDecimal.bd("36.00")) <= 0) {
        d.setRiskGrade('B');
      } else {
        d.setRiskGrade('C');
      }
    } else if (score >= 620) {
      if (dti.compareTo(CobolDecimal.bd("40.00")) <= 0) {
        d.setRiskGrade('C');
      } else {
        d.setRiskGrade('R');
        f.setManualReview(true);
        d.setReasonCode("R201");
        d.setReasonText("REVIEW - BORDERLINE CREDIT AND DTI");
      }
    } else {
      d.setRiskGrade('D');
      paragraph9100DeclineCredit(d, f);
    }
  }

  private static void paragraph6000FinalDecision(DecisionRecord d, RuleFlags f) {
    if (f.isHardDecline()) {
      d.setDecisionCode('D');
    } else if (f.isManualReview()) {
      d.setDecisionCode('R');
      if (d.getReasonText() == null || d.getReasonText().isBlank()) {
        d.setReasonCode("R999");
        d.setReasonText("REVIEW - POLICY EXCEPTION REQUIRED");
      }
    } else {
      d.setDecisionCode('A');
      d.setReasonCode("A001");
      d.setReasonText("APPROVED - MEETS BANK CREDIT POLICY");
    }
  }

  private static void paragraph9100DeclineCredit(DecisionRecord d, RuleFlags f) {
    f.setHardDecline(true);
    d.setDecisionCode('D');
    d.setReasonCode("D001");
    d.setReasonText("DECLINED - CREDIT SCORE BELOW POLICY MINIMUM");
  }

  private static void paragraph9200DeclineDti(DecisionRecord d, RuleFlags f) {
    f.setHardDecline(true);
    d.setDecisionCode('D');
    d.setReasonCode("D002");
    d.setReasonText("DECLINED - DEBT TO INCOME ABOVE 43%");
  }

  private static void paragraph9300DeclineLti(DecisionRecord d, RuleFlags f) {
    f.setHardDecline(true);
    d.setDecisionCode('D');
    d.setReasonCode("D004");
    d.setReasonText("DECLINED - LOAN AMOUNT EXCEEDS INCOME MULTIPLE");
  }

  private static void paragraph9400DeclineEmployment(DecisionRecord d, RuleFlags f) {
    f.setHardDecline(true);
    d.setDecisionCode('D');
    d.setReasonCode("D005");
    d.setReasonText("DECLINED - EMPLOYMENT HISTORY BELOW 24 MONTHS");
  }

  private static void paragraph9500DeclineBankruptcy(DecisionRecord d, RuleFlags f) {
    f.setHardDecline(true);
    d.setDecisionCode('D');
    d.setReasonCode("D006");
    d.setReasonText("DECLINED - BANKRUPTCY WITHIN LAST 7 YEARS");
  }

  private static void paragraph9600DeclineDelinq(DecisionRecord d, RuleFlags f) {
    f.setHardDecline(true);
    d.setDecisionCode('D');
    d.setReasonCode("D007");
    d.setReasonText("DECLINED - TOO MANY RECENT DELINQUENCIES");
  }
}

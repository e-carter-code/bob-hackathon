package com.legacylogic.loan.batch;

import com.legacylogic.loan.model.ApplicantCalc;
import com.legacylogic.loan.model.ApplicantRecord;
import com.legacylogic.loan.model.DecisionRecord;
import com.legacylogic.loan.model.RuleFlags;
import com.legacylogic.loan.parser.ApplicantLineParser;
import com.legacylogic.loan.rate.LnRateEngine;
import com.legacylogic.loan.rules.LnRulesEngine;
import java.math.BigDecimal;
import java.math.RoundingMode;

/** Port of LNMAIN 4000-PROCESS-APPLICATION + LNRULES + LNRATE call chain. */
public final class LoanBatchProcessor {

  private LoanBatchProcessor() {}

  public static BatchRowResult processLine(String line) {
    ApplicantRecord applicant = ApplicantLineParser.parse(line);
    ApplicantCalc calc = new ApplicantCalc();
    DecisionRecord decision = new DecisionRecord();
    RuleFlags flags = new RuleFlags();

    LnRulesEngine.applyRules(applicant, calc, decision, flags);

    if (decision.isApproved()) {
      BigDecimal apr =
          LnRateEngine.computeApprovedApr(applicant, calc.getCalcDtiPct(), decision.getRiskGrade());
      decision.setApprovedApr(apr);
    } else {
      decision.setApprovedApr(BigDecimal.ZERO);
    }

    BigDecimal dtiDisplay = calc.getCalcDtiPct().setScale(2, RoundingMode.HALF_UP);
    return new BatchRowResult(applicant, dtiDisplay, decision.getDecisionCode(), decision.getApprovedApr(), decision.getReasonText());
  }
}

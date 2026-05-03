package com.legacybank.loan.service;

import com.legacybank.loan.config.AprRatesConfig;
import com.legacybank.loan.config.LoanRulesConfig;
import com.legacybank.loan.model.*;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.jboss.logging.Logger;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;

/**
 * Main loan decision service.
 * Migrated from COBOL LNRULES and LNRATE programs.
 * 
 * This service orchestrates the complete loan approval workflow:
 * 1. Calculate financial ratios (DTI, LTI, Down Payment %)
 * 2. Apply hard decline rules
 * 3. Apply down payment rules (nested)
 * 4. Calculate risk grade (nested)
 * 5. Make final decision
 * 6. Calculate APR if approved
 */
@ApplicationScoped
public class LoanDecisionService {

    private static final Logger LOG = Logger.getLogger(LoanDecisionService.class);

    @Inject
    LoanRulesConfig rulesConfig;

    @Inject
    AprRatesConfig ratesConfig;

    /**
     * Process a loan application and return a decision.
     * Migrated from COBOL MAIN-PROCEDURE in LNMAIN.
     */
    public LoanDecision processApplication(LoanApplication application) {
        LOG.infof("Processing application %s for %s", 
            application.getApplicationId(), application.getApplicantName());

        // Step 1: Calculate ratios (COBOL 2000-CALCULATE-RATIOS)
        application.calculateRatios();
        LOG.debugf("Calculated ratios - DTI: %s%%, LTI: %s, Down: %s%%",
            application.getDebtToIncomeRatio(),
            application.getLoanToIncomeRatio(),
            application.getDownPaymentPercentage());

        // Step 2: Check hard decline rules (COBOL 3000-HARD-DECLINE-RULES)
        Optional<LoanDecision> hardDecline = checkHardDeclineRules(application);
        if (hardDecline.isPresent()) {
            LOG.infof("Application %s declined by hard rule: %s", 
                application.getApplicationId(), hardDecline.get().getReasonCode());
            return hardDecline.get();
        }

        // Step 3: Check down payment rules (COBOL 4000-DOWN-PAYMENT-RULE)
        Optional<LoanDecision> downPaymentDecision = checkDownPaymentRules(application);
        if (downPaymentDecision.isPresent()) {
            LOG.infof("Application %s flagged by down payment rule: %s", 
                application.getApplicationId(), downPaymentDecision.get().getReasonCode());
            return downPaymentDecision.get();
        }

        // Step 4: Calculate risk grade (COBOL 5000-RISK-GRADE-RULE)
        RiskGradeResult riskResult = calculateRiskGrade(application);
        
        // If risk grade requires review or decline
        if (riskResult.getDecision().isPresent()) {
            LOG.infof("Application %s decided by risk grade: %s", 
                application.getApplicationId(), riskResult.getDecision().get().getReasonCode());
            return riskResult.getDecision().get();
        }

        // Step 5: Calculate APR (COBOL LNRATE program)
        BigDecimal apr = calculateApr(application, riskResult.getRiskGrade());
        LOG.infof("Application %s approved with APR: %s%%", 
            application.getApplicationId(), apr);

        // Step 6: Return approved decision (COBOL 6000-FINAL-DECISION)
        return LoanDecision.approved(application, riskResult.getRiskGrade(), apr);
    }

    /**
     * Check hard decline rules.
     * Migrated from COBOL 3000-HARD-DECLINE-RULES paragraph.
     * 
     * Rules checked (in order):
     * 1. Minimum credit score (580)
     * 2. Maximum DTI (43%)
     * 3. Maximum LTI (5.0)
     * 4. Minimum employment (24 months)
     * 5. Bankruptcy lookback (7 years)
     * 6. Maximum delinquencies (2)
     */
    private Optional<LoanDecision> checkHardDeclineRules(LoanApplication app) {
        // Rule 1: Credit score (COBOL line 62-63)
        if (app.getCreditScore() < rulesConfig.minCreditScore()) {
            return Optional.of(LoanDecision.declined(app, "D001", 
                "DECLINED - CREDIT SCORE BELOW POLICY MINIMUM"));
        }

        // Rule 2: DTI ratio (COBOL line 65-66)
        if (app.getDebtToIncomeRatio().compareTo(rulesConfig.maxDtiPercent()) > 0) {
            return Optional.of(LoanDecision.declined(app, "D002", 
                "DECLINED - DEBT TO INCOME ABOVE 43%"));
        }

        // Rule 3: LTI ratio (COBOL line 68-69)
        if (app.getLoanToIncomeRatio().compareTo(rulesConfig.maxLtiRatio()) > 0) {
            return Optional.of(LoanDecision.declined(app, "D004", 
                "DECLINED - LOAN AMOUNT EXCEEDS INCOME MULTIPLE"));
        }

        // Rule 4: Employment history (COBOL line 71-72)
        if (app.getEmploymentMonths() < rulesConfig.minEmploymentMonths()) {
            return Optional.of(LoanDecision.declined(app, "D005", 
                "DECLINED - EMPLOYMENT HISTORY BELOW 24 MONTHS"));
        }

        // Rule 5: Bankruptcy (COBOL line 74-75)
        if (app.getBankruptcyYears() < rulesConfig.minBankruptcyYears()) {
            return Optional.of(LoanDecision.declined(app, "D006", 
                "DECLINED - BANKRUPTCY WITHIN LAST 7 YEARS"));
        }

        // Rule 6: Delinquencies (COBOL line 77-78)
        if (app.getDelinquencyCount() > rulesConfig.maxDelinquencies()) {
            return Optional.of(LoanDecision.declined(app, "D007", 
                "DECLINED - TOO MANY RECENT DELINQUENCIES"));
        }

        return Optional.empty();
    }

    /**
     * Check down payment rules (nested logic).
     * Migrated from COBOL 4000-DOWN-PAYMENT-RULE paragraph.
     * 
     * Mortgage rules:
     * - < 5%: Decline
     * - < 20%: Manual review
     * 
     * Auto rules:
     * - < 10%: Manual review
     */
    private Optional<LoanDecision> checkDownPaymentRules(LoanApplication app) {
        BigDecimal downPct = app.getDownPaymentPercentage();

        if (app.getLoanType() == LoanType.MORTGAGE) {
            // COBOL line 88-92: Hard decline if < 5%
            if (downPct.compareTo(rulesConfig.mortgage().minDownPaymentPercent()) < 0) {
                return Optional.of(LoanDecision.declined(app, "D003", 
                    "DECLINED - MORTGAGE DOWN PAYMENT BELOW 5%"));
            }
            // COBOL line 94-98: Manual review if < 20%
            if (downPct.compareTo(rulesConfig.mortgage().reviewDownPaymentPercent()) < 0) {
                return Optional.of(LoanDecision.review(app, "R101", 
                    "REVIEW - MORTGAGE DOWN PAYMENT BELOW 20%"));
            }
        } else if (app.getLoanType() == LoanType.AUTO) {
            // COBOL line 102-106: Manual review if < 10%
            if (downPct.compareTo(rulesConfig.auto().reviewDownPaymentPercent()) < 0) {
                return Optional.of(LoanDecision.review(app, "R102", 
                    "REVIEW - AUTO DOWN PAYMENT BELOW 10%"));
            }
        }
        // Personal loans: down payment is optional/compensating factor

        return Optional.empty();
    }

    /**
     * Calculate risk grade (nested logic).
     * Migrated from COBOL 5000-RISK-GRADE-RULE paragraph.
     * 
     * Risk grade matrix:
     * - 740+ credit: A (DTI ≤ 30%) or B (DTI > 30%)
     * - 680-739 credit: B (DTI ≤ 36%) or C (DTI > 36%)
     * - 620-679 credit: C (DTI ≤ 40%) or Review (DTI > 40%)
     * - < 620 credit: Decline
     */
    private RiskGradeResult calculateRiskGrade(LoanApplication app) {
        int creditScore = app.getCreditScore();
        BigDecimal dti = app.getDebtToIncomeRatio();

        // Excellent credit (740+) - COBOL line 112-117
        if (creditScore >= rulesConfig.risk().excellentCreditScore()) {
            if (dti.compareTo(rulesConfig.risk().gradeAMaxDti()) <= 0) {
                return RiskGradeResult.grade(RiskGrade.A);
            } else {
                return RiskGradeResult.grade(RiskGrade.B);
            }
        }

        // Good credit (680-739) - COBOL line 119-124
        if (creditScore >= rulesConfig.risk().goodCreditScore()) {
            if (dti.compareTo(rulesConfig.risk().gradeBMaxDti()) <= 0) {
                return RiskGradeResult.grade(RiskGrade.B);
            } else {
                return RiskGradeResult.grade(RiskGrade.C);
            }
        }

        // Fair credit (620-679) - COBOL line 126-134
        if (creditScore >= rulesConfig.risk().fairCreditScore()) {
            if (dti.compareTo(rulesConfig.risk().gradeCMaxDti()) <= 0) {
                return RiskGradeResult.grade(RiskGrade.C);
            } else {
                // Manual review for borderline cases
                LoanDecision review = LoanDecision.review(app, "R201", 
                    "REVIEW - BORDERLINE CREDIT AND DTI");
                return RiskGradeResult.decision(review);
            }
        }

        // Poor credit (< 620) - COBOL line 136-137
        LoanDecision declined = LoanDecision.declined(app, "D001", 
            "DECLINED - CREDIT SCORE BELOW POLICY MINIMUM");
        return RiskGradeResult.decision(declined);
    }

    /**
     * Calculate APR based on loan type and risk grade.
     * Migrated from COBOL LNRATE program.
     * 
     * APR = Base Rate + Risk Adjustment + DTI Penalty
     */
    private BigDecimal calculateApr(LoanApplication app, RiskGrade riskGrade) {
        // Step 1: Get base rate by loan type (COBOL 1000-BASE-RATE)
        BigDecimal baseRate = switch (app.getLoanType()) {
            case MORTGAGE -> ratesConfig.mortgageBase();
            case AUTO -> ratesConfig.autoBase();
            case PERSONAL -> ratesConfig.personalBase();
        };

        // Step 2: Add risk adjustment (COBOL 2000-RISK-ADJUSTMENT)
        BigDecimal riskAddon = switch (riskGrade) {
            case A -> ratesConfig.riskGradeAAddon();
            case B -> ratesConfig.riskGradeBAddon();
            case C -> ratesConfig.riskGradeCAddon();
            default -> ratesConfig.riskGradeOtherAddon();
        };

        // Step 3: Add high DTI penalty if applicable (COBOL line 47-48)
        BigDecimal dtiPenalty = BigDecimal.ZERO;
        if (app.getDebtToIncomeRatio().compareTo(ratesConfig.highDtiThreshold()) > 0) {
            dtiPenalty = ratesConfig.highDtiPenalty();
        }

        // Calculate final APR
        BigDecimal apr = baseRate.add(riskAddon).add(dtiPenalty);
        return apr.setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Helper class to return risk grade calculation result.
     */
    private static class RiskGradeResult {
        private final RiskGrade riskGrade;
        private final Optional<LoanDecision> decision;

        private RiskGradeResult(RiskGrade riskGrade, Optional<LoanDecision> decision) {
            this.riskGrade = riskGrade;
            this.decision = decision;
        }

        static RiskGradeResult grade(RiskGrade grade) {
            return new RiskGradeResult(grade, Optional.empty());
        }

        static RiskGradeResult decision(LoanDecision decision) {
            return new RiskGradeResult(RiskGrade.U, Optional.of(decision));
        }

        RiskGrade getRiskGrade() {
            return riskGrade;
        }

        Optional<LoanDecision> getDecision() {
            return decision;
        }
    }
}

// Made with Bob

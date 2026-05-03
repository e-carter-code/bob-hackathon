package com.legacybank.loan.service;

import com.legacybank.loan.config.AprRatesConfig;
import com.legacybank.loan.config.LoanRulesConfig;
import com.legacybank.loan.model.*;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Comprehensive unit tests for LoanDecisionService.
 * Tests all business rules migrated from COBOL system.
 * 
 * Test coverage:
 * - Hard decline rules (6 rules)
 * - Down payment rules (nested - 3 conditions)
 * - Risk grade rules (nested - 7 conditions)
 * - APR calculation rules (7 rules)
 * - Integration scenarios from COBOL test data
 */
@QuarkusTest
@DisplayName("Loan Decision Service Tests")
class LoanDecisionServiceTest {

    @Inject
    LoanDecisionService decisionService;

    @Inject
    LoanRulesConfig rulesConfig;

    @Inject
    AprRatesConfig ratesConfig;

    /**
     * Helper method to create a base valid application.
     */
    private LoanApplication createValidApplication() {
        return LoanApplication.builder()
            .applicationId("TEST1")
            .applicantName("TEST APPLICANT")
            .loanType(LoanType.MORTGAGE)
            .annualIncome(new BigDecimal("100000"))
            .loanAmount(new BigDecimal("300000"))
            .monthlyDebt(new BigDecimal("1000"))
            .creditScore(750)
            .employmentMonths(60)
            .bankruptcyYears(99)
            .delinquencyCount(0)
            .downPayment(new BigDecimal("60000"))
            .build();
    }

    @Nested
    @DisplayName("Hard Decline Rules Tests")
    class HardDeclineRulesTests {

        @Test
        @DisplayName("Rule D001: Should decline when credit score below 580")
        void shouldDeclineWhenCreditScoreTooLow() {
            // Given: Application with credit score 579 (below minimum 580)
            LoanApplication app = createValidApplication();
            app.setCreditScore(579);

            // When: Process application
            LoanDecision decision = decisionService.processApplication(app);

            // Then: Should be declined with D001
            assertThat(decision.getDecision()).isEqualTo(DecisionType.DECLINED);
            assertThat(decision.getReasonCode()).isEqualTo("D001");
            assertThat(decision.getReasonText()).contains("CREDIT SCORE BELOW POLICY MINIMUM");
            assertThat(decision.getApprovedApr()).isEqualByComparingTo(BigDecimal.ZERO);
        }

        @Test
        @DisplayName("Rule D001: Should pass when credit score equals 580")
        void shouldPassWhenCreditScoreAtMinimum() {
            // Given: Application with credit score exactly 580
            LoanApplication app = createValidApplication();
            app.setCreditScore(580);

            // When: Process application
            LoanDecision decision = decisionService.processApplication(app);

            // Then: Should not decline on credit score
            assertThat(decision.getReasonCode()).isNotEqualTo("D001");
        }

        @Test
        @DisplayName("Rule D002: Should decline when DTI above 43%")
        void shouldDeclineWhenDtiTooHigh() {
            // Given: Application with DTI = 43.01% (above maximum 43%)
            LoanApplication app = createValidApplication();
            app.setAnnualIncome(new BigDecimal("100000")); // Monthly = 8333.33
            app.setMonthlyDebt(new BigDecimal("3584")); // DTI = 43.01%

            // When: Process application
            LoanDecision decision = decisionService.processApplication(app);

            // Then: Should be declined with D002
            assertThat(decision.getDecision()).isEqualTo(DecisionType.DECLINED);
            assertThat(decision.getReasonCode()).isEqualTo("D002");
            assertThat(decision.getReasonText()).contains("DEBT TO INCOME ABOVE 43%");
        }

        @Test
        @DisplayName("Rule D002: Should pass when DTI equals 43%")
        void shouldPassWhenDtiAtMaximum() {
            // Given: Application with DTI exactly 43%
            LoanApplication app = createValidApplication();
            app.setAnnualIncome(new BigDecimal("100000")); // Monthly = 8333.33
            app.setMonthlyDebt(new BigDecimal("3583")); // DTI = 43.00%

            // When: Process application
            LoanDecision decision = decisionService.processApplication(app);

            // Then: Should not decline on DTI
            assertThat(decision.getReasonCode()).isNotEqualTo("D002");
        }

        @Test
        @DisplayName("Rule D004: Should decline when LTI above 5.0")
        void shouldDeclineWhenLtiTooHigh() {
            // Given: Application with LTI = 5.01 (above maximum 5.0)
            LoanApplication app = createValidApplication();
            app.setAnnualIncome(new BigDecimal("100000"));
            app.setLoanAmount(new BigDecimal("501000")); // LTI = 5.01

            // When: Process application
            LoanDecision decision = decisionService.processApplication(app);

            // Then: Should be declined with D004
            assertThat(decision.getDecision()).isEqualTo(DecisionType.DECLINED);
            assertThat(decision.getReasonCode()).isEqualTo("D004");
            assertThat(decision.getReasonText()).contains("LOAN AMOUNT EXCEEDS INCOME MULTIPLE");
        }

        @Test
        @DisplayName("Rule D005: Should decline when employment below 24 months")
        void shouldDeclineWhenEmploymentTooShort() {
            // Given: Application with 23 months employment (below minimum 24)
            LoanApplication app = createValidApplication();
            app.setEmploymentMonths(23);

            // When: Process application
            LoanDecision decision = decisionService.processApplication(app);

            // Then: Should be declined with D005
            assertThat(decision.getDecision()).isEqualTo(DecisionType.DECLINED);
            assertThat(decision.getReasonCode()).isEqualTo("D005");
            assertThat(decision.getReasonText()).contains("EMPLOYMENT HISTORY BELOW 24 MONTHS");
        }

        @Test
        @DisplayName("Rule D006: Should decline when bankruptcy within 7 years")
        void shouldDeclineWhenRecentBankruptcy() {
            // Given: Application with bankruptcy 6 years ago (within 7 years)
            LoanApplication app = createValidApplication();
            app.setBankruptcyYears(6);

            // When: Process application
            LoanDecision decision = decisionService.processApplication(app);

            // Then: Should be declined with D006
            assertThat(decision.getDecision()).isEqualTo(DecisionType.DECLINED);
            assertThat(decision.getReasonCode()).isEqualTo("D006");
            assertThat(decision.getReasonText()).contains("BANKRUPTCY WITHIN LAST 7 YEARS");
        }

        @Test
        @DisplayName("Rule D007: Should decline when delinquencies above 2")
        void shouldDeclineWhenTooManyDelinquencies() {
            // Given: Application with 3 delinquencies (above maximum 2)
            LoanApplication app = createValidApplication();
            app.setDelinquencyCount(3);

            // When: Process application
            LoanDecision decision = decisionService.processApplication(app);

            // Then: Should be declined with D007
            assertThat(decision.getDecision()).isEqualTo(DecisionType.DECLINED);
            assertThat(decision.getReasonCode()).isEqualTo("D007");
            assertThat(decision.getReasonText()).contains("TOO MANY RECENT DELINQUENCIES");
        }
    }

    @Nested
    @DisplayName("Down Payment Rules Tests (Nested)")
    class DownPaymentRulesTests {

        @Test
        @DisplayName("Rule D003: Should decline mortgage with down payment below 5%")
        void shouldDeclineMortgageWithLowDownPayment() {
            // Given: Mortgage with 4.99% down payment
            LoanApplication app = createValidApplication();
            app.setLoanType(LoanType.MORTGAGE);
            app.setLoanAmount(new BigDecimal("300000"));
            app.setDownPayment(new BigDecimal("14970")); // 4.99%

            // When: Process application
            LoanDecision decision = decisionService.processApplication(app);

            // Then: Should be declined with D003
            assertThat(decision.getDecision()).isEqualTo(DecisionType.DECLINED);
            assertThat(decision.getReasonCode()).isEqualTo("D003");
            assertThat(decision.getReasonText()).contains("MORTGAGE DOWN PAYMENT BELOW 5%");
        }

        @Test
        @DisplayName("Rule R101: Should review mortgage with down payment below 20%")
        void shouldReviewMortgageWithModerateDownPayment() {
            // Given: Mortgage with 19.99% down payment
            LoanApplication app = createValidApplication();
            app.setLoanType(LoanType.MORTGAGE);
            app.setLoanAmount(new BigDecimal("300000"));
            app.setDownPayment(new BigDecimal("59970")); // 19.99%

            // When: Process application
            LoanDecision decision = decisionService.processApplication(app);

            // Then: Should require manual review with R101
            assertThat(decision.getDecision()).isEqualTo(DecisionType.REVIEW);
            assertThat(decision.getReasonCode()).isEqualTo("R101");
            assertThat(decision.getReasonText()).contains("MORTGAGE DOWN PAYMENT BELOW 20%");
        }

        @Test
        @DisplayName("Rule R102: Should review auto loan with down payment below 10%")
        void shouldReviewAutoLoanWithLowDownPayment() {
            // Given: Auto loan with 9.99% down payment
            LoanApplication app = createValidApplication();
            app.setLoanType(LoanType.AUTO);
            app.setLoanAmount(new BigDecimal("30000"));
            app.setDownPayment(new BigDecimal("2997")); // 9.99%

            // When: Process application
            LoanDecision decision = decisionService.processApplication(app);

            // Then: Should require manual review with R102
            assertThat(decision.getDecision()).isEqualTo(DecisionType.REVIEW);
            assertThat(decision.getReasonCode()).isEqualTo("R102");
            assertThat(decision.getReasonText()).contains("AUTO DOWN PAYMENT BELOW 10%");
        }

        @Test
        @DisplayName("Should approve auto loan with down payment at 10%")
        void shouldApproveAutoLoanWithAdequateDownPayment() {
            // Given: Auto loan with exactly 10% down payment
            LoanApplication app = createValidApplication();
            app.setLoanType(LoanType.AUTO);
            app.setLoanAmount(new BigDecimal("30000"));
            app.setDownPayment(new BigDecimal("3000")); // 10%

            // When: Process application
            LoanDecision decision = decisionService.processApplication(app);

            // Then: Should not be flagged for down payment
            assertThat(decision.getReasonCode()).isNotIn("R102", "D003");
        }

        @Test
        @DisplayName("Should not check down payment for personal loans")
        void shouldNotCheckDownPaymentForPersonalLoans() {
            // Given: Personal loan with 0% down payment
            LoanApplication app = createValidApplication();
            app.setLoanType(LoanType.PERSONAL);
            app.setLoanAmount(new BigDecimal("50000"));
            app.setDownPayment(BigDecimal.ZERO);

            // When: Process application
            LoanDecision decision = decisionService.processApplication(app);

            // Then: Should not be flagged for down payment
            assertThat(decision.getReasonCode()).isNotIn("R101", "R102", "D003");
        }
    }

    @Nested
    @DisplayName("Risk Grade Rules Tests (Nested)")
    class RiskGradeRulesTests {

        @Test
        @DisplayName("Should assign Grade A for excellent credit (740+) and low DTI (≤30%)")
        void shouldAssignGradeAForExcellentCreditLowDti() {
            // Given: Credit 750, DTI 25%
            LoanApplication app = createValidApplication();
            app.setCreditScore(750);
            app.setAnnualIncome(new BigDecimal("100000")); // Monthly = 8333.33
            app.setMonthlyDebt(new BigDecimal("2083")); // DTI = 25%

            // When: Process application
            LoanDecision decision = decisionService.processApplication(app);

            // Then: Should be approved with Grade A
            assertThat(decision.getDecision()).isEqualTo(DecisionType.APPROVED);
            assertThat(decision.getRiskGrade()).isEqualTo(RiskGrade.A);
        }

        @Test
        @DisplayName("Should assign Grade B for excellent credit (740+) and high DTI (>30%)")
        void shouldAssignGradeBForExcellentCreditHighDti() {
            // Given: Credit 750, DTI 35%
            LoanApplication app = createValidApplication();
            app.setCreditScore(750);
            app.setAnnualIncome(new BigDecimal("100000"));
            app.setMonthlyDebt(new BigDecimal("2917")); // DTI = 35%

            // When: Process application
            LoanDecision decision = decisionService.processApplication(app);

            // Then: Should be approved with Grade B
            assertThat(decision.getDecision()).isEqualTo(DecisionType.APPROVED);
            assertThat(decision.getRiskGrade()).isEqualTo(RiskGrade.B);
        }

        @Test
        @DisplayName("Should assign Grade B for good credit (680-739) and low DTI (≤36%)")
        void shouldAssignGradeBForGoodCreditLowDti() {
            // Given: Credit 700, DTI 30%
            LoanApplication app = createValidApplication();
            app.setCreditScore(700);
            app.setAnnualIncome(new BigDecimal("100000"));
            app.setMonthlyDebt(new BigDecimal("2500")); // DTI = 30%

            // When: Process application
            LoanDecision decision = decisionService.processApplication(app);

            // Then: Should be approved with Grade B
            assertThat(decision.getDecision()).isEqualTo(DecisionType.APPROVED);
            assertThat(decision.getRiskGrade()).isEqualTo(RiskGrade.B);
        }

        @Test
        @DisplayName("Should assign Grade C for good credit (680-739) and high DTI (>36%)")
        void shouldAssignGradeCForGoodCreditHighDti() {
            // Given: Credit 700, DTI 40%
            LoanApplication app = createValidApplication();
            app.setCreditScore(700);
            app.setAnnualIncome(new BigDecimal("100000"));
            app.setMonthlyDebt(new BigDecimal("3333")); // DTI = 40%

            // When: Process application
            LoanDecision decision = decisionService.processApplication(app);

            // Then: Should be approved with Grade C
            assertThat(decision.getDecision()).isEqualTo(DecisionType.APPROVED);
            assertThat(decision.getRiskGrade()).isEqualTo(RiskGrade.C);
        }

        @Test
        @DisplayName("Should assign Grade C for fair credit (620-679) and low DTI (≤40%)")
        void shouldAssignGradeCForFairCreditLowDti() {
            // Given: Credit 650, DTI 35%
            LoanApplication app = createValidApplication();
            app.setCreditScore(650);
            app.setAnnualIncome(new BigDecimal("100000"));
            app.setMonthlyDebt(new BigDecimal("2917")); // DTI = 35%

            // When: Process application
            LoanDecision decision = decisionService.processApplication(app);

            // Then: Should be approved with Grade C
            assertThat(decision.getDecision()).isEqualTo(DecisionType.APPROVED);
            assertThat(decision.getRiskGrade()).isEqualTo(RiskGrade.C);
        }

        @Test
        @DisplayName("Rule R201: Should review for fair credit (620-679) and high DTI (>40%)")
        void shouldReviewForFairCreditHighDti() {
            // Given: Credit 650, DTI 42%
            LoanApplication app = createValidApplication();
            app.setCreditScore(650);
            app.setAnnualIncome(new BigDecimal("100000"));
            app.setMonthlyDebt(new BigDecimal("3500")); // DTI = 42%

            // When: Process application
            LoanDecision decision = decisionService.processApplication(app);

            // Then: Should require manual review with R201
            assertThat(decision.getDecision()).isEqualTo(DecisionType.REVIEW);
            assertThat(decision.getReasonCode()).isEqualTo("R201");
            assertThat(decision.getReasonText()).contains("BORDERLINE CREDIT AND DTI");
        }

        @Test
        @DisplayName("Should decline for poor credit (<620)")
        void shouldDeclineForPoorCredit() {
            // Given: Credit 619
            LoanApplication app = createValidApplication();
            app.setCreditScore(619);

            // When: Process application
            LoanDecision decision = decisionService.processApplication(app);

            // Then: Should be declined
            assertThat(decision.getDecision()).isEqualTo(DecisionType.DECLINED);
            assertThat(decision.getReasonCode()).isEqualTo("D001");
        }
    }

    @Nested
    @DisplayName("APR Calculation Tests")
    class AprCalculationTests {

        @Test
        @DisplayName("Should calculate mortgage base rate (6.75%)")
        void shouldCalculateMortgageBaseRate() {
            // Given: Mortgage with Grade A (no addon)
            LoanApplication app = createValidApplication();
            app.setLoanType(LoanType.MORTGAGE);
            app.setCreditScore(750);
            app.setMonthlyDebt(new BigDecimal("2000")); // DTI < 30%

            // When: Process application
            LoanDecision decision = decisionService.processApplication(app);

            // Then: APR should be 6.75%
            assertThat(decision.getApprovedApr()).isEqualByComparingTo(new BigDecimal("6.75"));
        }

        @Test
        @DisplayName("Should calculate auto loan base rate (7.50%)")
        void shouldCalculateAutoLoanBaseRate() {
            // Given: Auto loan with Grade A
            LoanApplication app = createValidApplication();
            app.setLoanType(LoanType.AUTO);
            app.setLoanAmount(new BigDecimal("30000"));
            app.setDownPayment(new BigDecimal("6000")); // 20%
            app.setCreditScore(750);
            app.setMonthlyDebt(new BigDecimal("2000")); // DTI < 30%

            // When: Process application
            LoanDecision decision = decisionService.processApplication(app);

            // Then: APR should be 7.50%
            assertThat(decision.getApprovedApr()).isEqualByComparingTo(new BigDecimal("7.50"));
        }

        @Test
        @DisplayName("Should calculate personal loan base rate (11.25%)")
        void shouldCalculatePersonalLoanBaseRate() {
            // Given: Personal loan with Grade A
            LoanApplication app = createValidApplication();
            app.setLoanType(LoanType.PERSONAL);
            app.setLoanAmount(new BigDecimal("50000"));
            app.setDownPayment(BigDecimal.ZERO);
            app.setCreditScore(750);
            app.setMonthlyDebt(new BigDecimal("2000")); // DTI < 30%

            // When: Process application
            LoanDecision decision = decisionService.processApplication(app);

            // Then: APR should be 11.25%
            assertThat(decision.getApprovedApr()).isEqualByComparingTo(new BigDecimal("11.25"));
        }

        @Test
        @DisplayName("Should add Grade B risk adjustment (+1.25%)")
        void shouldAddGradeBRiskAdjustment() {
            // Given: Mortgage with Grade B
            LoanApplication app = createValidApplication();
            app.setLoanType(LoanType.MORTGAGE);
            app.setCreditScore(750);
            app.setMonthlyDebt(new BigDecimal("2917")); // DTI = 35% (Grade B)

            // When: Process application
            LoanDecision decision = decisionService.processApplication(app);

            // Then: APR should be 6.75 + 1.25 = 8.00%
            assertThat(decision.getApprovedApr()).isEqualByComparingTo(new BigDecimal("8.00"));
        }

        @Test
        @DisplayName("Should add Grade C risk adjustment (+2.75%)")
        void shouldAddGradeCRiskAdjustment() {
            // Given: Mortgage with Grade C
            LoanApplication app = createValidApplication();
            app.setLoanType(LoanType.MORTGAGE);
            app.setCreditScore(650);
            app.setMonthlyDebt(new BigDecimal("2917")); // DTI = 35% (Grade C)

            // When: Process application
            LoanDecision decision = decisionService.processApplication(app);

            // Then: APR should be 6.75 + 2.75 = 9.50%
            assertThat(decision.getApprovedApr()).isEqualByComparingTo(new BigDecimal("9.50"));
        }

        @Test
        @DisplayName("Should add high DTI penalty (+0.50%) when DTI > 38%")
        void shouldAddHighDtiPenalty() {
            // Given: Mortgage with Grade B and DTI > 38%
            LoanApplication app = createValidApplication();
            app.setLoanType(LoanType.MORTGAGE);
            app.setCreditScore(750);
            app.setMonthlyDebt(new BigDecimal("3250")); // DTI = 39% (Grade B + penalty)

            // When: Process application
            LoanDecision decision = decisionService.processApplication(app);

            // Then: APR should be 6.75 + 1.25 + 0.50 = 8.50%
            assertThat(decision.getApprovedApr()).isEqualByComparingTo(new BigDecimal("8.50"));
        }
    }

    @Nested
    @DisplayName("COBOL Test Data Integration Tests")
    class CobolTestDataTests {

        @Test
        @DisplayName("COBOL Test Case 1: ALICE MARTIN - Should approve")
        void testAliceMartin() {
            // Given: COBOL test case 10001
            LoanApplication app = LoanApplication.builder()
                .applicationId("10001")
                .applicantName("ALICE MARTIN")
                .loanType(LoanType.MORTGAGE)
                .annualIncome(new BigDecimal("95000"))
                .loanAmount(new BigDecimal("320000"))
                .monthlyDebt(new BigDecimal("900"))
                .creditScore(780)
                .employmentMonths(60)
                .bankruptcyYears(99)
                .delinquencyCount(0)
                .downPayment(new BigDecimal("100000"))
                .build();

            // When: Process application
            LoanDecision decision = decisionService.processApplication(app);

            // Then: Should match COBOL output
            assertThat(decision.getDecision()).isEqualTo(DecisionType.APPROVED);
            assertThat(decision.getApprovedApr()).isEqualByComparingTo(new BigDecimal("6.75"));
            assertThat(decision.getReasonCode()).isEqualTo("A001");
        }

        @Test
        @DisplayName("COBOL Test Case 2: BRIAN CHEN - Should review")
        void testBrianChen() {
            // Given: COBOL test case 10002
            LoanApplication app = LoanApplication.builder()
                .applicationId("10002")
                .applicantName("BRIAN CHEN")
                .loanType(LoanType.AUTO)
                .annualIncome(new BigDecimal("62000"))
                .loanAmount(new BigDecimal("28000"))
                .monthlyDebt(new BigDecimal("1200"))
                .creditScore(710)
                .employmentMonths(36)
                .bankruptcyYears(99)
                .delinquencyCount(0)
                .downPayment(new BigDecimal("2000"))
                .build();

            // When: Process application
            LoanDecision decision = decisionService.processApplication(app);

            // Then: Should match COBOL output
            assertThat(decision.getDecision()).isEqualTo(DecisionType.REVIEW);
            assertThat(decision.getReasonCode()).isEqualTo("R102");
        }

        @Test
        @DisplayName("COBOL Test Case 3: CARLA DIAZ - Should decline (DTI)")
        void testCarlaDiaz() {
            // Given: COBOL test case 10003
            LoanApplication app = LoanApplication.builder()
                .applicationId("10003")
                .applicantName("CARLA DIAZ")
                .loanType(LoanType.PERSONAL)
                .annualIncome(new BigDecimal("48000"))
                .loanAmount(new BigDecimal("45000"))
                .monthlyDebt(new BigDecimal("2300"))
                .creditScore(650)
                .employmentMonths(48)
                .bankruptcyYears(12)
                .delinquencyCount(0)
                .downPayment(BigDecimal.ZERO)
                .build();

            // When: Process application
            LoanDecision decision = decisionService.processApplication(app);

            // Then: Should match COBOL output
            assertThat(decision.getDecision()).isEqualTo(DecisionType.DECLINED);
            assertThat(decision.getReasonCode()).isEqualTo("D002");
        }
    }
}

// Made with Bob

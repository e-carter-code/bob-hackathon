package com.legacybank.loan.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.math.BigDecimal;

/**
 * Loan decision response model.
 * Migrated from COBOL DECISION-REC copybook.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Loan decision response containing approval status and details")
public class LoanDecision {

    @Schema(description = "Application ID from the request", example = "10001", required = true)
    @JsonProperty("applicationId")
    private String applicationId;

    @Schema(description = "Applicant name from the request", example = "ALICE MARTIN", required = true)
    @JsonProperty("applicantName")
    private String applicantName;

    @Schema(description = "Decision type (APPROVED/REVIEW/DECLINED)", example = "APPROVED", required = true)
    @JsonProperty("decision")
    private DecisionType decision;

    @Schema(description = "Risk grade assigned (A/B/C/R/D)", example = "A", required = true)
    @JsonProperty("riskGrade")
    private RiskGrade riskGrade;

    @Schema(description = "Approved APR percentage (0 if not approved)", example = "6.75", required = true)
    @JsonProperty("approvedApr")
    private BigDecimal approvedApr;

    @Schema(description = "Decision reason code", example = "A001", required = true)
    @JsonProperty("reasonCode")
    private String reasonCode;

    @Schema(description = "Human-readable decision reason", example = "APPROVED - MEETS BANK CREDIT POLICY", required = true)
    @JsonProperty("reasonText")
    private String reasonText;

    // Additional calculated fields for transparency
    @Schema(description = "Calculated debt-to-income ratio percentage", example = "11.37")
    @JsonProperty("debtToIncomeRatio")
    private BigDecimal debtToIncomeRatio;

    @Schema(description = "Calculated loan-to-income ratio", example = "3.37")
    @JsonProperty("loanToIncomeRatio")
    private BigDecimal loanToIncomeRatio;

    @Schema(description = "Calculated down payment percentage", example = "31.25")
    @JsonProperty("downPaymentPercentage")
    private BigDecimal downPaymentPercentage;

    @Schema(description = "Credit score from application", example = "780")
    @JsonProperty("creditScore")
    private Integer creditScore;

    @Schema(description = "Loan type from application", example = "MORTGAGE")
    @JsonProperty("loanType")
    private LoanType loanType;

    /**
     * Create an approved decision.
     */
    public static LoanDecision approved(LoanApplication application, RiskGrade riskGrade, BigDecimal apr) {
        return LoanDecision.builder()
            .applicationId(application.getApplicationId())
            .applicantName(application.getApplicantName())
            .decision(DecisionType.APPROVED)
            .riskGrade(riskGrade)
            .approvedApr(apr)
            .reasonCode("A001")
            .reasonText("APPROVED - MEETS BANK CREDIT POLICY")
            .debtToIncomeRatio(application.getDebtToIncomeRatio())
            .loanToIncomeRatio(application.getLoanToIncomeRatio())
            .downPaymentPercentage(application.getDownPaymentPercentage())
            .creditScore(application.getCreditScore())
            .loanType(application.getLoanType())
            .build();
    }

    /**
     * Create a manual review decision.
     */
    public static LoanDecision review(LoanApplication application, String reasonCode, String reasonText) {
        return LoanDecision.builder()
            .applicationId(application.getApplicationId())
            .applicantName(application.getApplicantName())
            .decision(DecisionType.REVIEW)
            .riskGrade(RiskGrade.R)
            .approvedApr(BigDecimal.ZERO)
            .reasonCode(reasonCode)
            .reasonText(reasonText)
            .debtToIncomeRatio(application.getDebtToIncomeRatio())
            .loanToIncomeRatio(application.getLoanToIncomeRatio())
            .downPaymentPercentage(application.getDownPaymentPercentage())
            .creditScore(application.getCreditScore())
            .loanType(application.getLoanType())
            .build();
    }

    /**
     * Create a declined decision.
     */
    public static LoanDecision declined(LoanApplication application, String reasonCode, String reasonText) {
        return LoanDecision.builder()
            .applicationId(application.getApplicationId())
            .applicantName(application.getApplicantName())
            .decision(DecisionType.DECLINED)
            .riskGrade(RiskGrade.D)
            .approvedApr(BigDecimal.ZERO)
            .reasonCode(reasonCode)
            .reasonText(reasonText)
            .debtToIncomeRatio(application.getDebtToIncomeRatio())
            .loanToIncomeRatio(application.getLoanToIncomeRatio())
            .downPaymentPercentage(application.getDownPaymentPercentage())
            .creditScore(application.getCreditScore())
            .loanType(application.getLoanType())
            .build();
    }
}

// Made with Bob

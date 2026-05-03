package com.legacybank.loan.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.math.BigDecimal;

/**
 * Loan application request model.
 * Migrated from COBOL APPLICANT-REC copybook.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Loan application request containing applicant information and loan details")
public class LoanApplication {

    @NotBlank(message = "Application ID is required")
    @Size(max = 5, message = "Application ID must be 5 characters or less")
    @Schema(description = "Unique application identifier", example = "10001", required = true)
    @JsonProperty("applicationId")
    private String applicationId;

    @NotBlank(message = "Applicant name is required")
    @Size(max = 20, message = "Applicant name must be 20 characters or less")
    @Schema(description = "Full name of the applicant", example = "ALICE MARTIN", required = true)
    @JsonProperty("applicantName")
    private String applicantName;

    @NotNull(message = "Loan type is required")
    @Schema(description = "Type of loan requested", example = "MORTGAGE", required = true)
    @JsonProperty("loanType")
    private LoanType loanType;

    @NotNull(message = "Annual income is required")
    @Positive(message = "Annual income must be positive")
    @Schema(description = "Applicant's annual income in dollars", example = "95000", required = true)
    @JsonProperty("annualIncome")
    private BigDecimal annualIncome;

    @NotNull(message = "Loan amount is required")
    @Positive(message = "Loan amount must be positive")
    @Schema(description = "Requested loan amount in dollars", example = "320000", required = true)
    @JsonProperty("loanAmount")
    private BigDecimal loanAmount;

    @NotNull(message = "Monthly debt is required")
    @PositiveOrZero(message = "Monthly debt must be zero or positive")
    @Schema(description = "Total monthly debt obligations in dollars", example = "900", required = true)
    @JsonProperty("monthlyDebt")
    private BigDecimal monthlyDebt;

    @NotNull(message = "Credit score is required")
    @Min(value = 300, message = "Credit score must be at least 300")
    @Max(value = 850, message = "Credit score must be at most 850")
    @Schema(description = "Applicant's credit score (300-850)", example = "780", required = true)
    @JsonProperty("creditScore")
    private Integer creditScore;

    @NotNull(message = "Employment months is required")
    @PositiveOrZero(message = "Employment months must be zero or positive")
    @Schema(description = "Number of months employed at current job", example = "60", required = true)
    @JsonProperty("employmentMonths")
    private Integer employmentMonths;

    @NotNull(message = "Bankruptcy years is required")
    @Min(value = 0, message = "Bankruptcy years must be at least 0")
    @Max(value = 99, message = "Bankruptcy years must be at most 99")
    @Schema(description = "Years since last bankruptcy (99 = never)", example = "99", required = true)
    @JsonProperty("bankruptcyYears")
    private Integer bankruptcyYears;

    @NotNull(message = "Delinquency count is required")
    @Min(value = 0, message = "Delinquency count must be at least 0")
    @Max(value = 9, message = "Delinquency count must be at most 9")
    @Schema(description = "Number of recent 30-day delinquencies", example = "0", required = true)
    @JsonProperty("delinquencyCount")
    private Integer delinquencyCount;

    @NotNull(message = "Down payment is required")
    @PositiveOrZero(message = "Down payment must be zero or positive")
    @Schema(description = "Down payment amount in dollars", example = "100000", required = true)
    @JsonProperty("downPayment")
    private BigDecimal downPayment;

    // Calculated fields (not part of input, computed during processing)
    @Schema(description = "Calculated monthly income", hidden = true)
    private BigDecimal monthlyIncome;

    @Schema(description = "Calculated debt-to-income ratio percentage", hidden = true)
    private BigDecimal debtToIncomeRatio;

    @Schema(description = "Calculated loan-to-income ratio", hidden = true)
    private BigDecimal loanToIncomeRatio;

    @Schema(description = "Calculated down payment percentage", hidden = true)
    private BigDecimal downPaymentPercentage;

    /**
     * Calculate derived financial ratios.
     * Migrated from COBOL 2000-CALCULATE-RATIOS paragraph.
     */
    public void calculateRatios() {
        // Calculate monthly income
        if (annualIncome != null && annualIncome.compareTo(BigDecimal.ZERO) > 0) {
            monthlyIncome = annualIncome.divide(BigDecimal.valueOf(12), 2, BigDecimal.ROUND_HALF_UP);
        } else {
            monthlyIncome = BigDecimal.ZERO;
        }

        // Calculate DTI percentage
        if (monthlyIncome.compareTo(BigDecimal.ZERO) > 0) {
            debtToIncomeRatio = monthlyDebt
                .divide(monthlyIncome, 4, BigDecimal.ROUND_HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(2, BigDecimal.ROUND_HALF_UP);
        } else {
            debtToIncomeRatio = BigDecimal.valueOf(999.99);
        }

        // Calculate LTI ratio
        if (annualIncome.compareTo(BigDecimal.ZERO) > 0) {
            loanToIncomeRatio = loanAmount
                .divide(annualIncome, 4, BigDecimal.ROUND_HALF_UP)
                .setScale(2, BigDecimal.ROUND_HALF_UP);
        } else {
            loanToIncomeRatio = BigDecimal.valueOf(999.99);
        }

        // Calculate down payment percentage
        if (loanAmount.compareTo(BigDecimal.ZERO) > 0) {
            downPaymentPercentage = downPayment
                .divide(loanAmount, 4, BigDecimal.ROUND_HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(2, BigDecimal.ROUND_HALF_UP);
        } else {
            downPaymentPercentage = BigDecimal.ZERO;
        }
    }
}

// Made with Bob

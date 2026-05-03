package com.legacybank.loan.config;

import io.smallrye.config.ConfigMapping;
import io.smallrye.config.WithName;

import java.math.BigDecimal;

/**
 * Configuration properties for loan business rules.
 * Migrated from COBOL hard-coded values to externalized configuration.
 */
@ConfigMapping(prefix = "loan.rules")
public interface LoanRulesConfig {

    @WithName("min-credit-score")
    Integer minCreditScore();

    @WithName("max-dti-percent")
    BigDecimal maxDtiPercent();

    @WithName("max-lti-ratio")
    BigDecimal maxLtiRatio();

    @WithName("min-employment-months")
    Integer minEmploymentMonths();

    @WithName("min-bankruptcy-years")
    Integer minBankruptcyYears();

    @WithName("max-delinquencies")
    Integer maxDelinquencies();

    Mortgage mortgage();

    Auto auto();

    Risk risk();

    interface Mortgage {
        @WithName("min-down-payment-percent")
        BigDecimal minDownPaymentPercent();

        @WithName("review-down-payment-percent")
        BigDecimal reviewDownPaymentPercent();
    }

    interface Auto {
        @WithName("review-down-payment-percent")
        BigDecimal reviewDownPaymentPercent();
    }

    interface Risk {
        @WithName("excellent-credit-score")
        Integer excellentCreditScore();

        @WithName("good-credit-score")
        Integer goodCreditScore();

        @WithName("fair-credit-score")
        Integer fairCreditScore();

        @WithName("grade-a-max-dti")
        BigDecimal gradeAMaxDti();

        @WithName("grade-b-max-dti")
        BigDecimal gradeBMaxDti();

        @WithName("grade-c-max-dti")
        BigDecimal gradeCMaxDti();
    }
}

// Made with Bob

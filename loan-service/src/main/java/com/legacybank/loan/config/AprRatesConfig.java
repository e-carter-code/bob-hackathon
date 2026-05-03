package com.legacybank.loan.config;

import io.smallrye.config.ConfigMapping;
import io.smallrye.config.WithName;

import java.math.BigDecimal;

/**
 * Configuration properties for APR calculation.
 * Migrated from COBOL LNRATE program.
 */
@ConfigMapping(prefix = "loan.rates")
public interface AprRatesConfig {

    @WithName("mortgage-base")
    BigDecimal mortgageBase();

    @WithName("auto-base")
    BigDecimal autoBase();

    @WithName("personal-base")
    BigDecimal personalBase();

    @WithName("risk-grade-a-addon")
    BigDecimal riskGradeAAddon();

    @WithName("risk-grade-b-addon")
    BigDecimal riskGradeBAddon();

    @WithName("risk-grade-c-addon")
    BigDecimal riskGradeCAddon();

    @WithName("risk-grade-other-addon")
    BigDecimal riskGradeOtherAddon();

    @WithName("high-dti-penalty")
    BigDecimal highDtiPenalty();

    @WithName("high-dti-threshold")
    BigDecimal highDtiThreshold();
}

// Made with Bob

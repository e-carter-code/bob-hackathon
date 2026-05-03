package com.legacybank.loan.model;

/**
 * Loan type enumeration.
 * Migrated from COBOL APPL-LOAN-TYPE field (MT/AU/PL).
 */
public enum LoanType {
    MORTGAGE("MT", "Mortgage"),
    AUTO("AU", "Auto Loan"),
    PERSONAL("PL", "Personal Loan");

    private final String code;
    private final String description;

    LoanType(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public static LoanType fromCode(String code) {
        for (LoanType type : values()) {
            if (type.code.equals(code)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown loan type code: " + code);
    }
}

// Made with Bob

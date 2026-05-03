package com.legacybank.loan.model;

/**
 * Risk grade enumeration.
 * Migrated from COBOL RISK-GRADE field (A/B/C/R/D).
 */
public enum RiskGrade {
    A("A", "Excellent - Low Risk"),
    B("B", "Good - Moderate Risk"),
    C("C", "Fair - Higher Risk"),
    R("R", "Review Required"),
    D("D", "Declined"),
    U("U", "Unassigned");

    private final String code;
    private final String description;

    RiskGrade(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public static RiskGrade fromCode(String code) {
        for (RiskGrade grade : values()) {
            if (grade.code.equals(code)) {
                return grade;
            }
        }
        throw new IllegalArgumentException("Unknown risk grade code: " + code);
    }
}

// Made with Bob

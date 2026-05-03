package com.legacybank.loan.model;

/**
 * Decision type enumeration.
 * Migrated from COBOL DECISION-CODE field (A/R/D).
 */
public enum DecisionType {
    APPROVED("A", "Approved"),
    REVIEW("R", "Manual Review Required"),
    DECLINED("D", "Declined");

    private final String code;
    private final String description;

    DecisionType(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public static DecisionType fromCode(String code) {
        for (DecisionType type : values()) {
            if (type.code.equals(code)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown decision code: " + code);
    }
}

// Made with Bob

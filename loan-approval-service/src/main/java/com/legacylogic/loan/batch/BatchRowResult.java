package com.legacylogic.loan.batch;

import com.legacylogic.loan.model.ApplicantRecord;
import java.math.BigDecimal;

/** One applicant row after LNMAIN-style processing (display fields). */
public record BatchRowResult(
    ApplicantRecord applicant,
    BigDecimal dtiDisplay,
    char decisionCode,
    BigDecimal aprDisplay,
    String reasonText
) {}

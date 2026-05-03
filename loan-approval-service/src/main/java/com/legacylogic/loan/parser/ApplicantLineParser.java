package com.legacylogic.loan.parser;

import com.legacylogic.loan.model.ApplicantRecord;

/**
 * Parses 64-character APPLICANT-LINE into APPLICANT-REC (see LNMAIN + APPLICANT.cpy).
 */
public final class ApplicantLineParser {

  private ApplicantLineParser() {}

  public static ApplicantRecord parse(String line) {
    if (line == null) {
      throw new IllegalArgumentException("line is null");
    }
    String row = line.length() >= 64 ? line.substring(0, 64) : String.format("%-64s", line).substring(0, 64);

    int p = 0;
    String id = row.substring(p, p + 5);
    p += 5;
    String name = row.substring(p, p + 20);
    p += 20;
    String loanType = row.substring(p, p + 2);
    p += 2;
    int annual = Integer.parseInt(row.substring(p, p + 8).trim().isEmpty() ? "0" : row.substring(p, p + 8));
    p += 8;
    int loanAmt = Integer.parseInt(row.substring(p, p + 8).trim().isEmpty() ? "0" : row.substring(p, p + 8));
    p += 8;
    int monthlyDebt = Integer.parseInt(row.substring(p, p + 5).trim().isEmpty() ? "0" : row.substring(p, p + 5));
    p += 5;
    int credit = Integer.parseInt(row.substring(p, p + 3).trim().isEmpty() ? "0" : row.substring(p, p + 3));
    p += 3;
    int empMonths = Integer.parseInt(row.substring(p, p + 2).trim().isEmpty() ? "0" : row.substring(p, p + 2));
    p += 2;
    int bankruptYears = Integer.parseInt(row.substring(p, p + 2).trim().isEmpty() ? "0" : row.substring(p, p + 2));
    p += 2;
    int delinq = Integer.parseInt(row.substring(p, p + 1).trim().isEmpty() ? "0" : row.substring(p, p + 1));
    p += 1;
    int down = Integer.parseInt(row.substring(p, p + 8).trim().isEmpty() ? "0" : row.substring(p, p + 8));

    return new ApplicantRecord(
        id,
        name,
        loanType,
        annual,
        loanAmt,
        monthlyDebt,
        credit,
        empMonths,
        bankruptYears,
        delinq,
        down
    );
  }
}

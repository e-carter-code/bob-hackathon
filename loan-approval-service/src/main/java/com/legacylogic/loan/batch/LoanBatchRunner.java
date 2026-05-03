package com.legacylogic.loan.batch;

import com.legacylogic.loan.model.ApplicantRecord;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

/**
 * Command-line batch runner (LNMAIN-style). Usage:
 *
 * <pre>
 *   java -cp target/classes com.legacylogic.loan.batch.LoanBatchRunner path/to/applicants.dat
 * </pre>
 */
public final class LoanBatchRunner {

  public static void main(String[] args) throws IOException {
    Path input =
        args.length > 0
            ? Path.of(args[0])
            : Path.of("..", "loan-approvals-COBOL", "data", "applicants.dat");
    List<String> lines = Files.readAllLines(input, StandardCharsets.UTF_8);
    int total = 0;
    int approved = 0;
    int review = 0;
    int declined = 0;

    System.out.println("LEGACY BANK LOAN APPROVAL BATCH");
    System.out.println("ID    NAME                 TYPE SCORE DTI    DEC APR  REASON");
    System.out.println("----- -------------------- ---- ----- ------ --- ---- ------------------------------");

    for (String line : lines) {
      if (line.isBlank()) {
        continue;
      }
      total++;
      BatchRowResult row = LoanBatchProcessor.processLine(line);
      ApplicantRecord a = row.applicant();
      char dec = row.decisionCode();
      if (dec == 'A') {
        approved++;
      } else if (dec == 'R') {
        review++;
      } else {
        declined++;
      }
      printRow(row);
    }

    System.out.println(" ");
    System.out.println("TOTAL APPLICATIONS : " + formatCount(total));
    System.out.println("APPROVED           : " + formatCount(approved));
    System.out.println("MANUAL REVIEW      : " + formatCount(review));
    System.out.println("DECLINED           : " + formatCount(declined));
  }

  private static String formatCount(int n) {
    return String.format("%04d", n);
  }

  private static void printRow(BatchRowResult row) {
    ApplicantRecord a = row.applicant();
    String dtiStr = formatDti(row.dtiDisplay());
    String aprStr = formatApr(row.aprDisplay());
    String name = trimName(a.applName());
    System.out.printf(
        "%s %s %s   %d  %s %s   %s %s%n",
        a.applId().trim(),
        padRight(name, 20),
        a.applLoanType(),
        a.applCreditScore(),
        dtiStr,
        String.valueOf(row.decisionCode()),
        aprStr,
        row.reasonText().trim());
  }

  private static String trimName(String n) {
    return n == null ? "" : n.stripTrailing();
  }

  private static String padRight(String s, int len) {
    if (s.length() >= len) {
      return s.substring(0, len);
    }
    return String.format("%-" + len + "s", s);
  }

  private static String formatDti(BigDecimal dti) {
    return String.format("%6s", dti.toPlainString());
  }

  private static String formatApr(BigDecimal apr) {
    if (apr.compareTo(BigDecimal.ZERO) == 0) {
      return "0.00";
    }
    return String.format("%4s", apr.setScale(2, RoundingMode.HALF_UP).toPlainString());
  }
}

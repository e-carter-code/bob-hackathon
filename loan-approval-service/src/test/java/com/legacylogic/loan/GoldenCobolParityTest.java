package com.legacylogic.loan;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.legacylogic.loan.batch.BatchRowResult;
import com.legacylogic.loan.batch.LoanBatchProcessor;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;

/** Golden batch: same applicants.dat outcomes as loan-approvals-COBOL/data/expected-output.txt */
class GoldenCobolParityTest {

  private static final List<String> LINES = loadLines();

  private static List<String> loadLines() {
    try {
      Path p =
          Path.of("..", "loan-approvals-COBOL", "data", "applicants.dat")
              .toAbsolutePath()
              .normalize();
      return Files.readAllLines(p, StandardCharsets.UTF_8).stream().filter(s -> !s.isBlank()).toList();
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  @Test
  void batchCountsMatchCobolSample() {
    int a = 0, r = 0, d = 0;
    for (String line : LINES) {
      char c = LoanBatchProcessor.processLine(line).decisionCode();
      if (c == 'A') {
        a++;
      } else if (c == 'R') {
        r++;
      } else {
        d++;
      }
    }
    assertEquals(8, LINES.size());
    assertEquals(2, a);
    assertEquals(1, r);
    assertEquals(5, d);
  }

  @Test
  void eachApplicantMatchesExpectedOutput() {
    Map<String, Expect> expected = new HashMap<>();
    expected.put("10001", new Expect("10001", 'A', bd("11.37"), bd("6.75")));
    expected.put("10002", new Expect("10002", 'R', bd("23.23"), bd("0.00")));
    expected.put("10003", new Expect("10003", 'D', bd("57.50"), bd("0.00")));
    expected.put("10004", new Expect("10004", 'A', bd("27.27"), bd("8.00")));
    expected.put("10005", new Expect("10005", 'D', bd("15.00"), bd("0.00")));
    expected.put("10006", new Expect("10006", 'D', bd("43.76"), bd("0.00")));
    expected.put("10007", new Expect("10007", 'D', bd("27.69"), bd("0.00")));
    expected.put("10008", new Expect("10008", 'D', bd("27.86"), bd("0.00")));

    for (String line : LINES) {
      BatchRowResult row = LoanBatchProcessor.processLine(line);
      String id = row.applicant().applId().trim();
      Expect e = expected.get(id);
      assertNotNull(e, "no expected row for id " + id);
      assertEquals(e.id(), id, "id");
      assertEquals(e.decision(), row.decisionCode(), "decision " + id);
      assertEquals(0, row.dtiDisplay().compareTo(e.dti()), "dti " + id);
      assertEquals(0, row.aprDisplay().compareTo(e.apr()), "apr " + id);
    }
  }

  private static BigDecimal bd(String s) {
    return new BigDecimal(s);
  }

  private record Expect(String id, char decision, BigDecimal dti, BigDecimal apr) {}
}

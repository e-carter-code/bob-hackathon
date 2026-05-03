/**
 * Per–hierarchy-leaf COBOL excerpts for the Analysis “source excerpt” panel.
 * `highlightStartLine` / `highlightEndLine` are 1-based within `code`.
 * `sourceFirstLine` maps line 1 of `code` to the real file so the viewer gutter matches the repo.
 */

export type AnalysisLeafSnippet = {
  /** Path shown above the code block */
  sourcePath: string;
  /** First line of `code` in the repo file (1-based); gutter uses this as the starting line number */
  sourceFirstLine: number;
  /** 1-based inclusive line numbers inside `code` to highlight */
  highlightStartLine: number;
  highlightEndLine: number;
  code: string;
};

export const LOAN_APPROVALS_LEAF_SNIPPETS: Record<string, AnalysisLeafSnippet> = {
  'lnmain-open': {
    sourcePath: 'src/LNMAIN.cbl',
    sourceFirstLine: 32,
    highlightStartLine: 9,
    highlightEndLine: 10,
    code: `       MAIN-PROCEDURE.
           PERFORM 1000-OPEN-FILES
           PERFORM 2000-PRINT-HEADER
           PERFORM UNTIL END-OF-FILE
               PERFORM 3000-READ-APPLICATION
               IF MORE-RECORDS
                   PERFORM 4000-PROCESS-APPLICATION
               END-IF
           END-PERFORM
           PERFORM 9000-CLOSE-FILES
           GOBACK.

       1000-OPEN-FILES.
           OPEN INPUT APPLICANT-FILE.`,
  },
  'lnmain-read': {
    sourcePath: 'src/LNMAIN.cbl',
    sourceFirstLine: 52,
    highlightStartLine: 5,
    highlightEndLine: 11,
    code: `       3000-READ-APPLICATION.
           READ APPLICANT-FILE
               AT END
                   SET END-OF-FILE TO TRUE
               NOT AT END
                   SET MORE-RECORDS TO TRUE
                   MOVE APPLICANT-LINE TO APPLICANT-REC
           END-READ.`,
  },
  'lnmain-call': {
    sourcePath: 'src/LNMAIN.cbl',
    sourceFirstLine: 61,
    highlightStartLine: 3,
    highlightEndLine: 18,
    code: `       4000-PROCESS-APPLICATION.
           ADD 1 TO WS-TOTAL
           CALL "LNRULES" USING APPLICANT-REC
                                APPLICANT-CALC
                                DECISION-REC
                                RULE-FLAGS
           IF DECISION-APPROVED
               CALL "LNRATE" USING APPLICANT-REC
                                   CALC-DTI-PCT
                                   RISK-GRADE
                                   APPROVED-APR
               ADD 1 TO WS-APPROVED
           ELSE
               MOVE 0 TO APPROVED-APR
               IF DECISION-REVIEW
                   ADD 1 TO WS-REVIEW
               ELSE
                   ADD 1 TO WS-DECLINED
               END-IF
           END-IF
           PERFORM 4100-PRINT-DECISION.`,
  },
  'lnmain-print': {
    sourcePath: 'src/LNMAIN.cbl',
    sourceFirstLine: 83,
    highlightStartLine: 1,
    highlightEndLine: 10,
    code: `       4100-PRINT-DECISION.
           MOVE CALC-DTI-PCT TO WS-DTI-DISPLAY
           MOVE APPROVED-APR TO WS-APR-DISPLAY
           DISPLAY APPL-ID " "
                   APPL-NAME " "
                   APPL-LOAN-TYPE "   "
                   APPL-CREDIT-SCORE " "
                   WS-DTI-DISPLAY " "
                   DECISION-CODE "   "
                   WS-APR-DISPLAY " "
                   REASON-TEXT.

       9000-CLOSE-FILES.
           CLOSE APPLICANT-FILE
           DISPLAY " "
           DISPLAY "TOTAL APPLICATIONS : " WS-TOTAL
           DISPLAY "APPROVED           : " WS-APPROVED
           DISPLAY "MANUAL REVIEW      : " WS-REVIEW
           DISPLAY "DECLINED           : " WS-DECLINED.`,
  },
  'calc-income': {
    sourcePath: 'src/LNRULES.cbl',
    sourceFirstLine: 40,
    highlightStartLine: 2,
    highlightEndLine: 2,
    code: `       2000-CALCULATE-RATIOS.
           COMPUTE CALC-MONTHLY-INCOME = APPL-ANNUAL-INCOME / 12
           IF CALC-MONTHLY-INCOME > 0
               COMPUTE CALC-DTI-PCT ROUNDED =
                   (APPL-MONTHLY-DEBT / CALC-MONTHLY-INCOME) * 100
           ELSE
               MOVE 999.99 TO CALC-DTI-PCT
           END-IF`,
  },
  'calc-dti': {
    sourcePath: 'src/LNRULES.cbl',
    sourceFirstLine: 40,
    highlightStartLine: 3,
    highlightEndLine: 7,
    code: `       2000-CALCULATE-RATIOS.
           COMPUTE CALC-MONTHLY-INCOME = APPL-ANNUAL-INCOME / 12
           IF CALC-MONTHLY-INCOME > 0
               COMPUTE CALC-DTI-PCT ROUNDED =
                   (APPL-MONTHLY-DEBT / CALC-MONTHLY-INCOME) * 100
           ELSE
               MOVE 999.99 TO CALC-DTI-PCT
           END-IF`,
  },
  'calc-lti': {
    sourcePath: 'src/LNRULES.cbl',
    sourceFirstLine: 48,
    highlightStartLine: 2,
    highlightEndLine: 6,
    code: `           IF APPL-ANNUAL-INCOME > 0
               COMPUTE CALC-LTI-RATIO ROUNDED =
                   APPL-LOAN-AMOUNT / APPL-ANNUAL-INCOME
           ELSE
               MOVE 999.99 TO CALC-LTI-RATIO
           END-IF
           IF APPL-LOAN-AMOUNT > 0
               COMPUTE CALC-DOWN-PCT ROUNDED =
                   (APPL-DOWN-PAYMENT / APPL-LOAN-AMOUNT) * 100
           ELSE
               MOVE 0 TO CALC-DOWN-PCT
           END-IF.`,
  },
  'calc-down': {
    sourcePath: 'src/LNRULES.cbl',
    sourceFirstLine: 40,
    highlightStartLine: 15,
    highlightEndLine: 20,
    code: `       2000-CALCULATE-RATIOS.
           COMPUTE CALC-MONTHLY-INCOME = APPL-ANNUAL-INCOME / 12
           IF CALC-MONTHLY-INCOME > 0
               COMPUTE CALC-DTI-PCT ROUNDED =
                   (APPL-MONTHLY-DEBT / CALC-MONTHLY-INCOME) * 100
           ELSE
               MOVE 999.99 TO CALC-DTI-PCT
           END-IF
           IF APPL-ANNUAL-INCOME > 0
               COMPUTE CALC-LTI-RATIO ROUNDED =
                   APPL-LOAN-AMOUNT / APPL-ANNUAL-INCOME
           ELSE
               MOVE 999.99 TO CALC-LTI-RATIO
           END-IF
           IF APPL-LOAN-AMOUNT > 0
               COMPUTE CALC-DOWN-PCT ROUNDED =
                   (APPL-DOWN-PAYMENT / APPL-LOAN-AMOUNT) * 100
           ELSE
               MOVE 0 TO CALC-DOWN-PCT
           END-IF.`,
  },
  'rule-credit': {
    sourcePath: 'src/LNRULES.cbl',
    sourceFirstLine: 61,
    highlightStartLine: 2,
    highlightEndLine: 4,
    code: `       3000-HARD-DECLINE-RULES.
           IF APPL-CREDIT-SCORE < 580
               PERFORM 9100-DECLINE-CREDIT
           ELSE
               IF CALC-DTI-PCT > 43.00`,
  },
  'rule-dti': {
    sourcePath: 'src/LNRULES.cbl',
    sourceFirstLine: 65,
    highlightStartLine: 2,
    highlightEndLine: 4,
    code: `               IF CALC-DTI-PCT > 43.00
                   PERFORM 9200-DECLINE-DTI
               ELSE
                   IF CALC-LTI-RATIO > 5.00`,
  },
  'rule-lti': {
    sourcePath: 'src/LNRULES.cbl',
    sourceFirstLine: 68,
    highlightStartLine: 2,
    highlightEndLine: 4,
    code: `                   IF CALC-LTI-RATIO > 5.00
                       PERFORM 9300-DECLINE-LTI
                   ELSE
                       IF APPL-EMP-MONTHS < 24`,
  },
  'rule-emp': {
    sourcePath: 'src/LNRULES.cbl',
    sourceFirstLine: 71,
    highlightStartLine: 2,
    highlightEndLine: 4,
    code: `                       IF APPL-EMP-MONTHS < 24
                           PERFORM 9400-DECLINE-EMPLOYMENT
                       ELSE
                           IF APPL-BANKRUPT-YEARS < 7`,
  },
  'rule-bk': {
    sourcePath: 'src/LNRULES.cbl',
    sourceFirstLine: 74,
    highlightStartLine: 2,
    highlightEndLine: 4,
    code: `                           IF APPL-BANKRUPT-YEARS < 7
                              PERFORM 9500-DECLINE-BANKRUPTCY
                           ELSE
                              IF APPL-DELINQ-COUNT > 2`,
  },
  'rule-del': {
    sourcePath: 'src/LNRULES.cbl',
    sourceFirstLine: 77,
    highlightStartLine: 2,
    highlightEndLine: 4,
    code: `                              IF APPL-DELINQ-COUNT > 2
                                  PERFORM 9600-DECLINE-DELINQ
                              END-IF
                           END-IF`,
  },
  'dp-mt': {
    sourcePath: 'src/LNRULES.cbl',
    sourceFirstLine: 86,
    highlightStartLine: 2,
    highlightEndLine: 11,
    code: `       4000-DOWN-PAYMENT-RULE.
           IF LOAN-MORTGAGE
               IF CALC-DOWN-PCT < 5.00
                   MOVE "D003" TO REASON-CODE
                   MOVE "DECLINED - MORTGAGE DOWN PAYMENT BELOW 5%" TO REASON-TEXT
                   SET HARD-DECLINE TO TRUE
                   SET DECISION-DECLINED TO TRUE
               ELSE
                   IF CALC-DOWN-PCT < 20.00
                       SET MANUAL-REVIEW TO TRUE
                       MOVE "R101" TO REASON-CODE
                       MOVE "REVIEW - MORTGAGE DOWN PAYMENT BELOW 20%" TO REASON-TEXT
                   END-IF
               END-IF`,
  },
  'dp-au': {
    sourcePath: 'src/LNRULES.cbl',
    sourceFirstLine: 100,
    highlightStartLine: 3,
    highlightEndLine: 7,
    code: `           ELSE
               IF LOAN-AUTO
                   IF CALC-DOWN-PCT < 10.00
                       SET MANUAL-REVIEW TO TRUE
                       MOVE "R102" TO REASON-CODE
                       MOVE "REVIEW - AUTO DOWN PAYMENT BELOW 10%" TO REASON-TEXT
                   END-IF
               END-IF
           END-IF.`,
  },
  'dp-pl': {
    sourcePath: 'src/LNRULES.cbl',
    sourceFirstLine: 86,
    highlightStartLine: 16,
    highlightEndLine: 23,
    code: `       4000-DOWN-PAYMENT-RULE.
           IF LOAN-MORTGAGE
               IF CALC-DOWN-PCT < 5.00
                   MOVE "D003" TO REASON-CODE
                   MOVE "DECLINED - MORTGAGE DOWN PAYMENT BELOW 5%" TO REASON-TEXT
                   SET HARD-DECLINE TO TRUE
                   SET DECISION-DECLINED TO TRUE
               ELSE
                   IF CALC-DOWN-PCT < 20.00
                       SET MANUAL-REVIEW TO TRUE
                       MOVE "R101" TO REASON-CODE
                       MOVE "REVIEW - MORTGAGE DOWN PAYMENT BELOW 20%" TO REASON-TEXT
                   END-IF
               END-IF
           ELSE
               IF LOAN-AUTO
                   IF CALC-DOWN-PCT < 10.00
                       SET MANUAL-REVIEW TO TRUE
                       MOVE "R102" TO REASON-CODE
                       MOVE "REVIEW - AUTO DOWN PAYMENT BELOW 10%" TO REASON-TEXT
                   END-IF
               END-IF
           END-IF.
           *> Personal (PL): no extra IF in this paragraph; README treats PL down payment as compensating factor.`,
  },
  'rg-a': {
    sourcePath: 'src/LNRULES.cbl',
    sourceFirstLine: 110,
    highlightStartLine: 3,
    highlightEndLine: 8,
    code: `       5000-RISK-GRADE-RULE.
           IF NO-HARD-DECLINE
               IF APPL-CREDIT-SCORE >= 740
                   IF CALC-DTI-PCT <= 30.00
                       MOVE "A" TO RISK-GRADE
                   ELSE
                       MOVE "B" TO RISK-GRADE
                   END-IF`,
  },
  'rg-b': {
    sourcePath: 'src/LNRULES.cbl',
    sourceFirstLine: 118,
    highlightStartLine: 3,
    highlightEndLine: 8,
    code: `               ELSE
                   IF APPL-CREDIT-SCORE >= 680
                       IF CALC-DTI-PCT <= 36.00
                           MOVE "B" TO RISK-GRADE
                       ELSE
                           MOVE "C" TO RISK-GRADE
                       END-IF`,
  },
  'rg-c': {
    sourcePath: 'src/LNRULES.cbl',
    sourceFirstLine: 125,
    highlightStartLine: 3,
    highlightEndLine: 14,
    code: `                   ELSE
                       IF APPL-CREDIT-SCORE >= 620
                           IF CALC-DTI-PCT <= 40.00
                               MOVE "C" TO RISK-GRADE
                           ELSE
                               MOVE "R" TO RISK-GRADE
                               SET MANUAL-REVIEW TO TRUE
                               MOVE "R201" TO REASON-CODE
                               MOVE "REVIEW - BORDERLINE CREDIT AND DTI" TO REASON-TEXT
                           END-IF
                       ELSE
                           MOVE "D" TO RISK-GRADE
                           PERFORM 9100-DECLINE-CREDIT
                       END-IF
                   END-IF
               END-IF
           END-IF.`,
  },
  'fd-hard': {
    sourcePath: 'src/LNRULES.cbl',
    sourceFirstLine: 143,
    highlightStartLine: 2,
    highlightEndLine: 3,
    code: `       6000-FINAL-DECISION.
           IF HARD-DECLINE
               SET DECISION-DECLINED TO TRUE
           ELSE
               IF MANUAL-REVIEW`,
  },
  'fd-review': {
    sourcePath: 'src/LNRULES.cbl',
    sourceFirstLine: 146,
    highlightStartLine: 4,
    highlightEndLine: 9,
    code: `           ELSE
               IF MANUAL-REVIEW
                   SET DECISION-REVIEW TO TRUE
                   IF REASON-TEXT = SPACES
                       MOVE "R999" TO REASON-CODE
                       MOVE "REVIEW - POLICY EXCEPTION REQUIRED" TO REASON-TEXT
                   END-IF
               ELSE
                   SET DECISION-APPROVED TO TRUE`,
  },
  'fd-appr': {
    sourcePath: 'src/LNRULES.cbl',
    sourceFirstLine: 153,
    highlightStartLine: 2,
    highlightEndLine: 5,
    code: `               ELSE
                   SET DECISION-APPROVED TO TRUE
                   MOVE "A001" TO REASON-CODE
                   MOVE "APPROVED - MEETS BANK CREDIT POLICY" TO REASON-TEXT
               END-IF
           END-IF.`,
  },
  'rate-base': {
    sourcePath: 'src/LNRATE.cbl',
    sourceFirstLine: 25,
    highlightStartLine: 2,
    highlightEndLine: 10,
    code: `       1000-BASE-RATE.
           IF LOAN-MORTGAGE
               MOVE 6.75 TO WS-BASE-RATE
           ELSE
               IF LOAN-AUTO
                   MOVE 7.50 TO WS-BASE-RATE
               ELSE
                   MOVE 11.25 TO WS-BASE-RATE
               END-IF
           END-IF.`,
  },
  'rate-addon': {
    sourcePath: 'src/LNRATE.cbl',
    sourceFirstLine: 36,
    highlightStartLine: 2,
    highlightEndLine: 9,
    code: `       2000-RISK-ADJUSTMENT.
           EVALUATE LK-RISK-GRADE
               WHEN "A"
                   MOVE 0.00 TO WS-RISK-ADDON
               WHEN "B"
                   MOVE 1.25 TO WS-RISK-ADDON
               WHEN "C"
                   MOVE 2.75 TO WS-RISK-ADDON
               WHEN OTHER
                   MOVE 4.50 TO WS-RISK-ADDON
           END-EVALUATE
           IF LK-DTI-PCT > 38.00
               ADD 0.50 TO WS-RISK-ADDON
           END-IF.`,
  },
  'rate-dti': {
    sourcePath: 'src/LNRATE.cbl',
    sourceFirstLine: 36,
    highlightStartLine: 12,
    highlightEndLine: 14,
    code: `       2000-RISK-ADJUSTMENT.
           EVALUATE LK-RISK-GRADE
               WHEN "A"
                   MOVE 0.00 TO WS-RISK-ADDON
               WHEN "B"
                   MOVE 1.25 TO WS-RISK-ADDON
               WHEN "C"
                   MOVE 2.75 TO WS-RISK-ADDON
               WHEN OTHER
                   MOVE 4.50 TO WS-RISK-ADDON
           END-EVALUATE
           IF LK-DTI-PCT > 38.00
               ADD 0.50 TO WS-RISK-ADDON
           END-IF.`,
  },
};

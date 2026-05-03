       IDENTIFICATION DIVISION.
       PROGRAM-ID. LNRULES.

       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01  WS-ANNUAL-DEBT              PIC 9(9)V99.
       01  WS-BASE-STATUS              PIC X VALUE "A".
           88  BASE-APPROVED           VALUE "A".
           88  BASE-REVIEW             VALUE "R".
           88  BASE-DECLINED           VALUE "D".

       LINKAGE SECTION.
       COPY "APPLICANT.cpy".
       COPY "DECISION.cpy".

       PROCEDURE DIVISION USING APPLICANT-REC
                                APPLICANT-CALC
                                DECISION-REC
                                RULE-FLAGS.
       MAIN-PROCEDURE.
           PERFORM 1000-INITIALIZE
           PERFORM 2000-CALCULATE-RATIOS
           PERFORM 3000-HARD-DECLINE-RULES
           IF NO-HARD-DECLINE
               PERFORM 4000-DOWN-PAYMENT-RULE
               PERFORM 5000-RISK-GRADE-RULE
               PERFORM 6000-FINAL-DECISION
           END-IF
           GOBACK.

       1000-INITIALIZE.
           SET NO-HARD-DECLINE TO TRUE
           SET NO-MANUAL-REVIEW TO TRUE
           SET DECISION-APPROVED TO TRUE
           MOVE "U" TO RISK-GRADE
           MOVE 0 TO APPROVED-APR
           MOVE SPACES TO REASON-CODE REASON-TEXT
           SET BASE-APPROVED TO TRUE.

       2000-CALCULATE-RATIOS.
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
           END-IF.

       3000-HARD-DECLINE-RULES.
           IF APPL-CREDIT-SCORE < 580
               PERFORM 9100-DECLINE-CREDIT
           ELSE
               IF CALC-DTI-PCT > 43.00
                   PERFORM 9200-DECLINE-DTI
               ELSE
                   IF CALC-LTI-RATIO > 5.00
                       PERFORM 9300-DECLINE-LTI
                   ELSE
                       IF APPL-EMP-MONTHS < 24
                           PERFORM 9400-DECLINE-EMPLOYMENT
                       ELSE
                           IF APPL-BANKRUPT-YEARS < 7
                              PERFORM 9500-DECLINE-BANKRUPTCY
                           ELSE
                              IF APPL-DELINQ-COUNT > 2
                                  PERFORM 9600-DECLINE-DELINQ
                              END-IF
                           END-IF
                       END-IF
                   END-IF
               END-IF
           END-IF.

       4000-DOWN-PAYMENT-RULE.
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

       5000-RISK-GRADE-RULE.
           IF NO-HARD-DECLINE
               IF APPL-CREDIT-SCORE >= 740
                   IF CALC-DTI-PCT <= 30.00
                       MOVE "A" TO RISK-GRADE
                   ELSE
                       MOVE "B" TO RISK-GRADE
                   END-IF
               ELSE
                   IF APPL-CREDIT-SCORE >= 680
                       IF CALC-DTI-PCT <= 36.00
                           MOVE "B" TO RISK-GRADE
                       ELSE
                           MOVE "C" TO RISK-GRADE
                       END-IF
                   ELSE
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
           END-IF.

       6000-FINAL-DECISION.
           IF HARD-DECLINE
               SET DECISION-DECLINED TO TRUE
           ELSE
               IF MANUAL-REVIEW
                   SET DECISION-REVIEW TO TRUE
                   IF REASON-TEXT = SPACES
                       MOVE "R999" TO REASON-CODE
                       MOVE "REVIEW - POLICY EXCEPTION REQUIRED" TO REASON-TEXT
                   END-IF
               ELSE
                   SET DECISION-APPROVED TO TRUE
                   MOVE "A001" TO REASON-CODE
                   MOVE "APPROVED - MEETS BANK CREDIT POLICY" TO REASON-TEXT
               END-IF
           END-IF.

       9100-DECLINE-CREDIT.
           SET HARD-DECLINE TO TRUE
           SET DECISION-DECLINED TO TRUE
           MOVE "D001" TO REASON-CODE
           MOVE "DECLINED - CREDIT SCORE BELOW POLICY MINIMUM" TO REASON-TEXT.

       9200-DECLINE-DTI.
           SET HARD-DECLINE TO TRUE
           SET DECISION-DECLINED TO TRUE
           MOVE "D002" TO REASON-CODE
           MOVE "DECLINED - DEBT TO INCOME ABOVE 43%" TO REASON-TEXT.

       9300-DECLINE-LTI.
           SET HARD-DECLINE TO TRUE
           SET DECISION-DECLINED TO TRUE
           MOVE "D004" TO REASON-CODE
           MOVE "DECLINED - LOAN AMOUNT EXCEEDS INCOME MULTIPLE" TO REASON-TEXT.

       9400-DECLINE-EMPLOYMENT.
           SET HARD-DECLINE TO TRUE
           SET DECISION-DECLINED TO TRUE
           MOVE "D005" TO REASON-CODE
           MOVE "DECLINED - EMPLOYMENT HISTORY BELOW 24 MONTHS" TO REASON-TEXT.

       9500-DECLINE-BANKRUPTCY.
           SET HARD-DECLINE TO TRUE
           SET DECISION-DECLINED TO TRUE
           MOVE "D006" TO REASON-CODE
           MOVE "DECLINED - BANKRUPTCY WITHIN LAST 7 YEARS" TO REASON-TEXT.

       9600-DECLINE-DELINQ.
           SET HARD-DECLINE TO TRUE
           SET DECISION-DECLINED TO TRUE
           MOVE "D007" TO REASON-CODE
           MOVE "DECLINED - TOO MANY RECENT DELINQUENCIES" TO REASON-TEXT.

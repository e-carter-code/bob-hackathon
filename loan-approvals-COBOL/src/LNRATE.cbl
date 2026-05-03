       IDENTIFICATION DIVISION.
       PROGRAM-ID. LNRATE.

       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01  WS-BASE-RATE                PIC 9(2)V99.
       01  WS-RISK-ADDON               PIC 9(2)V99.

       LINKAGE SECTION.
       COPY "APPLICANT.cpy".
       01  LK-DTI-PCT                  PIC 9(3)V99.
       01  LK-RISK-GRADE               PIC X.
       01  LK-APPROVED-APR             PIC 9(2)V99.

       PROCEDURE DIVISION USING APPLICANT-REC
                                LK-DTI-PCT
                                LK-RISK-GRADE
                                LK-APPROVED-APR.
       MAIN-PROCEDURE.
           PERFORM 1000-BASE-RATE
           PERFORM 2000-RISK-ADJUSTMENT
           COMPUTE LK-APPROVED-APR ROUNDED = WS-BASE-RATE + WS-RISK-ADDON
           GOBACK.

       1000-BASE-RATE.
           IF LOAN-MORTGAGE
               MOVE 6.75 TO WS-BASE-RATE
           ELSE
               IF LOAN-AUTO
                   MOVE 7.50 TO WS-BASE-RATE
               ELSE
                   MOVE 11.25 TO WS-BASE-RATE
               END-IF
           END-IF.

       2000-RISK-ADJUSTMENT.
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
           END-IF.

       IDENTIFICATION DIVISION.
       PROGRAM-ID. LNMAIN.

       ENVIRONMENT DIVISION.
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT APPLICANT-FILE ASSIGN TO "data/applicants.dat"
               ORGANIZATION IS LINE SEQUENTIAL.

       DATA DIVISION.
       FILE SECTION.
       FD  APPLICANT-FILE.
       01  APPLICANT-LINE              PIC X(64).

       WORKING-STORAGE SECTION.
       01  WS-EOF                      PIC X VALUE "N".
           88  END-OF-FILE             VALUE "Y".
           88  MORE-RECORDS            VALUE "N".
       01  WS-COUNTS.
           05  WS-TOTAL                PIC 9(4) VALUE 0.
           05  WS-APPROVED             PIC 9(4) VALUE 0.
           05  WS-REVIEW               PIC 9(4) VALUE 0.
           05  WS-DECLINED             PIC 9(4) VALUE 0.
       01  WS-DISPLAY.
           05  WS-DTI-DISPLAY          PIC ZZ9.99.
           05  WS-APR-DISPLAY          PIC Z9.99.

       COPY "APPLICANT.cpy".
       COPY "DECISION.cpy".

       PROCEDURE DIVISION.
       MAIN-PROCEDURE.
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
           OPEN INPUT APPLICANT-FILE.

       2000-PRINT-HEADER.
           DISPLAY "LEGACY BANK LOAN APPROVAL BATCH"
           DISPLAY "ID    NAME                 TYPE SCORE DTI    DEC APR  REASON"
           DISPLAY "----- -------------------- ---- ----- ------ --- ---- ------------------------------".

       3000-READ-APPLICATION.
           READ APPLICANT-FILE
               AT END
                   SET END-OF-FILE TO TRUE
               NOT AT END
                   SET MORE-RECORDS TO TRUE
                   MOVE APPLICANT-LINE TO APPLICANT-REC
           END-READ.

       4000-PROCESS-APPLICATION.
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
           PERFORM 4100-PRINT-DECISION.

       4100-PRINT-DECISION.
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
           DISPLAY "DECLINED           : " WS-DECLINED.

       01  APPLICANT-REC.
           05  APPL-ID                 PIC X(5).
           05  APPL-NAME               PIC X(20).
           05  APPL-LOAN-TYPE          PIC X(2).
               88  LOAN-MORTGAGE       VALUE "MT".
               88  LOAN-AUTO           VALUE "AU".
               88  LOAN-PERSONAL       VALUE "PL".
           05  APPL-ANNUAL-INCOME      PIC 9(8).
           05  APPL-LOAN-AMOUNT        PIC 9(8).
           05  APPL-MONTHLY-DEBT       PIC 9(5).
           05  APPL-CREDIT-SCORE       PIC 9(3).
           05  APPL-EMP-MONTHS         PIC 9(2).
           05  APPL-BANKRUPT-YEARS     PIC 9(2).
           05  APPL-DELINQ-COUNT       PIC 9.
           05  APPL-DOWN-PAYMENT       PIC 9(8).

       01  APPLICANT-CALC.
           05  CALC-MONTHLY-INCOME     PIC 9(7)V99.
           05  CALC-DTI-PCT            PIC 9(3)V99.
           05  CALC-LTI-RATIO          PIC 9(3)V99.
           05  CALC-DOWN-PCT           PIC 9(3)V99.

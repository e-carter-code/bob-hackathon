       01  DECISION-REC.
           05  DECISION-CODE           PIC X(1).
               88  DECISION-APPROVED   VALUE "A".
               88  DECISION-REVIEW     VALUE "R".
               88  DECISION-DECLINED   VALUE "D".
           05  RISK-GRADE              PIC X(1).
           05  APPROVED-APR            PIC 9(2)V99.
           05  REASON-CODE             PIC X(4).
           05  REASON-TEXT             PIC X(60).

       01  RULE-FLAGS.
           05  HARD-DECLINE-FLAG       PIC X.
               88  HARD-DECLINE        VALUE "Y".
               88  NO-HARD-DECLINE     VALUE "N".
           05  MANUAL-REVIEW-FLAG      PIC X.
               88  MANUAL-REVIEW       VALUE "Y".
               88  NO-MANUAL-REVIEW    VALUE "N".

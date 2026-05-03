/**
 * Natural-language copy for the Editor inspector (no COBOL line lists).
 * Aligns with hierarchy ids from `analysisLoanApprovalsCobol.ts`.
 */

export const EDITOR_DOMAIN_DESCRIPTION: Record<string, string> = {
  'batch-io':
    'Runs the batch job that reads each application line, calls the rules engine, prints decisions, and closes files when the run finishes.',
  eligibility:
    'Prepares the numbers the rest of the policy uses: monthly income, debt-to-income, how large the loan is compared to income, and how strong the down payment is.',
  'hard-decline':
    'Applies the bank’s hard stops—credit score, debt load, loan size versus income, job history, bankruptcy, and payment history—before any softer pricing rules run.',
  'down-payment':
    'Looks at how much the borrower is putting down and treats mortgage, auto, and personal loans differently when the down payment is thin.',
  'risk-grade':
    'Combines credit score and debt picture into a simple risk grade that later drives pricing and exceptions.',
  'final-decision':
    'Turns all earlier flags into the final story: declined with a clear reason, sent for a human review, or approved under policy.',
  'apr-pricing':
    'After an approval, picks a starting rate for the product type and adjusts it for risk and how stretched the borrower is on debt.',
};

/** One-sentence business meaning per hierarchy leaf (plain language). */
export const EDITOR_LEAF_BUSINESS_MEANING: Record<string, string> = {
  'lnmain-open': 'Opens the applicant file so the batch can read records.',
  'lnmain-read': 'Reads the next line from the file until the batch reaches the end.',
  'lnmain-call': 'Runs the full rules program on each applicant, then calls pricing only when the decision is approve.',
  'lnmain-print': 'Writes one line per applicant and prints batch totals when the job completes.',
  'calc-income': 'Turns annual income into a monthly figure used for ratio math.',
  'calc-dti': 'Measures total monthly debt against income to see how heavy the load is.',
  'calc-lti': 'Compares the loan amount to yearly income so oversized requests stand out.',
  'calc-down': 'Expresses the down payment as a share of the loan so weak equity is visible.',
  'rule-credit': 'Stops the file cold when the credit score is below the bank’s minimum.',
  'rule-dti': 'Declines when debt-to-income is above the policy ceiling—this threshold is editable in the demo.',
  'rule-lti': 'Declines when the loan is too large relative to what the borrower earns.',
  'rule-emp': 'Requires enough months on the job before the bank will consider the case.',
  'rule-bk': 'Blocks or routes cases with a very recent bankruptcy on record.',
  'rule-del': 'Limits how many recent missed payments the policy will tolerate.',
  'dp-mt': 'For mortgages, very small down payments decline; middling down payments may go to manual review.',
  'dp-au': 'For auto loans, a small down payment can trigger a manual review instead of an automatic pass.',
  'dp-pl': 'For personal loans, down payment is treated more as a compensating factor than a hard gate.',
  'rg-a': 'Strong score and modest debt earn the best internal grade band.',
  'rg-b': 'Typical applicants land in the standard band with slightly wider debt tolerance.',
  'rg-c': 'Weaker score or stretched debt moves the case toward review or decline paths.',
  'fd-hard': 'When a hard decline fired, the outcome is a clean decline with a policy reason.',
  'fd-review': 'When something needs eyes, the case is parked for manual underwriting.',
  'fd-appr': 'When nothing blocks the file, the applicant is approved under the stated policy line.',
  'rate-base': 'Chooses a starting interest rate based on whether the product is mortgage, auto, or personal.',
  'rate-addon': 'Adds extra rate for riskier internal grades.',
  'rate-dti': 'Adds a small bump when debt-to-income is still acceptable but on the high side.',
};

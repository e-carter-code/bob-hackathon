# COBOL Loan Approval System Analysis

## Overview

This document describes the analysis and mapping of the Legacy Bank Loan Approval COBOL system into the Bob modernization platform.

## Source System

**Project**: loan-approvals-COBOL  
**Language**: COBOL (GnuCOBOL)  
**Programs**: 3 (LNMAIN, LNRULES, LNRATE)  
**Copybooks**: 2 (APPLICANT, DECISION)  
**Business Rules**: 8 core rules with 2 nested decision trees

## System Architecture

### Program Structure

```
LNMAIN.cbl (Main Program)
├── Reads fixed-width applicant file (64 characters per record)
├── Calls LNRULES for business rule evaluation
├── Calls LNRATE for APR calculation (if approved)
└── Prints decision output and batch summary

LNRULES.cbl (Business Rules Engine)
├── Calculates financial ratios (DTI, LTI, Down Payment %)
├── Evaluates 6 hard decline rules
├── Evaluates nested down payment rule (3 conditions)
├── Evaluates nested risk grade rule (7 conditions)
└── Determines final decision (Approve/Review/Decline)

LNRATE.cbl (APR Calculator)
├── Determines base rate by loan type
├── Applies risk grade adjustment
└── Applies high DTI penalty
```

## Business Rules Extracted

### 1. Hard Decline Rules (6 rules)

These rules immediately decline an application if violated:

| Rule ID | Name | Condition | Decision Code |
|---------|------|-----------|---------------|
| D001 | Minimum Credit Score | Credit Score < 580 | DECLINED |
| D002 | Maximum DTI | DTI > 43.00% | DECLINED |
| D004 | Maximum LTI | Loan Amount > 5x Annual Income | DECLINED |
| D005 | Minimum Employment | Employment < 24 months | DECLINED |
| D006 | Bankruptcy Lookback | Bankruptcy within 7 years | DECLINED |
| D007 | Maximum Delinquencies | Recent Delinquencies > 2 | DECLINED |

**Source**: LNRULES.cbl, lines 62-84

### 2. Down Payment Rule (Nested - 3 conditions)

This rule has different thresholds based on loan type:

**Mortgage Loans**:
- Down Payment < 5%: **DECLINE** (D003)
- Down Payment < 20%: **MANUAL REVIEW** (R101)
- Down Payment >= 20%: Continue processing

**Auto Loans**:
- Down Payment < 10%: **MANUAL REVIEW** (R102)
- Down Payment >= 10%: Continue processing

**Personal Loans**:
- Down payment treated as compensating factor (no specific threshold)

**Source**: LNRULES.cbl, lines 86-108  
**Nesting Depth**: 3 levels

### 3. Risk Grade Rule (Nested - 7 conditions)

This rule assigns a risk grade based on credit score and DTI:

| Credit Score | DTI Threshold | Risk Grade | Action |
|--------------|---------------|------------|--------|
| >= 740 | <= 30% | A | Approve |
| >= 740 | > 30% | B | Approve |
| >= 680 | <= 36% | B | Approve |
| >= 680 | > 36% | C | Approve |
| >= 620 | <= 40% | C | Approve |
| >= 620 | > 40% | R | Manual Review (R201) |
| < 620 | Any | D | Decline (D001) |

**Source**: LNRULES.cbl, lines 110-141  
**Nesting Depth**: 3 levels

### 4. APR Calculation Rules (7 rules)

**Base Rates by Loan Type**:
- Mortgage: 6.75%
- Auto: 7.50%
- Personal: 11.25%

**Risk Grade Adjustments**:
- Grade A: +0.00%
- Grade B: +1.25%
- Grade C: +2.75%
- Other: +4.50%

**Additional Penalty**:
- DTI > 38%: +0.50%

**Source**: LNRATE.cbl, lines 25-49

## Data Structures

### Input Record (APPLICANT.cpy)

Fixed-width format (64 characters):

| Position | Field | Type | Description |
|----------|-------|------|-------------|
| 01-05 | Application ID | X(5) | Unique identifier |
| 06-25 | Applicant Name | X(20) | Full name |
| 26-27 | Loan Type | X(2) | MT/AU/PL |
| 28-35 | Annual Income | 9(8) | No decimals |
| 36-43 | Loan Amount | 9(8) | No decimals |
| 44-48 | Monthly Debt | 9(5) | No decimals |
| 49-51 | Credit Score | 9(3) | 300-850 |
| 52-53 | Employment Months | 9(2) | Months |
| 54-55 | Bankruptcy Years | 9(2) | 99 = never |
| 56-56 | Delinquencies | 9 | Count |
| 57-64 | Down Payment | 9(8) | No decimals |

### Output Record (DECISION.cpy)

| Field | Type | Values |
|-------|------|--------|
| Decision Code | X(1) | A/R/D |
| Risk Grade | X(1) | A/B/C/R/D |
| Approved APR | 9(2)V99 | Percentage |
| Reason Code | X(4) | A001, D001-D007, R101-R999 |
| Reason Text | X(60) | Human-readable message |

## Decision Codes

### Approval Codes
- **A001**: APPROVED - MEETS BANK CREDIT POLICY

### Decline Codes
- **D001**: DECLINED - CREDIT SCORE BELOW POLICY MINIMUM
- **D002**: DECLINED - DEBT TO INCOME ABOVE 43%
- **D003**: DECLINED - MORTGAGE DOWN PAYMENT BELOW 5%
- **D004**: DECLINED - LOAN AMOUNT EXCEEDS INCOME MULTIPLE
- **D005**: DECLINED - EMPLOYMENT HISTORY BELOW 24 MONTHS
- **D006**: DECLINED - BANKRUPTCY WITHIN LAST 7 YEARS
- **D007**: DECLINED - TOO MANY RECENT DELINQUENCIES

### Review Codes
- **R101**: REVIEW - MORTGAGE DOWN PAYMENT BELOW 20%
- **R102**: REVIEW - AUTO DOWN PAYMENT BELOW 10%
- **R201**: REVIEW - BORDERLINE CREDIT AND DTI
- **R999**: REVIEW - POLICY EXCEPTION REQUIRED

## Test Data

The system includes 8 sample applicants with expected outcomes:

| ID | Name | Type | Score | DTI | Decision | APR | Reason |
|----|------|------|-------|-----|----------|-----|--------|
| 10001 | ALICE MARTIN | MT | 780 | 11.37% | APPROVED | 6.75% | A001 |
| 10002 | BRIAN CHEN | AU | 710 | 23.23% | REVIEW | 0.00% | R102 |
| 10003 | CARLA DIAZ | PL | 650 | 57.50% | DECLINED | 0.00% | D002 |
| 10004 | DAVID NGUYEN | MT | 735 | 27.27% | APPROVED | 8.00% | A001 |
| 10005 | EMMA ROBERTS | AU | 690 | 15.00% | DECLINED | 0.00% | D005 |
| 10006 | FRANK HARRIS | PL | 560 | 43.76% | DECLINED | 0.00% | D001 |
| 10007 | GRACE KIM | MT | 625 | 27.69% | DECLINED | 0.00% | D003 |
| 10008 | HENRY SINGH | AU | 675 | 27.86% | DECLINED | 0.00% | D005 |

**Results**: 2 Approved, 1 Manual Review, 5 Declined

## Mapping to Bob Platform

### Frontend Integration

**File**: `frontend/src/data/cobolLoanData.ts`

This file contains:
- Complete rule definitions with source line references
- Logic hierarchy matching COBOL program structure
- Sample test data from applicants.dat
- System summary statistics

**File**: `frontend/src/pages/AnalysisPage.tsx`

Updated to display:
- COBOL program count and structure
- Business rule hierarchy with nesting visualization
- Rule details with conditions and decision codes
- Complexity analysis by domain
- Sample applicant test results

### Visual Hierarchy

```
Legacy Bank Loan Approval System
├── Input Processing
│   ├── Read Fixed-Width Applicant File
│   └── Parse 64-Character Record
├── Financial Ratio Calculations
│   ├── Calculate Debt-to-Income Ratio
│   ├── Calculate Loan-to-Income Ratio
│   └── Calculate Down Payment Percentage
├── Hard Decline Rules (6 rules)
│   ├── Minimum Credit Score
│   ├── Maximum Debt-to-Income Ratio
│   ├── Maximum Loan-to-Income Ratio
│   ├── Minimum Employment History
│   ├── Bankruptcy Lookback Period
│   └── Maximum Recent Delinquencies
├── Down Payment Rule (Nested - 3 conditions)
│   ├── Mortgage Down Payment Logic
│   │   ├── Hard Decline (< 5%)
│   │   └── Manual Review (< 20%)
│   └── Auto Loan Down Payment Logic
│       └── Manual Review (< 10%)
├── Risk Grade Rule (Nested - 7 conditions)
│   ├── Excellent Credit (740+)
│   │   ├── Grade A (DTI <= 30%)
│   │   └── Grade B (DTI > 30%)
│   ├── Good Credit (680-739)
│   │   ├── Grade B (DTI <= 36%)
│   │   └── Grade C (DTI > 36%)
│   ├── Fair Credit (620-679)
│   │   ├── Grade C (DTI <= 40%)
│   │   └── Manual Review (DTI > 40%)
│   └── Poor Credit (<620)
│       └── Decline
├── Final Decision Logic
│   ├── Approval Path
│   ├── Manual Review Path
│   └── Decline Path
├── APR Calculation
│   ├── Base Rate by Loan Type
│   │   ├── Mortgage: 6.75%
│   │   ├── Auto: 7.50%
│   │   └── Personal: 11.25%
│   └── Risk Grade Adjustment
│       ├── Grade A: +0.00%
│       ├── Grade B: +1.25%
│       ├── Grade C: +2.75%
│       └── High DTI Penalty: +0.50%
└── Output Formatting
    ├── Print Decision Line
    └── Print Batch Summary
```

## Complexity Analysis

| Domain | Complexity | Nesting Depth | Rules | Editable |
|--------|------------|---------------|-------|----------|
| Hard Decline Rules | High | 1 | 6 | 6 |
| Down Payment Rule | High | 3 | 3 | 3 |
| Risk Grade Rule | High | 3 | 7 | 7 |
| APR Calculation | Medium | 2 | 7 | 7 |
| Ratio Calculations | Low | 1 | 3 | 0 |
| Final Decision | Medium | 2 | 3 | 3 |

**Total**: 29 rules across 6 domains  
**Maximum Nesting Depth**: 3 levels  
**Editable Rules**: 26 (90%)

## Modernization Opportunities

### 1. Rule Extraction
All business rules have been extracted and documented with:
- Clear conditions and actions
- Source file and line references
- Decision codes and reason text
- Nesting structure preserved

### 2. Visual Representation
The Analysis Dashboard now displays:
- Complete COBOL program hierarchy
- Nested rule visualization
- Rule details with conditions
- Complexity metrics

### 3. Test Coverage
Sample applicants provide baseline test cases:
- 8 test scenarios covering all decision paths
- Expected outcomes documented
- Can be used for parity testing during modernization

### 4. API Modernization Path
The fixed-width input format can be replaced with:
- JSON REST API endpoints
- GraphQL queries
- Event-driven architecture

### 5. Rules Engine Migration
Business rules can be migrated to:
- Modern rules engine (Drools, Easy Rules)
- Decision tables
- Business process management (BPM) tools
- Low-code platforms

## Next Steps

1. **Visual Editor Integration**: Map COBOL rules to visual flow editor
2. **Test Automation**: Convert sample applicants to automated test suite
3. **API Design**: Design REST API matching COBOL input/output
4. **Rules Engine POC**: Implement one domain in modern rules engine
5. **Parity Testing**: Ensure modernized system matches COBOL results

## References

- **COBOL Source**: `../loan-approvals-COBOL/`
- **Frontend Data**: `frontend/src/data/cobolLoanData.ts`
- **Analysis Page**: `frontend/src/pages/AnalysisPage.tsx`
- **README**: `../loan-approvals-COBOL/README.md`

---

**Analysis Date**: 2026-05-02  
**Analyzed By**: IBM Bob  
**Status**: Complete
# Benchmark Run-Through 1: Priya (29, Bengaluru)

> **Profile Summary:** Senior Software Engineer at an MNC for 5 years. Net monthly salary: **₹1,10,000**. Existing car loan EMI: **₹14,000** (2 years left). Credit score: **780**. Monthly rent: **₹28,000** (Household living expenses: **₹40,000** total).  
> **Requested Loan:** **₹8,00,000** for a wedding.

---

## 1. Questions Asked & Information Value Progression

| Step # | Question ID | Question Title & Context | Priya's Answer | Information Value & Output Effect |
| :--- | :--- | :--- | :--- | :--- |
| **Q1** | `loanPurpose` | What will you use this money for? | `wedding_personal` | Non-collateralized personal consumption. |
| **Q2** | `requestedAmount` | How much money are you looking to borrow? | `₹8,00,000` | Sizing anchor for EMI and repayment ceiling. |
| **Q3** | `age` | What is your current age? | `29` | Full 5-year tenure availability before retirement. |
| **Q4** | `primaryIncomeSignal`| What is your primary income stream? | `salaried_corporate` | First routing signal: activates prime corporate salaried tier. |
| **Q5** | `netMonthlyIncome`| What is your net in-hand monthly income? | `₹1,10,000` | Sets 35% safe FOIR ceiling at ₹38,500/mo. |
| **Q6** | `existingMonthlyEMI`| Total existing monthly EMIs currently paying? | `₹14,000` (Car loan) | Consumes 12.7% FOIR, leaving ₹24,500/mo safe room. |
| **Q7** | `householdLivingExpenses`| Essential monthly household living expenses? | `₹40,000` (Rent ₹28k + ₹12k) | Verifies uncommitted cash flow: ₹56,000 free buffer. |
| **Q8** | `creditScoreStatus` | Approximate credit bureau score? | `750_plus` (780) | **Tightens fair rate band by -75 bps** (10.5%–12.0%); High confidence. |
| **Q9 (Dynamic)** | `variablePayPortionPercent`| What percentage of annual compensation is bonus? | `10%` | Variable pay $\le 15\%$; zero haircut on monthly salary. |
| **Q10 (Dynamic)**| `emergencySavingsMonths`| Liquid emergency savings in months? | `6 months` | Verifies strong resilience; zero distress penalty. |
| *Pruned* | *Collateral / Bounces / App Debt* | *Not asked (Information score = 0)* | *Skipped* | Zero relevance for an un-leveraged prime corporate employee. |

---

## 2. Four Deterministic Outputs

### O1 — Borrow Verdict
* **Verdict:** **`BORROW`**
* **One-Sentence Why:**
  > *"Your income stability, modest existing obligations (12.7% FOIR), and healthy cash-flow buffer comfortably support this requested ₹8,00,000 loan."*

---

### O2 — Maximum Safe Borrowing vs. Estimated Lender Range
* **Borrower-Safe Amount:** **₹7,50,000 – ₹8,50,000**
* **Estimated Lender-Eligible Range:** **₹12,00,000 – ₹14,00,000**
* **Why the divergence?**
  > Commercial banks use aggressive 50%–60% FOIR formulas and 60-month tenures to size eligibility around ₹13 Lakhs+. Taking ₹13L would double Priya's total interest outgo. **Priya should use her safe ₹8L figure as her ceiling.**

---

### O3 — Fair Interest Rate & Effective APR
* **Inferred Product Route:** **Unsecured Personal Loan** (Prime Tier)
* **Fair Interest Rate:** **10.5% – 12.0% p.a.**
* **Expected Initial Bank Quote:** **12.5% – 14.5% p.a.**
* **Effective All-In APR:** **11.4% – 12.9%** (includes standard 2% processing fee + 18% GST).
* **Confidence Level:** **HIGH** (Verified corporate salary + 780 bureau score).

---

### O4 — Recommended EMI Ceiling & Tenure Sensitivity

* **Recommended Safe Maximum EMI:** **₹24,500/month** (Total FOIR will remain at a safe 35.0%).

#### Tenure Trade-off Matrix (for ₹8,00,000 at 11.25% mid-rate):
| Tenure | Monthly EMI | Total Interest Payable | Total Repayment | Recommendation |
| :--- | :---: | :---: | :---: | :--- |
| **24 months** | ₹37,370 | ₹96,880 | ₹8,96,880 | Aggressive cash-flow drain |
| **36 months** | **₹26,290** | **₹1,46,440** | **₹9,46,440** | **Recommended Sweet Spot** |
| **48 months** | ₹20,770 | ₹1,96,960 | ₹9,96,960 | Safe buffer |
| **60 months** | ₹17,495 | ₹2,49,700 | ₹10,49,700 | Excessive interest (+₹1 Lakh) |

#### Stress Test Scenario:
* **20% Income Drop (₹1,10,000 → ₹88,000):** Total EMI obligation (Car ₹14k + Loan ₹24.5k = ₹38.5k) rises to **43.7%** of net income.
* **Verdict under stress:** Still below the 50% critical breach threshold.

---

## 3. Priya's Negotiation Card

```text
============================================================
              BORROWER NEGOTIATION CARD
Loan: Personal (Wedding)           Requested: ₹8,00,000
Borrower: Priya (29, Bengaluru)     Confidence: HIGH
Inferred Route: Prime Unsecured Personal Loan
============================================================

VERDICT: BORROW

[SAFE BORROWING CEILING]         [ESTIMATED LENDER RANGE]
₹7,50,000 – ₹8,50,000            ₹12,00,000 – ₹14,00,000
(Stick to your safe number!)     (Sales inflation trap)

[FAIR INTEREST RATE]             [ALL-IN EFFECTIVE APR]
10.5% – 12.0% p.a.               11.4% – 12.9% (with fees)

[SAFE EMI CEILING]
₹24,500 / month (Do not cross)

------------------------------------------------------------
WHAT TO SAY TO THE BANK LOAN OFFICER:
1. "My CIBIL score is 780 and I have 5 years at an MNC. I qualify 
   for your lowest tier of 10.5%–11.5%. If you quote 13%+, I will
   apply via my salary account bank."
2. "Quote the All-In APR in writing, including processing fee 
   and GST."
3. "Waive the processing fee from 2% to 0.75% or cap it at ₹5,000."
4. "I only want ₹8 Lakhs. Do not disburse a ₹12 Lakh loan."

DO NOT CROSS:
- Do not accept an EMI above ₹24,500/month.
- Do not take a 5-year tenure when a 3-year tenure saves ₹1,00,000.
============================================================
```

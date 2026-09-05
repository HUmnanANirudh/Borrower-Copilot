# Benchmark Run-Through 1: Priya (29, Bengaluru)

> **Profile Summary:** Senior Software Engineer at a large MNC for 5 years. Net monthly salary: **₹1,10,000**. Existing car loan EMI: **₹14,000** (2 years left). Credit score: **780**. Monthly rent: **₹28,000** (Household living expenses: **₹40,000** total).  
> **Requested Loan:** **₹8,00,000** Unsecured Personal Loan for a wedding.

---

## 1. Questions Asked & Answers

| Step # | Question ID | Question Title & Context | Priya's Answer | Output Tightening Effect |
| :--- | :--- | :--- | :--- | :--- |
| **Q1** | `loanPurpose` | What is the purpose of this loan? | `personal` (Wedding) | Classifies as non-collateralized personal consumption. |
| **Q2** | `loanType` | What type of loan are you exploring? | `unsecured_personal` | Sets baseline prime rack rate to 11.0%–12.5%. |
| **Q3** | `requestedAmount` | How much money are you looking to borrow? | `₹8,00,000` | Sizing anchor for EMI and affordability. |
| **Q4** | `age` | What is your current age? | `29` | Verifies full 5-year tenure availability before retirement. |
| **Q5** | `incomeType` | How do you earn your primary income? | `salaried_corporate` (MNC) | Unlocks prime corporate salary tier pricing. |
| **Q6** | `netMonthlyIncome`| What is your net in-hand monthly income? | `₹1,10,000` | Establishes 35% safe FOIR debt ceiling at ₹38,500/mo. |
| **Q7** | `existingMonthlyEMI`| Total existing monthly EMIs currently paying? | `₹14,000` (Car loan) | Consumes 12.7% of FOIR, leaving ₹24,500 safe capacity. |
| **Q8** | `householdExpenses`| Essential monthly household living expenses? | `₹40,000` (Rent ₹28k + ₹12k) | Verifies uncommitted cash flow: ₹56,000 free buffer. |
| **Q9** | `creditScoreBand` | Approximate credit score? | `750_plus` (780) | **Tightens rate band by -75 bps** to 10.5%–12.0%; High confidence. |
| **Q10** | `jobStability` | Stability of current employment? | `stable_2yr_plus` (5 years) | Qualifies for lowest bank risk margin. |
| **Q11 (Adaptive)** | `variablePayPercent`| What percentage of your annual pay is variable? | `10%` | Minor variable pay; no aggressive income haircut required. |

---

## 2. Four Deterministic Outputs

### O1 — Borrow Verdict
* **Verdict:** **`BORROW`**
* **One-Sentence Why:**
  > *"Your income stability (5 years at MNC), low existing debt ratio (12.7% FOIR), and healthy cash-flow buffer comfortably support this requested ₹8,00,000 loan."*

---

### O2 — Maximum Safe Borrowing vs. Lender Sanction
* **Borrower-Safe Amount:** **₹7,50,000 – ₹8,50,000**
* **Lender Likely Sanction:** **₹12,00,000 – ₹14,00,000**
* **Why the divergence?**
  > Banks use 60% aggressive FOIR and stretch tenure to 5 years (60 months) to push ₹13 Lakhs+. Taking ₹13L would double Priya's interest burden. **Priya should use the safe ₹8L figure as her ceiling.**

---

### O3 — Fair Interest Rate & All-In APR
* **Fair Interest Rate:** **10.5% – 12.0% p.a.**
* **Expected Initial Bank Quote:** **12.5% – 14.5% p.a.**
* **Effective All-In APR:** **11.4% – 12.9%** (includes 2% processing fee + 18% GST).
* **Confidence Level:** **HIGH** (Verified MNC salary slip + 780 CIBIL score).

---

### O4 — Recommended EMI Ceiling & Tenure Sensitivity

* **Recommended Safe Maximum EMI:** **₹24,500/month** (Total FOIR will remain at a safe 35.0%).

#### Tenure Trade-off Matrix (for ₹8,00,000 at 11.25% mid-rate):
| Tenure | Monthly EMI | Total Interest Payable | Total Repayment | Recommendation |
| :--- | :---: | :---: | :---: | :--- |
| **24 months** | ₹37,370 | ₹96,880 | ₹8,96,880 | Tight on cash flow |
| **36 months** | **₹26,290** | **₹1,46,440** | **₹9,46,440** | **Recommended Sweet Spot** |
| **48 months** | ₹20,770 | ₹1,96,960 | ₹9,96,960 | Safe buffer |
| **60 months** | ₹17,495 | ₹2,49,700 | ₹10,49,700 | Excessive interest (+₹1 Lakh) |

#### Stress Test Scenario:
* **20% Income Drop (₹1,10,000 → ₹88,000):** Total EMI obligation (Car ₹14k + Loan ₹24.5k = ₹38.5k) rises to **43.7%** of net income.
* **Verdict under stress:** Still well below the 50% critical breach threshold.

---

## 3. Priya's Negotiation Card

```text
============================================================
              BORROWER NEGOTIATION CARD
Loan: Personal (Wedding)           Requested: ₹8,00,000
Borrower: Priya (29, Bengaluru)     Confidence: HIGH
============================================================

VERDICT: BORROW

[SAFE BORROWING CEILING]         [LIKELY LENDER SANCTION]
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

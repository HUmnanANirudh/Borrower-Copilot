# Benchmark Run-Through 2: Ravi (42, Mysuru)

> **Profile Summary:** Kirana store owner for 14 years. Cash income **₹40,000–80,000/month** (avg ~₹60,000/mo profit). ITR shows **₹4,20,000/year** (taxable net: **₹35,000/mo**). Wife earns **₹18,000/mo** teaching (Combined household income: **₹78,000/mo**). Zero existing formal loans. Household living expenses: **₹32,000/mo**. Owns shop premises: **₹45,00,000 unencumbered property**. No formal credit bureau score (Unknown).  
> **Requested Loan:** **₹15,00,000** for a second stock line and delivery vehicle (Exploring Unsecured Personal Loan).

---

## 1. Questions Asked & Answers

| Step # | Question ID | Question Title & Context | Ravi's Answer | Output Tightening Effect |
| :--- | :--- | :--- | :--- | :--- |
| **Q1** | `loanPurpose` | What is the purpose of this loan? | `business_expansion` (Inventory/Vehicle) | Productive asset purchase; should yield incremental business revenue. |
| **Q2** | `loanType` | What type of loan are you exploring? | `unsecured_personal` | Triggers immediate risk inspection for ticket size >₹10L. |
| **Q3** | `requestedAmount` | How much money are you looking to borrow? | `₹15,00,000` | Sizing anchor. Massive mismatch with ₹35k ITR income. |
| **Q4** | `age` | What is your current age? | `42` | Tenure up to 15 years possible on secured commercial products. |
| **Q5** | `incomeType` | How do you earn your primary income? | `self_employed_business` | Flags ITR requirement and informal cash flow audit. |
| **Q6** | `netMonthlyIncome`| What is your net in-hand monthly income? | `₹78,000` (₹60k + ₹18k wife) | Total household capacity baseline. |
| **Q7** | `existingMonthlyEMI`| Total existing monthly EMIs currently paying? | `₹0` | Zero existing debt gives clean repayment slate. |
| **Q8** | `householdExpenses`| Essential monthly household living expenses? | `₹32,00,000` | Leaves healthy uncommitted cash flow of ~₹46,000/mo. |
| **Q9** | `creditScoreBand` | Approximate credit score? | `unknown` (No bureau history) | **UNKNOWN IS NOT ZERO**. Widens band by 300 bps; lowers confidence. |
| **Q10** | `jobStability` | Stability of business? | `stable_2yr_plus` (14 years) | Long operating vintage counter-balances lack of bureau score. |
| **Q11 (Adaptive)** | `hasCollateralProperty`| Do you own any clear-title property to pledge? | `true` (Shop worth ₹45L) | **GAME CHANGER: Triggers redirect from Unsecured PL to LAP**. |

---

## 2. Four Deterministic Outputs

### O1 — Borrow Verdict
* **Verdict:** **`BORROW LESS` (on Unsecured PL) / `BORROW` (via Secured LAP Route)**
* **One-Sentence Why:**
  > *"₹15,00,000 as an unsecured personal loan is unsafe on documented ITR income (₹35k/mo) and carries 16%–20% interest; shift to a Secured Loan Against Property (LAP) using your ₹45L shop to borrow safely at 9%–10%."*

---

### O2 — Maximum Safe Borrowing vs. Lender Sanction

#### Path A: If Ravi insists on an Unsecured Personal Loan
* **Lender Sanction:** **₹4,00,000 – ₹5,50,000** (Banks underwrite strictly on ₹35k ITR, ignoring unverified kirana cash).
* **Borrower-Safe Amount:** **₹4,50,000 – ₹6,00,000**
* *Verdict:* Ravi will face severe under-funding or flat rejection if he applies for ₹15L unsecured.

#### Path B: Recommended Product Routing — Secured LAP (Loan Against Property)
* **Lender LAP Sanction:** **₹15,00,000 – ₹25,00,000** (Up to 50% LTV of the ₹45L unencumbered shop).
* **Borrower-Safe LAP Amount:** **₹15,00,000 – ₹18,00,000** (Comfortably supported by combined ₹78k cash flow over 7–10 years).

---

### O3 — Fair Interest Rate & All-In APR
* **Unsecured Personal Loan Rate (if attempted):** **15.5% – 18.5% p.a.** (High risk due to unknown bureau + business).
* **Secured LAP Fair Rate:** **9.0% – 10.5% p.a.** (Saves over **700 bps / ₹5,50,000+** in interest over loan life!).
* **Effective APR on LAP:** **9.7% – 11.2%** (with 1.5% valuation and processing fee).
* **Confidence Level:** **MEDIUM** (High operating vintage of 14 years, but missing credit bureau record widens pricing band).

---

### O4 — Recommended Safe EMI Ceiling & Tenure Sensitivity

* **Recommended Safe Maximum EMI:** **₹27,300/month** (35% of household net cash income).

#### Comparison: Unsecured vs. Secured LAP for ₹15,00,000:
| Loan Product | Tenure | Interest Rate | Monthly EMI | Total Interest | Feasibility |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Unsecured Personal Loan** | 5 years (60m) | 17.0% | ₹37,280 | ₹7,36,700 | **UNSAFE / REJECTED** (EMI breaches safe cap) |
| **Secured LAP (Recommended)** | **7 years (84m)** | **9.75%** | **₹24,780** | **₹5,81,500** | **SAFE & AFFORDABLE** (Within ₹27k ceiling) |
| **Secured LAP (Comfort)** | 10 years (120m) | 10.0% | ₹19,820 | ₹8,78,700 | Maximum cash buffer |

#### Stress Test Scenario:
* **20% Income Drop (₹78,000 → ₹62,400):** LAP EMI of ₹24,780 rises from 31.7% to **39.7%** of income.
* **Verdict:** Safe. Even during a poor retail month, the family maintains a ₹37,000 buffer for living expenses.

---

## 3. Ravi's Negotiation Card

```text
============================================================
              BORROWER NEGOTIATION CARD
Loan: Business Expansion / Stock   Requested: ₹15,00,000
Borrower: Ravi (42, Mysuru)         Confidence: MEDIUM (No CIBIL)
============================================================

VERDICT: BORROW (VIA SECURED LAP ONLY - AVOID UNSECURED PL)

[RECOMMENDED PRODUCT]            [UNSECURED PL (AVOID!)]
Secured Loan Against Property    Unsecured Personal Loan
Eligible: ₹15L – ₹25L (50% LTV)  Sanction: Capped at ₹5L max!
Fair Rate: 9.0% – 10.5% p.a.     Rate: 16% – 19% (Predatory)

[SAFE EMI CEILING]               [RECOMMENDED TENURE]
₹27,300 / month                  7 Years (84 Months)
Target EMI: ~₹24,780/month

------------------------------------------------------------
WHAT TO SAY TO THE BANK MANAGER:
1. "Do not offer me a retail personal loan. I have unencumbered
   commercial shop premises in Mysuru worth ₹45 Lakhs. I want a
   SME Loan Against Property (LAP) / Vyapar Loan."
2. "My store has operated for 14 continuous years at this location.
   I can provide 12 months bank statements showing healthy turnover."
3. "My wife is a co-applicant with ₹18,000/mo steady teaching salary."
4. "Quote me the MSME Priority Sector Lending rate: 9.25%–10.0%."

DO NOT CROSS:
- Do not sign for an unsecured personal loan at 15%+ interest.
- Do not accept an EMI higher than ₹27,300/month.
- Never hand over original title deeds without an official Bank 
  acknowledgement letter.
============================================================
```

# Benchmark Run-Through 2: Ravi (42, Mysuru)

> **Profile Summary:** Kirana store owner for 14 years. Cash income **₹40,000–80,000/month** (avg ~₹60,000/mo net profit). ITR shows **₹4,20,000/year** (taxable net: **₹35,000/mo**). Wife earns **₹18,000/mo** teaching (Combined household income: **₹78,000/mo**). Zero existing debt. Household living expenses: **₹32,000/mo**. Owns shop premises: **₹45,00,000 unencumbered property**. No formal credit bureau score (Unknown).  
> **Requested Loan:** **₹15,00,000** for a second stock line and delivery vehicle.

---

## 1. Questions Asked & Information Value Progression

| Step # | Question ID | Question Title & Context | Ravi's Answer | Information Value & Output Effect |
| :--- | :--- | :--- | :--- | :--- |
| **Q1** | `loanPurpose` | What will you use this money for? | `business_expansion` | Productive asset purchase; flags SME underwriting. |
| **Q2** | `requestedAmount` | How much money are you looking to borrow? | `₹15,00,000` | Sizing anchor; high ticket vs documented ITR. |
| **Q3** | `age` | What is your current age? | `42` | Tenure up to 10–15 years available on secured SME products. |
| **Q4** | `primaryIncomeSignal`| What is your primary income stream? | `self_employed_business` | Routing signal: checks ITR vs cash and vintage. |
| **Q5** | `netMonthlyIncome`| What is your net monthly take-home income? | `₹60,000` (Store profit) | Baseline primary cash flow. |
| **Q6** | `existingMonthlyEMI`| Total existing monthly EMIs currently paying? | `₹0` | Zero existing debt burden (0% FOIR). |
| **Q7** | `householdLivingExpenses`| Essential monthly household living expenses? | `₹32,000` | Household living floor baseline. |
| **Q8** | `creditScoreStatus` | Approximate credit bureau score? | `unknown` (No bureau file) | **UNKNOWN IS NOT ZERO**. Widens band; sets confidence to Medium. |
| **Q9 (Dynamic)** | `hasUnencumberedCollateral`| Do you own clear-title property? | `true` (Shop premises) | **GAME CHANGER: Infers Secured LAP instead of Personal Loan**. |
| **Q10 (Dynamic)**| `collateralEstimatedValue`| Market value of this property? | `₹45,00,000` | Unlocks 50% LTV capacity up to ₹22.5 Lakhs. |
| **Q11 (Dynamic)**| `coApplicantIncome`| Does your spouse have regular income? | `₹18,000` (Teaching) | Expands household debt capacity to ₹27,300/mo. |
| **Q12 (Dynamic)**| `businessVintageYears`| Continuous years business has operated? | `14 years` | **10+ yr vintage gives -50 bps risk credit**; proves survival. |

---

## 2. Four Deterministic Outputs

### O1 — Borrow Verdict
* **Verdict:** **`BORROW` (via Inferred Secured LAP Route) / `BORROW LESS` (if Unsecured)**
* **One-Sentence Why:**
  > *"₹15,00,000 as an unsecured personal loan is unsafe on documented ITR cash flow (₹35k/mo); shift to a Secured Loan Against Property (LAP) using your ₹45L shop to borrow safely at 9.0%–10.5%."*

---

### O2 — Maximum Safe Borrowing vs. Estimated Lender Range

#### Path A: If Ravi blindly applied for an Unsecured Personal Loan
* **Estimated Lender Range:** **₹4,00,000 – ₹5,50,000** (Banks underwrite strictly on ₹35k ITR income).
* **Borrower-Safe Amount:** **₹4,50,000 – ₹6,00,000**
* *Verdict:* Ravi faces massive under-funding or flat rejection if treated as unsecured retail credit.

#### Path B: Inferred Product Routing — Secured Loan Against Property (LAP)
* **Estimated Lender LAP Range:** **₹15,00,000 – ₹22,50,000** (Based on 50% LTV of ₹45L shop + ₹78k household income).
* **Borrower-Safe LAP Amount:** **₹15,00,000 – ₹18,00,000** (Comfortably serviced by combined ₹78k cash flow over 7–10 years).

---

### O3 — Fair Interest Rate & Effective APR
* **Inferred Product Route:** **Secured Loan Against Property (LAP) / MSME Vyapar Loan**
* **Fair Interest Rate:** **9.0% – 10.5% p.a.** (Saves **700 bps / ₹5,50,000+** in interest vs 17% unsecured credit!).
* **Expected Initial Bank Quote:** **10.5% – 12.5% p.a.**
* **Effective All-In APR:** **9.7% – 11.2%** (with standard 1.5% valuation and processing fee).
* **Confidence Level:** **MEDIUM** (14-year vintage proves business survival, but missing bureau score widens pricing band).

---

### O4 — Recommended Safe EMI Ceiling & Tenure Sensitivity

* **Recommended Safe Maximum EMI:** **₹27,300/month** (35% of ₹78,000 total household cash flow).

#### Tenure Trade-off Matrix (for ₹15,00,000 at 9.75% mid-rate on LAP):
| Tenure | Monthly EMI | Total Interest Payable | Total Repayment | Feasibility & Recommendation |
| :--- | :---: | :---: | :---: | :--- |
| **5 years (60m)** | ₹31,690 | ₹4,01,400 | ₹19,01,400 | Exceeds safe ₹27.3k ceiling |
| **7 years (84m)** | **₹24,780** | **₹5,81,500** | **₹20,81,500** | **RECOMMENDED SWEET SPOT (Safe cash buffer)** |
| **10 years (120m)**| ₹19,600 | ₹8,52,000 | ₹23,52,000 | Maximum monthly cash cushion |

#### Stress Test Scenario:
* **20% Income Drop (₹78,000 → ₹62,400):** LAP EMI of ₹24,780 rises from 31.7% to **39.7%** of income.
* **Verdict:** Safe. Even during a slow retail month, the family maintains a ₹37,000 buffer for living expenses.

---

## 3. Ravi's Negotiation Card

```text
============================================================
              BORROWER NEGOTIATION CARD
Loan: Business Expansion / Stock   Requested: ₹15,00,000
Borrower: Ravi (42, Mysuru)         Confidence: MEDIUM (No CIBIL)
Inferred Route: Secured Loan Against Property (LAP)
============================================================

VERDICT: BORROW (VIA SECURED LAP ONLY - AVOID UNSECURED PL)

[RECOMMENDED PRODUCT]            [UNSECURED PL (AVOID!)]
Secured Loan Against Property    Unsecured Personal Loan
Eligible: ₹15L – ₹22.5L (50% LTV) Sanction: Capped at ₹5L max!
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
4. "Quote me the MSME Priority Sector Lending rate: 9.0%–10.25%."

DO NOT CROSS:
- Do not sign for an unsecured personal loan at 15%+ interest.
- Do not accept an EMI higher than ₹27,300/month.
- Never hand over original title deeds without an official Bank 
  acknowledgement letter.
============================================================
```

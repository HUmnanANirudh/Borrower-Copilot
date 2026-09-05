# Benchmark Run-Through 3: Anita (35, Hubballi)

> **Profile Summary:** Delivery platform rider + home tailoring in Hubballi. Variable informal earnings: **₹26,000–₹30,000/month** (avg **₹28,000/mo**). Two school-going children; husband unemployed for 8 months. Current monthly living expenses: **₹20,000/mo**. Existing debt: **Three high-cost instant loan apps** totaling **₹35,000 outstanding** at **30%+ APR**, costing approx **₹8,500/month** in debt servicing. **One EMI bounced last month**. Credit score: **Unknown / No formal bureau file**. Emergency savings: **₹0**.  
> **Requested Loan:** **₹1,50,00,00** for an electric delivery scooter to double delivery runs.

---

## 1. Questions Asked & Answers

| Step # | Question ID | Question Title & Context | Anita's Answer | Output Tightening Effect |
| :--- | :--- | :--- | :--- | :--- |
| **Q1** | `loanPurpose` | What is the purpose of this loan? | `personal` / Productive EV | While productive, existing debt distress supercedes new borrowing. |
| **Q2** | `loanType` | What type of loan are you exploring? | `unsecured_personal` | Retail personal loan or two-wheeler loan. |
| **Q3** | `requestedAmount` | How much money are you looking to borrow? | `₹1,50,000` | Sizing anchor for new monthly EMI requirement (~₹5,000/mo). |
| **Q4** | `age` | What is your current age? | `35` | Standard working age. |
| **Q5** | `incomeType` | How do you earn your primary income? | `gig_freelance` (Platform rider) | Triggers conservative 25% safe FOIR cap. |
| **Q6** | `netMonthlyIncome`| What is your net in-hand monthly income? | `₹28,000` | Free cash flow is razor thin after expenses. |
| **Q7** | `existingMonthlyEMI`| Total existing monthly EMIs currently paying? | `₹8,500` (3 app loans) | **Existing FOIR = 30.4%**. Leaves zero safe debt room! |
| **Q8** | `householdExpenses`| Essential monthly household living expenses? | `₹20,000` | Living expenses (₹20k) + existing debt (₹8.5k) = ₹28.5k > Income! |
| **Q9** | `creditScoreBand` | Approximate credit score? | `unknown` (No bureau record) | Unknown is modeled with wide risk variance. |
| **Q10** | `jobStability` | Stability of current employment? | `frequent_switches` | High volatility in platform gig shifts. |
| **Q11 (Adaptive)** | `recentDelinquencyOrBounce`| Any EMI bounce in last 6 months? | `true` (Bounced last month) | **HARD REJECTION TRIGGER: Prime bank gates lock.** |
| **Q12 (Adaptive)** | `hasInformalHighCostDebt`| Any informal/payday app debt at 30%+? | `true` (3 apps at 30%+) | **EMERGENCY RESTRUCTURING FLAG: Toxic debt trap.** |

---

## 2. Four Deterministic Outputs

### O1 — Borrow Verdict
* **Verdict:** **`DON'T BORROW YET` / `RESTRUCTURE FIRST`**
* **One-Sentence Why:**
  > *"You are already spending ₹8,500/month (30% of income) servicing three predatory 30%+ loan apps with a recent bounce; taking a new ₹1,50,000 loan right now will push total debt to 48% and trigger severe default. You must consolidate and clear the 30%+ apps first."*

---

### O2 — Maximum Safe Borrowing vs. Lender Sanction
* **Borrower-Safe Amount:** **₹0 (Zero New Debt until existing apps are cleared)**
* **Predatory Lender Offer:** **₹30,000 – ₹50,000** (From shady instant loan apps charging 36%–48% APR).
* **The Trap:**
  > Desperate borrowers with bounces are targeted by predatory digital apps with weekly 1% interest (52% APR) and hidden upfront deduction fees. **Borrower Copilot strictly advises ₹0 new borrowing.**

---

### O3 — Fair Interest Rate & All-In APR
* **Headline Two-Wheeler Rate:** **14.0% – 18.0% p.a.**
* **Actual Rate Available to Anita (with bounce):** **26.0% – 38.0% p.a.** (Sub-prime NBFC or app loans).
* **Effective APR:** **32.0% – 44.0%** (Due to heavy upfront fees and processing deductions).
* **Confidence Level:** **HIGH on Verdict / LOW on Bank Pricing** (Certain of insolvency danger; uncertain of which predatory lenders would quote).

---

### O4 — Recommended EMI Ceiling & Tenure Sensitivity

* **Recommended Safe Maximum EMI:** **₹0/month** (Until existing ₹8,500/mo app drain is eliminated).
* **Current Financial Reality Check:**
  - Net Income: ₹28,000
  - Living Costs (Rent, 2 kids, food): -₹20,000
  - Existing App Loan EMIs: -₹8,500
  - **Net Monthly Deficit: -₹500/month (Family is running negative cash flow!).**
  - Any new EMI of ₹4,500 for the scooter will cause instant missed rent or skipped child schooling expenses.

#### The 3-Step Recovery Roadmap (Actionable Tomorrow):
1. **Stop Borrowing from Apps:** Do not take a 4th loan to pay the 3rd loan.
2. **Access Stree Nidhi / Self-Help Group (SHG) / MFI Loan:** Borrow ₹35,000 from a government-supported Women's SHG or formal MFI at **12%–15% annual interest**.
3. **Wipe out the 30%+ Apps:** Paying off the ₹35,000 app loans with an SHG loan drops Anita's monthly EMI from **₹8,500/month down to ₹1,700/month** (saving **₹6,800 every month!**).
4. **Then Buy the Scooter:** With ₹6,800 in freed monthly cash flow, Anita can safely afford the ₹4,000/mo EV scooter EMI without risking her family.

---

## 3. Anita's Negotiation Card

```text
============================================================
              BORROWER NEGOTIATION CARD
Loan: EV Two-Wheeler (Delivery)    Requested: ₹1,50,000
Borrower: Anita (35, Hubballi)     Confidence: HIGH ON VERDICT
============================================================

VERDICT: DO NOT BORROW YET (ACTIVE DEBT SPIRAL DETECTED)

[SAFE NEW BORROWING]             [CURRENT MONTHLY DEFICIT]
₹0 (Zero New Debt!)              -₹500 / month (Negative Cash Flow)
Current Debt: ₹35,000 across 3 apps draining ₹8,500/month

[IMMEDIATE DANGER]               [URGENT ACTION]
Predatory 30%+ App Loans         Consolidate via Women's SHG / MFI
Recent Bounce = Bank Rejection   Save ₹6,800/month immediately

------------------------------------------------------------
ACTION PLAN FOR TOMORROW:
1. DO NOT take another instant app loan to pay previous EMIs.
   Uninstall all unverified lending apps immediately.
2. Visit the local Kudumbashree / Sanjeevini / Stree Nidhi 
   Women's Self-Help Group or Jan Dhan Bank branch in Hubballi.
3. Apply for a ₹35,000 micro-credit loan at 12%–15% to pay off 
   the 3 high-cost loan apps in one shot.
4. Once the ₹8,500/month app drain is replaced by a ₹1,700/month 
   SHG EMI, you will have ₹6,800 free cash to safely finance 
   the electric scooter next quarter.

DO NOT CROSS:
- Never accept loans with daily or weekly repayment structures.
- Never give access to phone contacts or gallery to any loan app.
============================================================
```

# Benchmark Run-Through 3: Anita (35, Hubballi)

> **Profile Summary:** Delivery platform rider + home tailoring in Hubballi. Variable informal earnings: **₹26,000–₹30,000/month** (avg **₹28,000/mo**). Two children; husband unemployed for 8 months. Current living expenses: **₹20,000/mo**. Existing debt: **Three high-cost instant loan apps** totaling **₹35,000 outstanding** at **30%+ APR**, costing **₹8,500/month** in debt servicing. **One EMI bounced last month**. Credit score: **Unknown / No formal bureau file**. Emergency savings: **₹0**.  
> **Requested Loan:** **₹1,50,000** for an electric delivery scooter to double delivery runs.

---

## 1. Questions Asked & Information Value Progression

| Step # | Question ID | Question Title & Context | Anita's Answer | Information Value & Output Effect |
| :--- | :--- | :--- | :--- | :--- |
| **Q1** | `loanPurpose` | What will you use this money for? | `asset_vehicle` (EV Scooter) | Productive asset purchase intended to expand gig income. |
| **Q2** | `requestedAmount` | How much money are you looking to borrow? | `₹1,50,000` | Sizing anchor for new monthly EMI requirement (~₹4,500/mo). |
| **Q3** | `age` | What is your current age? | `35` | Standard working age. |
| **Q4** | `primaryIncomeSignal`| What is your primary income stream? | `gig_freelance` | **Sets conservative 25% safe FOIR cap** due to volatile gig income. |
| **Q5** | `netMonthlyIncome`| What is your net monthly take-home income? | `₹28,000` | Total monthly household cash intake. |
| **Q6** | `existingMonthlyEMI`| Total existing monthly EMIs currently paying? | `₹8,500` (3 app loans) | **Existing FOIR = 30.4%**. Already breaches the 25% safe cap! |
| **Q7** | `householdLivingExpenses`| Essential monthly household living expenses? | `₹20,000` | Living costs (₹20k) + debt (₹8.5k) = ₹28.5k > Income! |
| **Q8** | `creditScoreStatus` | Approximate credit bureau score? | `unknown` (No bureau record) | Modeled with wide variance; sets Low Confidence. |
| **Q9 (Dynamic)** | `hasHighCostAppLoans`| Any loans from instant apps at 30%+? | `true` (3 apps at 30%+) | **CRITICAL: Flags active predatory debt trap**. |
| **Q10 (Dynamic)**| `recentDelinquencyOrBounce`| Any EMI bounce in last 6 months? | `true` (Bounced last month) | **MULTI-FACTOR DISTRESS TRIGGER: Rejection of new debt**. |
| **Q11 (Dynamic)**| `emergencySavingsMonths`| Emergency savings in months? | `0 months` (Paycheck to paycheck) | Verifies complete lack of liquidity cushion. |

---

## 2. Four Deterministic Outputs

### O1 — Borrow Verdict
* **Verdict:** **`DON'T BORROW YET` / `RESTRUCTURE FIRST`**
* **One-Sentence Why:**
  > *"You are servicing 30%+ instant app loans with a recent bounce and zero monthly cash surplus; adding a new loan will trigger a severe default spiral. You must consolidate and clear the high-cost app debt first."*

---

### O2 — Maximum Safe Borrowing vs. Estimated Lender Range
* **Borrower-Safe Amount:** **₹0 (Zero New Commercial Debt!)**
* **Predatory Digital App Sanction:** **₹30,000 – ₹50,000** (From shady instant apps charging 36%–50% APR).
* **The Reality Check:**
  - Net Take-Home: ₹28,000
  - Living Costs (Rent, 2 kids, food): -₹20,000
  - Existing App Debt Servicing: -₹8,500
  - **Net Household Balance: -₹500/month (Anita's family is operating at a monthly deficit!).**
  - Any new monthly EMI of ₹4,500 for the scooter will cause immediate skipped rent or missed school fees.

---

### O3 — Fair Interest Rate & Effective APR
* **Headline Two-Wheeler Rack Rate:** **14.0% – 18.0% p.a.**
* **Actual Sub-Prime Rates Pitched to Anita (with bounce):** **28.0% – 42.0% p.a.** (Predatory digital lenders).
* **Effective All-In APR:** **34.0% – 48.0%** (Due to high upfront deduction fees).
* **Confidence Level:** **HIGH on Verdict / LOW on Bank Pricing** (Certain of insolvency danger; uncertain of which predatory lenders would quote).

---

### O4 — Recommended EMI Ceiling & Tenure Sensitivity

* **Recommended Safe Maximum EMI:** **₹0/month** (Until the ₹8,500/mo app drain is eliminated).

#### Inferred Product Route: Microfinance / Women's SHG Debt Restructuring
Anita should **NOT** borrow commercially for the scooter tomorrow. She needs a **3-Step Recovery Roadmap**:

1. **Halt Digital App Borrowing:** Stop taking a 4th payday app loan to service the 3rd loan.
2. **Access Stree Nidhi / Women's Self-Help Group (SHG) / Formal MFI Credit:**
   - Borrow ₹35,000 at **12%–15% annual interest** from a government-backed microfinance group.
   - Pay off and close all three 30%+ predatory digital apps immediately.
3. **The Result:**
   - Anita's monthly debt payment drops from **₹8,500/month down to ₹1,700/month** (saving **₹6,800 every single month!**).
   - With ₹6,800/mo in newly freed cash flow, Anita can return in 3 months and safely afford the ₹3,800/mo EV scooter EMI without risking her family.

---

## 3. Anita's Negotiation Card

```text
============================================================
              BORROWER NEGOTIATION CARD
Loan: EV Delivery Vehicle          Requested: ₹1,50,000
Borrower: Anita (35, Hubballi)     Confidence: HIGH ON VERDICT
Inferred Route: Women's SHG / MFI Debt Restructuring
============================================================

VERDICT: DO NOT BORROW YET (ACTIVE DEBT SPIRAL DETECTED)

[SAFE NEW BORROWING]             [CURRENT MONTHLY DEFICIT]
₹0 (Zero New Commercial Debt!)   -₹500 / month (Deficit Cash Flow)
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

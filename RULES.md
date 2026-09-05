# Borrower Copilot — Financial Rules & Model Governance (`RULES.md`)

> **Status:** Authoritative Contract for `lib/rules/*`  
> **Jurisdiction:** Indian Retail & Micro-Business Lending (INR ₹)  
> **Design Thesis:** Lenders underwrite for their risk and profit (pushing 50%–60% FOIR and 5-year tenures). Borrower Copilot underwrites strictly for borrower solvency, disposable cash-flow preservation, and fair negotiation leverage.

---

## 1. Master Rule Ledger

Every rule, threshold, band, and assumption used in the calculations is cataloged below, explicitly categorizing whether it is derived from formal regulatory / bank sources or financial engineering judgement.

| Parameter / Rule | Value / Threshold | Why It Exists | Source vs. My Judgement |
| :--- | :--- | :--- | :--- |
| **Borrower Safe FOIR Ceiling** | **35% of Net Monthly Income** | Protects borrower from debt distress; ensures remaining 65% handles rent, inflation, schooling, and emergencies. | **My Judgement** (Conservative counter-weight to bank 50%+ standards). |
| **Lender Aggressive FOIR** | **50% – 60% of Net Income** | Standard Indian commercial bank & NBFC underwriting ceiling used to calculate sanctioned loan eligibility. | **Source-backed** (Standard SBI / HDFC / ICICI personal loan credit policy). |
| **Gig / Informal FOIR Haircut** | **Cap reduced to 25%** | Irregular gig earnings and platform pay exhibit high volatility; debt burden above 25% causes default cascades. | **My Judgement** (Derived from microfinance repayment volatility observations). |
| **Salaried Variable Pay Haircut** | **50% deduction on >15% variable pay** | Bonuses and performance incentives are uncommitted; lenders also discount annual bonuses when sizing fixed monthly liabilities. | **Source-backed** (Bank underwriting guidelines for variable compensation). |
| **Untouchable Monthly Buffer** | **10% of Net Monthly Income** | Mandatory liquid reserve deducted before computing safe EMI to prevent cash exhaustion on salary day. | **My Judgement** (Prudent financial planning buffer). |
| **Overleveraged Rejection Trigger** | **Current FOIR ≥ 35% OR Expenses + EMIs ≥ 92%** | If current debt already eats over a third of income, any new debt forces the household into negative cash flow. | **My Judgement** (Defensive default prevention trigger). |
| **Prime Credit Tier (Score 750+)** | **10.5% – 12.0% p.a. (Rate reduction -75 bps)** | Borrowers with 750+ CIBIL hold maximum bargaining power; qualifies for Tier-1 private and public sector bank rates. | **Source-backed** (Current Indian market rates for prime unsecured personal loans). |
| **Average Credit Tier (650–749)** | **12.5% – 15.0% p.a. (+100 to +250 bps markup)** | Sits in sub-prime / Tier-2 NBFC risk bracket; higher risk premium charged. | **Source-backed** (NBFC retail unsecured lending card rates). |
| **Poor Credit Tier (<650)** | **16.0% – 21.0% p.a. (+400 to +650 bps markup)** | Borderline rejection by banks; forces reliance on high-cost NBFCs or fintech apps. | **Source-backed** (Fintech unsecured personal loan rates). |
| **Unknown Credit Score Treatment** | **Widen band by 300 bps (11.5%–15.0%) + Downgrade Confidence** | **UNKNOWN IS NEVER TREATED AS ZERO**. Bureau absence introduces underwriting variance; widening the band transparently informs the borrower of pricing uncertainty. | **My Judgement** (Core transparency mandate). |
| **Secured / LAP Rate Floor** | **8.75% – 10.25% p.a.** | Loans against unencumbered residential or commercial property reduce lender risk to near zero; saves 500–800 bps vs unsecured. | **Source-backed** (Indian retail Loan Against Property rack rates). |
| **All-In Processing Fee** | **2.0% + 18% GST (Net ~2.36%)** | Headline interest ignores upfront deductions; banks deduct processing fee at disbursement, lowering effective principal received. | **Source-backed** (RBI Fair Practices Code & prevailing bank schedules). |
| **Effective APR Equation** | **Nominal Rate + (Upfront Fees / Principal / Tenure Years)** | Computes the true annualized percentage rate factoring in processing fee, GST, and documentation charges. | **Source-backed** (RBI Master Direction on Regulatory Framework for Microfinance & Digital Lending). |
| **Lender Sanction Inflation Ratio** | **Flag when Lender Sanction > Safe Amount × 1.25** | Warns the borrower when bank eligibility is artificially inflated via long tenure (60 months) to trap borrower in high interest. | **My Judgement** (Anti-predatory alert trigger). |
| **Income Shock Stress Test** | **20% drop in net income** | Simulates job loss, maternity/paternity gap, illness, or SME revenue drop to verify whether FOIR breaches 50%. | **My Judgement** (Macroeconomic resilience benchmark). |
| **Recent Delinquency / Bounce Rule** | **Instant `DON'T BORROW YET` if bounced in past 6m** | A borrower with an active bounce will be rejected by prime banks or subjected to predatory 30%+ pricing. Taking new debt accelerates default. | **Source-backed** (DPD / 30+ delinquency gating in bureau algorithms). |
| **Informal High-Cost Debt Rule** | **Mandatory Restructure Flag if 30%+ app debt exists** | Borrowing retail personal loans while holding 30%+ payday/app debt is toxic. Borrower must route to MFI/SHG debt consolidation. | **My Judgement** (Debt counseling best practice). |

---

## 2. Mathematical Formulations

### 2.1 Two-Lock Borrower Affordability
Given:
- $I = \text{Net Monthly Income}$
- $E_{\text{exist}} = \text{Current Existing EMIs}$
- $H = \text{Household Living Expenses}$
- $\text{Cap}_{\text{FOIR}} = 35\%$ (or $25\%$ for gig / unstable profiles)

$$\text{Lock 1 (Safe FOIR)} = \max\left(0, (I \times \text{Cap}_{\text{FOIR}}) - E_{\text{exist}}\right)$$

$$\text{Lock 2 (Cash Flow)} = \max\left(0, I - H - E_{\text{exist}} - (I \times 0.10)\right)$$

$$\text{Safe Max EMI Ceiling} = \min(\text{Lock 1}, \text{Lock 2})$$

### 2.2 Reverse Amortization Principal Formula
To convert a monthly EMI ceiling ($E$) into a maximum safe loan amount ($P$) at annual interest rate $R$ over $n$ months:
$$r = \frac{R}{12 \times 100}$$
$$P = \frac{E \cdot \left[ (1 + r)^n - 1 \right]}{r \cdot (1 + r)^n}$$
- **Lender Sanction:** Computed with $E_{\text{lender}} = (I \times 0.55) - E_{\text{exist}}$ at $n = 60\text{ months}$.
- **Borrower Safe Amount:** Computed with $E_{\text{safe}}$ at $n = 36\text{ to }48\text{ months}$.

### 2.3 RBI-Style All-In APR
$$\text{Upfront Deductions} = (\text{Principal} \times 0.02 \times 1.18) + \text{DocCharges}$$
$$\text{Annualized Fee Impact (\%)} = \frac{\text{Upfront Deductions}}{\text{Principal} \times (\text{Tenure Months} / 12)} \times 100$$
$$\text{Effective APR} = \text{Nominal Fair Rate} + \text{Annualized Fee Impact}$$

---

## 3. Product Routing Architecture

The rules engine prevents borrowers from blindly applying for the wrong loan instrument:

1. **The Prime Salaried Path (e.g., Priya)**
   - Unsecured personal loan at prime rates (10.5%–12%).
   - Warning issued against 60-month loan stretching.
2. **The Small Business / Collateral Path (e.g., Ravi)**
   - Reject/Warn against ₹15L unsecured personal loan (ITR declared income ₹35k/mo cannot support ₹15L unsecured; banks will either reject or quote predatory 18%+).
   - **Route to Secured LAP**: Use unencumbered ₹45L shop premises to secure ₹15L at 9.0%–10.5% for 7–10 years.
3. **The Informal Overleveraged Path (e.g., Anita)**
   - Rejection of new debt (`DON'T BORROW YET`).
   - Rationale: Servicing 30%+ predatory payday apps with an active bounce means a new ₹1.5L loan will cause total insolvency.
   - Route to debt consolidation / SHG / MFI loan to retire high-cost debt first.

---

## 4. Model Limitations & Disclaimers

1. **Tax Implications:** The engine does not account for Section 24(b) or Section 80C tax deductions available on specific home or education loans.
2. **Prepayment Penalty Variability:** Floating rate loans to individual borrowers have zero foreclosure charges under RBI mandates, but fixed rate and commercial loans may carry 2%–4% prepayment penalties.
3. **Property Valuation Discount:** Collateral valuation is assumed at 60%–65% Loan-to-Value (LTV) for commercial premises and 75% for residential properties.

# Borrower Copilot — Financial Rules & Model Governance (`RULES.md`)

> **Status:** Authoritative Contract for `src/lib/rules/*`  
> **Architecture:** Deterministic Information-Value Assessment Engine (Zero-LLM Authority)  
> **Jurisdiction:** Indian Retail, Micro-Business, and Informal Debt Underwriting (INR ₹)  
> **Core Principle:** Lenders underwrite for their risk and profit (pushing 50%–60% FOIR and 60-month tenures). Borrower Copilot underwrites strictly for borrower solvency, double-lock cash-flow protection, and truthful negotiation leverage.

---

## 1. Master Rule Ledger

Every rule, formula, threshold, and assumption is cataloged below, explicitly categorizing whether it is derived from formal regulatory / bank sources or financial engineering judgement.

| Rule / Parameter | Exact Value & Formula | Why It Exists | Source vs. My Judgement |
| :--- | :--- | :--- | :--- |
| **Cash-Flow Floor (Lock 1)** | $\text{Floor} = \max(0, \text{Net Income} - \text{Expenses} - \text{Existing EMIs} - (0.10 \times \text{Net Income}))$ | Ensures borrower retains a 10% untouchable liquid contingency and never enters negative monthly cash flow. | **My Judgement** (Prudent financial solvency boundary). |
| **Safe FOIR Ceiling (Lock 2)** | $\text{FOIR} = \frac{\text{Existing EMI} + \text{New EMI}}{\text{Net Monthly Income}} \le 35\%$ | Protects household from over-leverage; prevents debt servicing from cannibalizing nutrition, rent, and education. | **My Judgement** (Conservative counter-weight to bank 50%+ standards). |
| **Gig / Informal Safe FOIR Cap** | $\text{Cap reduced to } \mathbf{25\%}$ | Gig platform earnings and informal micro-businesses fluctuate significantly; debt above 25% leads to default cascades. | **My Judgement** (Observed volatility in platform rider incomes). |
| **Salaried Variable Pay Haircut** | $\text{Haircut} = \mathbf{50\%} \text{ deduction on variable component if } > 15\%$ | Annual bonuses and quarterly incentives are uncommitted; cannot be relied upon to service fixed monthly EMIs. | **Source-backed** (Prevailing Indian commercial bank credit policies). |
| **Estimated Lender Range FOIR** | $\text{Lender FOIR} = \mathbf{50\%} \text{ to } \mathbf{60\%}$ | Public underwriting benchmark used by Indian private and public sector banks to size maximum sanctioned loan eligibility. | **Source-backed** (HDFC Bank / SBI / ICICI retail lending credit manuals). |
| **Prime Credit Tier (Score 750+)** | $\mathbf{10.5\% – 12.0\% \text{ p.a.}} \quad (\text{Rate reduction } -75\text{ bps})$ | Borrowers with 750+ CIBIL score carry negligible statistical default risk; qualifies for tier-1 rack rates. | **Source-backed** (Current Indian market rates for prime unsecured personal credit). |
| **Average Credit Tier (650–749)** | $\mathbf{12.5\% – 15.0\% \text{ p.a.}} \quad (+100 \text{ to } +250\text{ bps risk premium})$ | Sub-prime / Tier-2 NBFC risk bracket; higher cost of capital passed onto borrower. | **Source-backed** (NBFC retail unsecured lending rate schedules). |
| **Poor Credit Tier (<650)** | $\mathbf{16.0\% – 21.0\% \text{ p.a.}} \quad (+400 \text{ to } +650\text{ bps markup})$ | High risk of near-term delinquency; forces borrower into high-cost fintech/NBFC channels. | **Source-backed** (Fintech retail loan rack cards). |
| **Unknown Credit Score Treatment** | $\mathbf{\text{Widen fair band by } +75\text{ to }+350\text{ bps}} + \mathbf{\text{Downgrade Confidence}}$ | **UNKNOWN IS NEVER TREATED AS ZERO OR 300**. Missing bureau history means high lender underwriting variance, not automatic poor credit. | **My Judgement** (Honest uncertainty mandate). |
| **Business Vintage Mitigation** | $\mathbf{\text{Rate credit } -50\text{ bps}} \text{ if operating vintage } \ge 10\text{ years}$ | Long survival (e.g. Ravi's 14-year kirana store) proves cash-flow resilience, offsetting the absence of a formal bureau score. | **My Judgement** (SME underwriting heuristic). |
| **Secured LAP Rate Floor** | $\mathbf{9.0\% – 10.5\% \text{ p.a.}}$ | Unencumbered property collateral reduces lender loss-given-default to near zero; saves 600–800 bps vs unsecured personal credit. | **Source-backed** (Indian retail Loan Against Property rack rates). |
| **All-In Processing Fee** | $\mathbf{2.0\%} \text{ of Principal} + \mathbf{18\% \text{ GST}} \quad (\text{Net } 2.36\%)$ | Headline rates omit upfront fees; processing fees are deducted at disbursement, reducing actual funds received. | **Source-backed** (RBI Fair Practices Code & prevailing bank fee structures). |
| **Effective APR Equation** | $\text{APR} = \text{Nominal Rate} + \left( \frac{\text{Upfront Fees}}{\text{Principal} \times (\text{Tenure} / 12)} \times 100 \right)$ | Computes true annualized cost accounting for upfront processing fees, documentation, and GST. | **Source-backed** (RBI Master Direction on Regulatory Framework for Digital Lending). |
| **Sanction Inflation Alert** | $\text{Triggered when } \text{Lender Range Maximum} > \text{Safe Amount} \times 1.25$ | Warns borrower when bank eligibility is inflated via 60-month tenures to trap the customer into excessive interest. | **My Judgement** (Anti-predatory alert trigger). |
| **Income Shock Stress Test** | $\mathbf{20\%} \text{ reduction in net monthly household income}$ | Simulates financial stability if take-home pay or business revenue decreases by 20% (illness, business slowdown). | **My Judgement** (Macroeconomic resilience benchmark). |
| **Compounded Distress Rejection** | $\text{Instant } \mathbf{DON'T BORROW YET} \text{ if } \text{App Debt} + \text{Bounce} + \text{Deficit}$ | A single accidental bounce with savings is manageable; but high-cost 30%+ app debt + recent bounce + deficit triggers default. | **My Judgement** (Defensive default prevention trigger). |

---

## 2. Mathematical Formulations & Exact Formulas

### 2.1 Double-Lock Borrower Affordability
Given:
- $I_{\text{primary}} = \text{Primary Net Monthly Income}$
- $I_{\text{co}} = \text{Verified Co-Applicant Monthly Income}$
- $I_{\text{total}} = I_{\text{primary}} + I_{\text{co}}$
- $E_{\text{exist}} = \text{Ongoing Existing Monthly EMIs}$
- $H = \text{Essential Household Living Expenses}$
- $\text{Buffer} = I_{\text{total}} \times 0.10 \quad (\text{Untouchable } 10\% \text{ contingency reserve})$
- $\text{Cap}_{\text{FOIR}} = 35\% \quad (\text{or } 25\% \text{ for gig / informal profiles})$

$$\text{Lock 1 (Cash-Flow Floor)} = \max\left(0, I_{\text{total}} - H - E_{\text{exist}} - \text{Buffer}\right)$$

$$\text{Lock 2 (Safe FOIR Ceiling)} = \max\left(0, (I_{\text{total}} \times \text{Cap}_{\text{FOIR}}) - E_{\text{exist}}\right)$$

$$\mathbf{\text{Recommended Safe Max EMI}} = \min(\text{Lock 1}, \text{Lock 2})$$

### 2.2 Reverse Amortization Principal Equation
To convert a monthly EMI ceiling ($E$) into a maximum safe loan amount ($P$) at annual interest rate $R$ over $n$ months:
$$r = \frac{R}{12 \times 100}$$
$$P = \frac{E \cdot \left[ (1 + r)^n - 1 \right]}{r \cdot (1 + r)^n}$$
- **Estimated Lender Range:** Computed using $E_{\text{lender}} = (I_{\text{assessed}} \times 0.55) - E_{\text{exist}}$ at $n = 60\text{ months}$.
  *(Note: For self-employed, $I_{\text{assessed}}$ is strictly documented monthly ITR taxable income, not unverified cash turnover).*
- **Borrower Safe Range:** Computed using $E_{\text{safe}}$ at $n = 36\text{ to }48\text{ months}$.

### 2.3 RBI-Style All-In APR
$$\text{Upfront Deductions} = (\text{Principal} \times 0.02 \times 1.18) + \text{Documentation Charges}$$
$$\text{Annualized Fee Impact (\%)} = \frac{\text{Upfront Deductions}}{\text{Principal} \times (\text{Tenure Months} / 12)} \times 100$$
$$\mathbf{\text{Effective All-In APR}} = \text{Nominal Fair Rate} + \text{Annualized Fee Impact}$$

---

## 3. Dynamic Information-Value Architecture

The questioning flow avoids fixed 3-branch classification early. It operates via a **3-Phase Deterministic State Machine**:

1. **Phase 1: Universal Intake (3 Questions)**: Purpose, Amount, Age. *(Loan type is purposefully inferred later)*.
2. **Phase 2: Financial Baseline (5 Questions)**: Income signal, Take-home pay, Existing EMIs, Living costs, Bureau score.
3. **Phase 3: Information-Value Dynamic Loop**:
   - The engine evaluates the current profile against output uncertainties ($\Delta \text{Verdict}, \Delta \text{Amount}, \Delta \text{Rate}, \Delta \text{Confidence}$).
   - Every candidate question has a computed **Information Score (0 to 10)**.
   - Questions with Score $= 0$ are pruned. Questions with Score $\ge 7$ are sequenced in descending order of information gain.
   - The engine halts when remaining questions produce zero change in outputs.

### Information-Value Question Evaluation Table:
| Dynamic Question | Target Outputs | Asking Condition (`shouldAsk`) | Information Score |
| :--- | :--- | :--- | :---: |
| **Collateral Property Ownership** | Amount, Rate, Verdict | Requested $\ge$ ₹8L OR Business OR Expansion | **10 / 10** |
| **High-Cost 30%+ App Debt** | Verdict, Rate, Confidence | Debt Consolidation OR Gig Worker OR FOIR $\ge 25\%$ | **10 / 10** |
| **Recent Delinquency / Bounce** | Verdict, Confidence, Rate | Score Unknown OR Score < 650 OR Has App Debt | **10 / 10** |
| **Collateral Market Valuation** | Amount, Verdict | Has Unencumbered Collateral = True | **9 / 10** |
| **Business Operating Vintage** | Rate, Confidence, Amount | Primary Income = Self-Employed Business | **9 / 10** |
| **Co-Applicant Income** | Amount, EMI, Verdict | (Requested / Income) > 8 OR Self-Employed | **8 / 10** |
| **Variable Bonus Share %** | Amount, EMI | Primary Income = Salaried Corporate | **7 / 10** |
| **Emergency Savings Months** | Verdict, Confidence | Existing FOIR $\ge 20\%$ OR Gig Worker | **7 / 10** |

### 3.1 Explicit Questionnaire Stopping Criteria

The engine halts questioning and transitions to assessment outputs when **ALL** of the following conditions are satisfied:

| Stopping Condition | Threshold | Why | Source vs. Judgement |
| :--- | :--- | :--- | :--- |
| **1. Universal Baseline Minimum** | All Phase 1 (3) + Phase 2 (5) questions answered (8 total) | Without purpose, amount, age, income, existing EMI, expenses, and credit status, outputs cannot be calculated. | **Product Requirement** |
| **2. High-Impact Risk Unresolved** | Zero remaining unasked questions with Information Score $\ge 9$ | If high-cost app debt, collateral, or vintage could alter the verdict or product route, the engine must not stop prematurely. | **My Judgement** |
| **3. Safe Amount Interval Stability** | Borrower-safe loan range width $\le 20\%$ of ceiling | When further questions would not move the safe borrowing range by $> \pm 10\%$, questioning stops. | **My Judgement** |
| **4. Rate Band Narrowing Floor** | Fair rate band width $\le 150\text{ bps}$ (known score) or $\le 300\text{ bps}$ (unknown score) | A known score cannot be tightened further without a formal bureau pull; an unknown score honestly retains uncertainty. | **My Judgement** |
| **5. Unanswered Questions Marginal Utility** | Expected change in safe EMI $< ₹1,500/\text{month}$ | Prevents borrower survey fatigue when remaining variables produce statistically negligible impact on cash flow. | **My Judgement** |

---

## 4. Inferred Product Routing Decisions

The engine does not allow borrowers to stumble into predatory retail loan structures:

1. **Priya (Prime Salaried, 29, Bengaluru)**
   - *Inferred Product:* Unsecured Personal Loan.
   - *Rationale:* Verifiable corporate salary at MNC + 780 CIBIL score unlocks prime tier-1 bank pricing (10.5%–12%).
2. **Ravi (Kirana Store Owner, 42, Mysuru)**
   - *Inferred Product:* **Secured Loan Against Property (LAP) / MSME Vyapar Loan**.
   - *Rationale:* ₹15L requested on ₹35k documented ITR cannot be approved as an unsecured personal loan without punitive 17%+ interest. Unencumbered ₹45L commercial shop premises unlocks a 7-year LAP at 9.0%–10.5%, cutting monthly EMI in half.
3. **Anita (Gig Platform Rider, 35, Hubballi)**
   - *Inferred Product:* **MFI / Women's Self-Help Group (SHG) Debt Restructuring**.
   - *Rationale:* Servicing ₹35k across three 30%+ predatory loan apps with a recent bounce leaves negative monthly cash flow (-₹500/mo). Taking a new ₹1.5L loan guarantees default. Route to 12%–15% SHG/MFI micro-credit to extinguish 30%+ app debt first.

---

## 5. Model Limitations & Transparency Disclaimers

1. **Estimated, Not Guaranteed:** The application presents *Estimated Lender-Eligible Ranges* derived from public credit parameters; it does not represent a legally binding sanction from any commercial institution.
2. **Tax Deductions Omitted:** Benefits under Section 24(b) (Home loan interest) and Section 80C are not modeled.
3. **Collateral Haircuts:** LTV (Loan-to-Value) on commercial properties is conservatively capped at 50%–60% to account for distressed liquidation variance.

# Borrower Copilot — Product Specification & Technical Design (`spec.md`)

> **Status:** Drafted & Confirmed via Grilling & Impeccable Design Shaping  
> **Reference Baseline:** [Mentimeter Design Tokens](./MENTIMETER_DESIGN_SYSTEM.md)  
> **Target Audience:** Indian retail, self-employed, and gig borrowers seeking transparent borrowing affordability, fair interest rates, and loan negotiation leverage.

---

## 1. Executive Summary & Core Objective

**Borrower Copilot** is a mobile-first, privacy-respecting Next.js web application engineered to protect Indian borrowers from predatory debt traps, deceptive loan quotes, and unaffordable EMIs.

The tool answers four fundamental questions deterministically:
1. **Should I borrow?** (Verdict: `BORROW`, `BORROW LESS`, `DON'T BORROW YET`)
2. **How much can I safely borrow?** (Contrasting **Lender Sanction** vs. **Borrower-Safe Affordability**)
3. **What rate is fair?** (Fair interest band, expected lender quotes, and true **All-in APR** including hidden fees)
4. **What EMI should I agree to?** (Hard safe EMI ceiling, tenure sensitivity matrix, and realistic income/interest stress tests)

The product concludes with an interactive, downloadable, and shareable **Borrower Negotiation Card** that arms borrowers with exact counter-proposals and questions for loan officers.

---

## 2. Fundamental Constraints & Principles

* **Zero Login & Bureau-Free:** No signup, phone OTP, account creation, or CIBIL pull.
* **Strict Stateless Privacy:** No personal financial numbers, incomes, or EMIs are permanently stored in any database. The shareable URL uses compressed URL-fragment encoding (`#data=...`).
* **Absolute Separation of Concerns (Rules Engine vs. LLM):**
  * **Financial Truth (Deterministic Rules):** FOIR, EMI limits, safe borrowing ranges, interest rate bands, APR calculations, and stress scenarios are executed **strictly in TypeScript math functions** (`lib/rules/*`).
  * **LLM Layer (Adaptive Selection & Framing):** Suggesting the most relevant next question, phrasing questions with cultural clarity, and generating borrower-friendly negotiation bullet points.
* **Zero-Config Hybrid Fallback:** The application works 100% offline out-of-the-box using heuristic decision trees if no Gemini/OpenAI API key is provided, enabling sub-5-minute evaluator review.
* **Honest Uncertainty:** Missing or unknown variables (e.g. unknown credit score) widen confidence intervals and bands; unknowns are **never** treated as zero.

---

## 3. Core Architecture & Component Topology

```text
                           ┌────────────────────────────────────────┐
                           │      Next.js (App Router / React 19)   │
                           └──────────────────┬─────────────────────┘
                                              │
                       ┌──────────────────────▼──────────────────────┐
                       │           Mobile-First UI Surface           │
                       │   (Mentimeter-Inspired Design System)       │
                       └──────────────────────┬─────────────────────┘
                                              │
                     ┌────────────────────────┴────────────────────────┐
                     ▼                                                 ▼
        ┌─────────────────────────┐                       ┌─────────────────────────┐
        │  Adaptive Questionnaire │                       │   One-Click Preset Bar  │
        │   (Single-Focus Slides) │                       │  (Priya / Ravi / Anita) │
        └────────────┬────────────┘                       └────────────┬────────────┘
                     │                                                 │
                     └────────────────────────┬────────────────────────┘
                                              ▼
                                 ┌─────────────────────────┐
                                 │   Borrower State Store  │
                                 │  (Client-side Zustand)  │
                                 └────────────┬────────────┘
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      ▼                                               ▼
         ┌─────────────────────────┐                     ┌─────────────────────────┐
         │  Rules Engine (lib/rules)│                     │  LLM / Heuristic Engine │
         │   - Affordability/FOIR  │                     │   - Question Selector   │
         │   - Sanction vs Safe    │                     │   - Cultural Phrasing   │
         │   - Rate Band & APR     │                     │   - Negotiation Script  │
         │   - EMI & Stress Test   │                     └────────────┬────────────┘
         └────────────┬────────────┘                                  │
                      │                                               │
                      └───────────────────────┬───────────────────────┘
                                              ▼
                                 ┌─────────────────────────┐
                                 │    4 Core Outputs       │
                                 │ (O1, O2, O3, O4 + Conf) │
                                 └────────────┬────────────┘
                                              │
                                 ┌────────────▼────────────┐
                                 │     Negotiation Card    │
                                 │ (Print / PDF / Share URL)│
                                 └─────────────────────────┘
```

---

## 4. UI/UX Direction (Impeccable & Mentimeter Crafted)

### 4.1 Visual System & Design Tokens
Derived directly from the extracted [Mentimeter Design System](./MENTIMETER_DESIGN_SYSTEM.md):

* **Canvas & Surfaces:**
  * Background: Warm Sand `#F3EDE7` and Cream White `#FCFBF9` instead of sterile cold blue/gray.
  * Card Surfaces: Pure White `#FFFFFF` with multi-stop diffused isometric elevation or bold 1px/8px structural outlines.
  * High-intent CTA & Brand Accent: Vibrant Royal Blue `#5769E7` (Hover: `#4958BE`, Active: `#3F4BA1`).
  * Text: Warm Off-Black `#171717` (High-contrast primary), `#5D5B59` (Muted captions).
* **Typography:**
  * Headlines: Tall, character-rich condensed display typography (`font-stretch: condensed`, tight `line-height: 0.88–0.92`), creating an editorial poster feel.
  * Body & Numbers: Geometric humanist sans-serif with monospace tabular figures for currency (e.g. `₹22,000/mo`).
* **Geometry:**
  * Pill buttons and filter chips (`border-radius: 9999px` / `rounded-full`).
  * Surface cards with `border-radius: 16px` to `20px`.

### 4.2 Interactive Progression
1. **Landing View:**
   * Bold hero statement: *"Know what to say before the bank quotes your loan."*
   * **One-Click Persona Preset Bar** (`[⚡ Quick Load: Priya | Ravi | Anita]`) for instant evaluator testing.
   * Primary CTA: *"Check Your Safe Limits"* (pill button).
2. **Adaptive Questionnaire (Single-Focus Slide Flow):**
   * One question per viewport on mobile to prevent cognitive overload.
   * Progress pill header: *"Step 4 of ~9 · Analyzing repayment capacity"*.
   * Instant micro-feedback on answer input with subtle slide transitions.
3. **Assessment Results Screen:**
   * Verdict Banner (`BORROW`, `BORROW LESS`, or `DON'T BORROW YET`) with single-sentence rationale.
   * Visual comparison card: **Lender Sanction (What they'll offer)** vs. **Borrower-Safe (What you can afford)**.
   * APR and Fee discloser (Highlighting nominal interest vs true APR).
   * EMI tenure table with interactive slider and income drop stress indicator.
4. **Borrower Negotiation Card (Final Screen):**
   * Pocket-sized, printable/downloadable summary card.
   * Key limits marked as **DO NOT CROSS**.
   * Exact scripted talking points for lender phone calls / branch visits.

---

## 5. Questionnaire & Adaptive Architecture

### 5.1 Universal Base Questions (Target 8–10 total)
1. **Loan Purpose**: Personal, Business Expansion, Debt Consolidation, Medical/Emergency, Home Improvement.
2. **Loan Type**: Unsecured Personal Loan, Secured / Property Loan, Business Working Capital, Gold / Asset Loan.
3. **Requested Amount**: ₹ Slider + quick select buttons (e.g. ₹2L, ₹5L, ₹10L, ₹15L).
4. **Borrower Age**: Age input (checks tenure ceiling before retirement).
5. **Income Type**: Salaried Corporate, Salaried Informal, Self-Employed Professional, Self-Employed Business, Gig/Freelance.
6. **Net Monthly In-Hand Income**: ₹ input.
7. **Existing Monthly EMIs**: Total current loan servicing obligations.
8. **Monthly Household Expenses**: Living costs, rent, utilities.
9. **Credit Score**: Known bands (`750+ Excellent`, `700–749 Good`, `650–699 Average`, `<650 Poor`, or `Unknown / No Bureau History`).
10. **Income Stability / Vintage**: Tenure in current job / business years.

### 5.2 Adaptive Branching Logic
Questions are dynamically introduced only if they alter an output boundary:

* **Salaried Branch:**
  * *Adaptive Check 1:* Variable vs. fixed pay ratio (if variable > 25%, haircut applied to disposable income).
  * *Adaptive Check 2:* Recent job change (< 6 months reduces lender eligibility).
* **Self-Employed / Business Branch (e.g., Ravi):**
  * *Adaptive Check 1:* Business vintage (< 3 years triggers LAP/secured redirection).
  * *Adaptive Check 2:* ITR declared income vs. gross bank turnover.
  * *Adaptive Check 3:* Collateral availability (residential/commercial property for LAP).
* **Informal / High-Obligation Branch (e.g., Anita):**
  * *Adaptive Check 1:* Existing high-cost informal debt (e.g. local moneylenders, payday apps).
  * *Adaptive Check 2:* Recent EMI bounce or 30-day delinquency in past 6 months.
  * *Adaptive Check 3:* Emergency savings liquid buffer (months of expenses).

---

## 6. Financial Rules Engine Specifications (`RULES.md` Contract)

All formulas are strictly deterministic, isolated in `lib/rules/`:

### 6.1 Fixed Obligation to Income Ratio (FOIR)
* **Lender Eligibility FOIR**:
  * Standard banks allow up to **50% to 60%** of gross/net monthly income towards all EMIs.
  * Formula: $\text{Lender Max EMI} = (\text{Monthly Income} \times \text{Lender FOIR}) - \text{Existing EMIs}$
* **Borrower-Safe Affordability FOIR**:
  * Safe ceiling is capped strictly at **35% to 40%** of net income, and must never exceed $\text{Monthly Income} - \text{Household Expenses} - \text{Emergency Buffer}$.
  * Formula: $\text{Safe Max EMI} = \min((\text{Net Income} \times 0.35) - \text{Existing EMIs}, \text{Net Income} - \text{Expenses} - \text{Buffer})$

### 6.2 Loan Amount Calculation (Reverse EMI Equation)
Using standard amortization:
$$P = \frac{E \cdot \left[ (1 + r)^n - 1 \right]}{r \cdot (1 + r)^n}$$
where $r = \frac{\text{Annual Rate}}{12 \times 100}$ and $n = \text{Tenure in months}$.
* **Lender Sanction Amount:** Calculated using Lender Max EMI and aggressive tenure (e.g. 60 months).
* **Borrower-Safe Amount:** Calculated using Safe Max EMI and conservative tenure (e.g. 36–48 months).

### 6.3 Fair Interest Rate Bands & APR Calculation
* **Prime Salaried (Score > 750):** 10.5% – 12.5% p.a.
* **Average Salaried (Score 650–749 or Unknown):** 12.5% – 15.5% p.a.
* **Self-Employed Unsecured:** 14.0% – 18.0% p.a.
* **Secured / LAP Alternative:** 8.5% – 10.5% p.a. (Redirect recommendation for large requests).
* **All-In APR Formula:**
  $$\text{Effective APR} \approx \text{Nominal Rate} + \frac{\text{Processing Fees} + \text{Mandatory Insurance}}{\text{Sanctioned Principal} \times (\text{Tenure} / 12)}$$
  *(Standardized IRR / XIRR computed over cash flows)*.

### 6.4 Stress Test Scenario
Calculates borrower vulnerability under two mandatory stress scenarios:
1. **Income Shock (-20%):** Shows the new FOIR ratio if income reduces by 20%.
2. **Rate Hike (+200 bps):** Displays EMI increase if floating rate climbs by 2.0%.

---

## 7. Mandatory Personas & Ground Truth Benchmarks

### Persona 1: Priya (Prime Salaried)
* **Profile:** 29 yrs, Senior Software Engineer, ₹1,20,000 net salary, ₹15,000 existing car EMI, ₹35,000 expenses, CIBIL 785, requesting ₹8,00,000 for home renovation.
* **Routing:** Unsecured prime personal loan.
* **Expected Verdict:** **`BORROW`**
* **Lender Sanction vs Safe:** Lender likely offers ₹12L–₹14L; Borrower Safe is ₹7.5L–₹8.5L.
* **Fair Rate:** 10.5%–12.0% (APR ~11.8% with 1.5% fee).
* **Safe EMI:** ₹22,000/mo (Total FOIR remains below 31%).
* **Confidence:** **High** (verified salary + strong bureau score).

### Persona 2: Ravi (Self-Employed SME / Business)
* **Profile:** 38 yrs, Hardware Store Owner, 6 yrs vintage, ₹1,50,000 gross monthly profit (ITR shows ₹80,000 taxable), ₹20,000 existing equipment loan, requesting ₹15,00,000 for inventory/expansion. Owns shop commercial premises.
* **Routing:** **Redirect to Secured LAP / MSME Business Loan** (Warns against 16%+ unsecured PL).
* **Expected Verdict:** **`BORROW` (Via LAP) or `BORROW LESS` (if Unsecured)**
* **Lender Sanction vs Safe:** Unsecured PL caps at ₹8L–₹10L at high 16%–19% rate. LAP unlocks ₹15L at 9.25%–10.5%.
* **Safe EMI:** ₹30,000/mo.
* **Confidence:** **Medium-High** (business vintage solid, but ITR gap requires collateral).

### Persona 3: Anita (Informal / High-Obligation)
* **Profile:** 33 yrs, Boutique tailor / gig provider, irregular income ~₹35,000/mo, ₹14,000 existing EMIs across consumer durables & local microloans, 1 bounce last month, CIBIL Unknown/610, requesting ₹3,00,000.
* **Routing:** Debt restructuring / Emergency hold.
* **Expected Verdict:** **`DON'T BORROW YET` / `RESTRUCTURE FIRST`**
* **Rationale:** Existing debt already consumes 40% of income; any new EMI will breach 65% FOIR, leading to severe default risk.
* **Confidence:** **High on Verdict / Low on Rate** (Uncertain bureau history).

---

## 8. Shareable Negotiation Card & Privacy Design

* **URL Structure:** `https://borrowercopilot.in/card#d=<compressed_payload>`
* **Payload Encoding:**
  * Uses URL-safe LZ-string or base64url JSON containing only non-PII metrics:
    `{ l: "Personal", r: 800000, safeMin: 650000, safeMax: 750000, lendMin: 800000, lendMax: 1000000, rMin: 11.0, rMax: 12.5, emi: 22000, v: "BORROW", conf: "HIGH" }`
  * No names, no raw income numbers, no contact details.
* **Export Actions:**
  * **Copy Share Link**: Instant link copy with toast feedback.
  * **Print / PDF**: Clean, print-tailored CSS stylesheet removing UI navigation, formatted specifically for single-sheet 8.5x11 / A4 printout.

---

## 9. Verification & Acceptance Criteria

1. **Deterministic Accuracy:** Running identical inputs through `lib/rules/` produces mathematically identical outputs every time.
2. **Offline Readiness:** The app works smoothly without internet access or an active LLM API key.
3. **Adaptive Divergence:** Priya, Ravi, and Anita trigger distinctly different question sets, routing recommendations, and final negotiation cards.
4. **Mobile Responsiveness:** Tested and verified on viewport widths from 375px (iPhone SE) to 1440px (Desktop).
5. **Evaluator Velocity:** Evaluator can clone, run `npm install && npm run dev`, test all 3 personas, and review the negotiation cards in under 5 minutes.

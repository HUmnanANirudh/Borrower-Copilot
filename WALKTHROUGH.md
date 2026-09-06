# BorrowIQ — Technical Walkthrough & Implementation Details

## Application Architecture & Philosophy

**BorrowIQ** is a zero-footprint borrower advisory copilot that levels the information asymmetry between Indian retail borrowers and commercial lenders.

It generates an official **Borrower Negotiation Brief** providing four definitive outputs:
1. **The Decision to Borrow:** Grounded in a conservative 35% safe FOIR (Fixed Obligation to Income Ratio) and non-discretionary living cost floors.
2. **The Safe Repayment Ceiling:** An absolute monthly limit protecting a 10% emergency buffer, contrasting against aggressive 50%–60% bank maximums.
3. **The Fair Rate Band & All-In APR:** Disclosing true borrowing costs with statutory 18% GST and upfront processing fees.
4. **The Safe Loan Size vs. Sanction:** Demonstrating why a 36–48 month loan avoids a 5-year debt trap.

---

## Core System Modules

### 1. Two-Tier Dynamic Question Engine
- **Tier 1: Core Must Questions (8 Baseline)**: Sizing, Purpose, Employment Category, Net Inflow, Debt Servicing, Living Expenses, Age, Bureau Tier. Answering these alone produces all four outputs with wider, honest confidence bands.
- **Tier 2: Targeted Adaptive Tightening (Max 1–2 Questions)**:
  - Salaried Corporate: Evaluates `variablePayPortionPercent` (bonus discount haircuts) and `emergencySavingsMonths`.
  - Kirana / SME: Evaluates `businessVintageYears` (10+ year operating longevity offsets missing bureau score) and `hasUnencumberedCollateral` (unlocks 9.0%–10.5% LAP).
  - Gig / High Debt: Evaluates `hasHighCostAppLoans` (30%+ predatory apps) and `recentDelinquencyOrBounce`.

### 2. AI Question Selector`.
- Operates under strict JSON mode (`response_format: { type: "json_object" }`) with `reasoning_effort: "low"` and `max_completion_tokens: 400`.
- The AI never calculates financial math or sanction amounts; its sole responsibility is selecting the single most informative question from `src/lib/questions/registry.ts` to tighten output ranges.
- If the AI request times out or is offline, the system seamlessly falls back to local heuristic ranking without interrupting the user experience.

### 3. Pure TypeScript Rules Engine (`src/lib/rules/`)
- Fully isolated from the React UI layer for deterministic financial auditing.
- Modules:
  - `affordability.ts`: 35% safe FOIR, 20% living expense floor, 10% cash buffer.
  - `apr.ts`: RBI-style all-in APR calculation factoring processing fees and statutory 18% GST.
  - `rates.ts`: Market baseline rates, credit tier adjustments, secured collateral routing.
  - `stress.ts`: 20% income reduction stress testing.
  - `pipeline.ts`: Composes all lenses into the unified assessment object.

### 4. Zero Backend Data Storage & Stateless URLs
- All assessment calculations execute client-side.
- Shareable cards use URL-safe Base64 encoding (`/card/[token]`) enabling frictionless sharing and printing with zero database persistence.

---
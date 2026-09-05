# Borrower Copilot

> **Independent Loan Decision Engine & Negotiation Card for Indian Borrowers.**  
> Built with Next.js (App Router, React 19), TypeScript, and Tailwind CSS v4.  
> Derived from live extraction of the **Mentimeter Design System** with strict **Double-Lock Cash-Flow Governance**.

---

## Quick Start (Run Locally in under 2 Minutes)

```bash
# 1. Install dependencies
bun install
# or: npm install

# 2. Start development server
bun run dev
# or: npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 1. Core Goal & Philosophy

Indian retail and SME borrowers frequently fall into predatory debt traps because bank loan executives underwrite for **bank profit and maximum ticket size** (pushing 50%–60% FOIR and 5-year tenures), disguising high interest rates with nominal numbers and upfront fees.

Borrower Copilot answers 4 fundamental questions deterministically:
1. **Should I borrow?** (Verdict: `BORROW`, `BORROW LESS`, `DON'T BORROW YET`)
2. **How much can I safely borrow?** (Contrasting **Estimated Bank Sanction** vs. **Borrower-Safe Limit**)
3. **What rate is fair?** (Fair interest band, expected bank sales quotes, and true **RBI All-In APR** including processing fees and 18% GST)
4. **What EMI should I agree to?** (Hard safe EMI ceiling, tenure sensitivity table, and 20% income-drop stress tests)

The app generates a **Shareable, Printable Borrower Negotiation Card** with exact scripts to counter bank sales pitches.

---

## 2. Key Architecture Principles

### Zero Login & No Bureau Pull
- No phone OTPs, passwords, or CIBIL bureau pulls.
- Completely stateless. User data is never stored in any database.

### 100% Deterministic Financial Truth (`src/lib/rules/*`)
- **Strict Separation of Concerns**: All calculations (FOIR, Reverse Amortization, All-in APR, Safe EMI, Stress Scenarios) are executed in pure TypeScript math functions (`lib/rules/*`).
- **Zero LLM Dependency for Calculations**: Financial numbers are never hallucinated.
- **Optional AI Presentation Layer**: AI SDK (`ai` + `AI_GATEWAY_API_KEY`) is used strictly as an optional presentation layer to generate spoken natural language roleplay scripts. If no key is present, built-in deterministic templates execute instantly.

### Dynamic Information-Value Adaptive Engine
- Avoids rigid early pigeonholing.
- Operates via a **Facts $\to$ Derived Metrics $\to$ Decisions** pipeline:
  - **Phase 1: Universal Intake** (Purpose, Amount, Age).
  - **Phase 2: Financial Baseline** (Income signal, Take-home pay, Ongoing EMIs, Living costs, Bureau score).
  - **Phase 3: Information-Value Dynamic Loop** (Only asks questions that reduce uncertainty in outputs; halts as soon as all 4 outputs are verified).

### Reason Traces on Every Output
- Every metric returns its calculation chain:
  > *"Safe EMI: ₹24,500/month because your cash-flow floor is lower than your 35% FOIR ceiling."*

### Stateless URL Sharing (`#card=...`)
- Negotiation cards are compressed into URL fragments (`lz-string` / base64url).
- Zero server storage; fully private and shareable.

---

## 3. Evaluator One-Click Persona Presets

Evaluators can click the **Preset Bar** at the top of the app to instantly test divergent rule behaviors:

1. **Priya, 29 (Bengaluru · Salaried)**
   - Software engineer at an MNC, ₹1.1L net salary, ₹14k car loan, 780 CIBIL score.
   - **Verdict:** `BORROW` at 10.5%–12.0% prime rate, ₹24,500 safe EMI.
   - [Read Priya's full run-through documentation](./runthroughs/priya.md)

2. **Ravi, 42 (Mysuru · Self-Employed SME)**
   - Kirana store for 14 years. Net cash income ₹60k/mo + ₹18k wife teaching. ₹4.2L ITR. Owns ₹45L unencumbered shop. No credit score.
   - **Verdict:** `BORROW` (via Inferred Secured LAP Route) / `BORROW LESS` (if Unsecured PL).
   - [Read Ravi's full run-through documentation](./runthroughs/ravi.md)

3. **Anita, 35 (Hubballi · Informal / Gig)**
   - Delivery rider + home tailoring, ₹28k/mo income. 3 predatory payday apps at 30%+, 1 bounce last month.
   - **Verdict:** `DON'T BORROW YET / RESTRUCTURE FIRST`.
   - Actionable Alternative: Consolidate ₹35k app debt via regulated micro-credit (saving ₹6,800/mo) before buying the scooter.
   - [Read Anita's full run-through documentation](./runthroughs/anita.md)

---

## 4. Testing & Verification

### Run Adversarial Test Suite
To verify that the rules engine handles edge cases (e.g. ₹2L income with ₹90k EMI, unknown credit scores, unrealistically low expenses, variable pay haircuts, and collateral without cash flow):

```bash
bun run scripts/test-adversarial.ts
```

---

## 5. Authoritative Rules Documentation

Every rule, threshold, mathematical formula, and source citation is documented in:
👉 **[RULES.md](./RULES.md)**

---

## 6. Project Structure

```text
borrower-copilot/
├── src/
│   ├── app/
│   │   ├── api/explain/route.ts        # Optional AI Gateway explanation route
│   │   ├── globals.css                 # Mentimeter tokens & Tailwind v4 config
│   │   ├── layout.tsx                  # App layout & metadata
│   │   └── page.tsx                    # Main client orchestrator
│   ├── components/
│   │   ├── Header.tsx                  # Sticky brand navigation
│   │   ├── PersonaBar.tsx              # One-click benchmark presets
│   │   ├── HeroSection.tsx             # Editorial high-impact hero
│   │   ├── QuizView.tsx                # Single-focus question slider
│   │   ├── AssessmentResults.tsx       # 4 Outputs + 3D Assessment + Reason Traces
│   │   ├── NegotiationCard.tsx         # Printable & shareable card
│   │   └── QuoteComparison.tsx         # Bank Quote Reality Check mode
│   ├── lib/
│   │   ├── types.ts                    # Core TypeScript domain models
│   │   ├── personas.ts                 # Priya, Ravi, and Anita benchmark datasets
│   │   ├── quizzing.ts                 # Dynamic Information-Value question engine
│   │   ├── share.ts                    # Stateless URL fragment compressor/decoder
│   │   ├── ai.ts                       # AI Gateway client + deterministic templates
│   │   └── rules/                      # Deterministic Financial Rules Engine
│   │       ├── affordability.ts        # Double-lock cash flow & safe FOIR
│   │       ├── eligibility.ts          # Estimated lender range & inferred routing
│   │       ├── rates.ts                # Fair rates & unknown score handling
│   │       ├── apr.ts                  # All-in APR equation with fees & GST
│   │       ├── emi.ts                  # Amortization & tenure matrix
│   │       ├── stress.ts               # Income drop (-20%) stress simulation
│   │       ├── pipeline.ts             # Facts normalizer & derived metrics
│   │       └── index.ts                # Master evaluation & quote reality check
├── scripts/
│   ├── test-adversarial.ts             # Adversarial edge case validation suite
│   └── verify-rules.ts                 # Persona benchmark test script
├── runthroughs/
│   ├── priya.md                        # Priya benchmark walkthrough
│   ├── ravi.md                         # Ravi benchmark walkthrough
│   └── anita.md                        # Anita benchmark walkthrough
├── RULES.md                            # Comprehensive Financial Rules Document
├── MENTIMETER_DESIGN_SYSTEM.md         # Reference tokens from Mentimeter extraction
└── README.md                           # This documentation
```

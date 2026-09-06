# BorrowIQ — Rules Engine

This document lists the business rules, limits, and assumptions that control the BorrowIQ assessment engine. The application separates these mathematical rules from the user interface logic.


## 1. Income and Household Data

| Rule or Metric | Value or Limit | Reason | Source |
|---|---|---|---|
| Variable Pay Reduction | 50% reduction on the variable portion if it exceeds 15% of total income | Lenders discount variable pay because it fluctuates. We reduce it aggressively to ensure the borrower can pay during low-earning months. | Retail credit risk mitigation practices for cyclical incomes |
| Expense Minimum | Maximum of ₹12,000 or 20% of total household income | Borrowers often under-report expenses. This enforces a basic urban survival cost to prevent unsafe debt-to-income calculations. | Cost of living indices and urban poverty line benchmarks |
| Assessed Income (Gig Worker) | 35% reduction on gross gig income | Lenders discount informal cash flows because they are unpredictable. | Formal underwriting norms |

## 2. Debt Burden and Affordability

| Rule or Metric | Value or Limit | Reason | Source |
|---|---|---|---|
| Minimum Cash-Flow Requirement | Net Income - Expenses - Existing EMI - 10% Cash Buffer | This is the absolute limit a borrower can pay monthly without defaulting on the loan or failing to buy necessities. | Basic liquidity buffering principles |
| Emergency Cash Buffer | 10% of Effective Net Income | Borrowers need cash for emergencies. If a borrower uses 100% of their spare cash for an EMI, a single medical bill will cause a missed payment. | Financial planning standards |
| Maximum Safe Debt Ratio (Salaried) | 35% of income | This is a safe ceiling for debt. Lenders often allow 50% to 60%, which forces borrower distress. | Conservative household leverage caps |
| Maximum Safe Debt Ratio (Gig Worker) | 25% of income | Variable incomes require a lower debt ceiling to protect the borrower when earnings drop. | Volatility-adjusted leverage limits for informal workers |
| Lender Debt Ratio Assumption | 50% (Score below 750) to 60% (Score 750 or above) | Banks use these ratios to maximize loan amounts. We calculate this to contrast the bank offer with the safe borrower limit. | Bank underwriting guidelines |
| Existing Debt Overburden | Current Debt Ratio >= 35% | Existing loan commitments already exceed the safe leverage threshold, risking debt distress. Triggers recommendation to pay down existing debt before taking new loans. | Pre-delinquency leading indicators |
| Living Expense Deficit | (Essential Expenses + EMIs) >= 90% of income | Non-discretionary living costs leave less than the 10% emergency reserve buffer, producing ₹0 uncommitted cash flow. Triggers advice to build liquid surplus rather than taking on unserviceable debt. | Household budget solvency standards |

## 3. Interest Rates and Pricing

| Rule or Metric | Value or Limit | Reason | Source |
|---|---|---|---|
| Base Rate (Unsecured) | 11.0% to 12.5% | This is the standard minimum rate for retail unsecured personal loans. | Current market rates |
| Base Rate (Secured Property) | 9.0% to 10.5% | Providing property as collateral reduces lender risk and interest rates. The application recommends this when the loan exceeds ₹10L and the borrower owns property. | Current market rates |
| Credit Score Penalty | +0.5% to +1.0% (Score 700-749)<br>+2.0% to +3.5% (Score 650-699)<br>+4.5% to +7.0% (Score <650) | Lenders add a risk premium based on past credit defaults. | Retail lending schedules |
| Prime Credit Discount | -0.75% to -0.50% (Score 750+) | Lenders reward excellent credit history with lower pricing. | Bank promotional rates |
| Unknown Score Penalty | +0.75% to +3.5% (Widens the rate band) | An unknown score indicates uncertainty, not a specific bad score. The application widens the rate band and lowers the confidence score. | Statistical risk pricing for unverified credit histories |
| Business History Discount | -0.50% (10+ years operating) | A long operating history proves the business is stable. This offsets the risk of an unknown formal credit score. | SME underwriting norms |
| Predatory Debt Penalty | +3.00% | Holding high-cost app debt (30%+) indicates severe financial distress. This increases the risk premium. | Risk management principles |
| Lender Initial Quote Margin | Fair Rate + 1.25% to 2.50% | Sales teams start with high margins. The Negotiation Card prepares borrowers to negotiate the rate down to the fair band. | Industry observation |

## 4. Product Selection and Eligibility

| Rule or Metric | Value or Limit | Reason | Source |
|---|---|---|---|
| Secured Loan Recommendation | Unencumbered property > ₹20L AND Request > ₹10L (or Business purpose) | This prevents the borrower from accepting high unsecured rates when they can use property to get cheaper capital. | Yield-curve optimization for borrowers |
| Microfinance Recommendation | Existing 30%+ App Debt AND requesting Debt Consolidation | The borrower must refinance predatory debt through regulated 12-16% channels before they assume new commercial credit. | Microfinance best practices |
| Lender Maximum Sanction | Calculated using the lender debt ratio limit over a 60-month term | Lenders extend the loan term to 60 months to maximize the total loan amount. | Bank practices |
| Borrower Safe Sanction | Calculated using the safe EMI limit over a 36 to 48-month term | This stops borrowers from accepting 5-year debt traps for basic consumption. | Responsible consumption lending time horizons |
| True Annual Cost (APR) | Quoted Interest Rate + Annualized Upfront Fees (including 18% GST) | Lenders often hide 2% to 3% processing fees. The true APR calculation forces these hidden costs into the annualized rate. | RBI disclosure guidelines |

## 5. Confidence Levels

| Rule or Metric | Value or Limit | Reason | Source |
|---|---|---|---|
| High Confidence | Known Bureau Score, Stable Income | The application has verified data to calculate tight output ranges. | Actuarial certainty principles |
| Medium Confidence | Unknown Credit Score | The application widens the fair rate band because it lacks credit history data. | Information asymmetry discounting |
| Low Confidence | Unknown Credit Score AND (Gig Worker or Predatory Debt) | Multiple unverified variables compound the risk. The application widens ranges significantly. | High-variance probability modeling |

## 6. System Limits and Unknowns (What We Do Not Know)

To ensure the borrower receives honest advice, the application explicitly defines the limits of its knowledge. The application tells the borrower when it is guessing or using a broad market proxy.

| Missing Data | System Response | Why We Do Not Know It |
|---|---|---|
| Actual Credit Bureau Score | The application treats an unknown score as "Uncertain," not as a default low score (e.g., 300). It widens the fair interest rate band and explicitly warns the user that checking their formal score will narrow the band. | The application does not integrate with Equifax, CIBIL, or Experian APIs to protect user privacy and avoid hard inquiries. |
| Lender Proprietary Algorithms | The application uses broad regulatory debt-to-income limits (50% to 60%). It labels the lender sanction amount as an "Estimate." | Banks protect their exact risk models and geographic exclusion lists as trade secrets. |
| Live Market Interest Rates | The application uses static baseline rate bands (e.g., 11.0% to 12.5% for unsecured loans) rather than daily dynamic rates. | The application does not connect to live product pricing APIs or rate aggregators. |
| Micro-Cash Flow Timing | The application uses a monthly average for income and applies a flat reduction for gig workers. It does not track daily or weekly cash deficits. | The application does not use Account Aggregator (AA) frameworks to read live banking transactions. |

# Assessment Run-Throughs

This document shows how the application assesses the three test profiles: Priya, Ravi, and Anita. 

The application uses adaptive logic. It asks only the questions necessary to calculate price bands and cash-flow limits.

---

## 1. Priya (Age 29, Bengaluru)

**Profile:** Software engineer. Net income: ₹1,10,000/month. Existing car EMI: ₹14,000. Rent: ₹28,000. Credit score: 780. She wants an ₹8,00,000 personal loan for a wedding.

**Questions the Application Asked:**
1. **Loan Purpose:** Wedding / Consumption
2. **Amount Wanted:** ₹8,00,000
3. **Employment Type:** Salaried Employee
4. **Net Monthly Income:** ₹1,10,000
5. **Existing Monthly EMIs:** ₹14,000
6. **Household Living Expenses:** ₹28,000
7. **Credit Score:** 750 and above
8. **Collateral:** None

*(The application stops asking questions here. It does not ask Priya about business history or loan defaults because she is a salaried employee with a 750+ credit score. Those variables do not change her prime pricing band).*

**The Four Outputs:**
1. **Verdict:** Borrow.
   * *Reason:* Her stable income, low existing debt, and available cash support the requested loan.
2. **Maximum Amount:**
   * *Lender Estimate:* ₹15,00,000 to ₹20,00,000 (Banks use a 60% debt limit and a 5-year term).
   * *Borrower Safe Limit:* ₹9,00,000 to ₹11,00,000.
   * *Advice:* Use the Safe Limit. Her requested ₹8,00,000 fits inside this limit.
3. **Fair Interest Rate:** 
   * *Fair Band:* 10.25% to 12.0%. 
   * *Total Cost:* The effective APR is approximately 11.5%, which includes a standard 1% processing fee.
4. **EMI Ceiling:**
   * *Maximum Safe EMI:* ₹24,500/month.
   * *Stress Test:* If her income drops by 20%, her debt ratio rises to 44%. This is high but survivable.

---

## 2. Ravi (Age 42, Mysuru)

**Profile:** Store owner for 14 years. Cash income: ₹40,000 to ₹80,000. Tax return shows ₹4,20,000/year. He owns his shop (value ₹45,00,000) with no debt. No credit score. Wife earns ₹18,000. He wants ₹15,00,000 for his business.

**Questions the Application Asked:**
1. **Loan Purpose:** Business Expansion
2. **Amount Wanted:** ₹15,00,000
3. **Employment Type:** Self-Employed / Business
4. **Net Monthly Income:** ₹68,000 (Combined average)
5. **Existing Monthly EMIs:** ₹0
6. **Household Living Expenses:** ₹25,000
7. **Credit Score:** I do not know / Never taken a loan
8. **Collateral:** Yes, Commercial Property
9. **Collateral Value:** ₹45,00,000
10. **Business History:** 14 Years

**The Four Outputs:**
1. **Verdict:** Borrow. 
   * *Reason:* He owns property worth ₹45,00,000. An unsecured loan for ₹15,00,000 requires high interest rates (15% to 20%). Pledging the property allows a secured loan at 9.0% to 10.5%.
2. **Maximum Amount:**
   * *Lender Estimate (Unsecured):* ₹8,00,000 (Limited by tax returns).
   * *Lender Estimate (Secured):* ₹22,00,000 (Limited by 50% of property value).
   * *Borrower Safe Limit:* ₹12,00,000 to ₹15,00,000.
3. **Fair Interest Rate:** 
   * *Fair Band:* 9.25% to 13.5%.
   * *Reason:* The application widens the band because Ravi has no credit score. His 14-year business history prevents the band from going higher.
4. **EMI Ceiling:**
   * *Maximum Safe EMI:* ₹23,800/month.
   * *Stress Test:* The application uses a strict 25% debt limit because his income fluctuates. This ensures he can pay the EMI during low-revenue months.

---

## 3. Anita (Age 35, Hubballi)

**Profile:** Delivery worker and tailor. Income: ₹26,000 to ₹30,000/month. Husband is unemployed. She has three app loans totaling ₹35,000 at 30%+ interest, with one recent missed payment. She wants ₹1,50,000 for an electric scooter.

**Questions the Application Asked:**
1. **Loan Purpose:** Vehicle / Productive Asset
2. **Amount Wanted:** ₹1,50,000
3. **Employment Type:** Gig Worker / Freelancer
4. **Net Monthly Income:** ₹28,000 (Average)
5. **Existing Monthly EMIs:** ₹8,000
6. **Household Living Expenses:** ₹20,000
7. **Credit Score:** Below 650
8. **High-cost app loans:** Yes
9. **Recent missed payment:** Yes

**The Four Outputs:**
1. **Verdict:** Do not borrow yet.
   * *Reason:* She pays high-cost 30% interest loans, she missed a recent payment, and she has no spare monthly cash. Adding new debt will cause a debt spiral.
   * *Alternative:* She must refinance her high-cost loans through a self-help group or microfinance institution at 12% to 15% interest before she takes new debt.
2. **Maximum Amount:**
   * *Lender Estimate:* ₹0 (Banks will reject her application due to the missed payment and high debt ratio).
   * *Borrower Safe Limit:* ₹0 (Her monthly cash flow is negative).
3. **Fair Interest Rate:** 
   * *Fair Band:* Not applicable. The application refuses to price new commercial debt for this profile.
4. **EMI Ceiling:**
   * *Maximum Safe EMI:* ₹0/month.
   * *Reason:* Current living expenses and existing debt consume all her income. She has no cash for a new EMI.

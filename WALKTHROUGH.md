# Borrower Copilot Walkthrough

## Application Design

I built a client-side application that protects user privacy and adapts to the risk profile of each borrower. 

The application generates a **Negotiation Card**. This document provides the borrower with four clear data points:
1. **The decision to borrow:** Whether they should take a loan, and what to do instead if they should not.
2. **The maximum safe EMI:** A limit based on their actual cash flow, not on bank maximums.
3. **The fair interest rate:** A defined rate band and the reasons why they qualify for it.
4. **The safe loan size:** The amount they should ask for, compared to the larger amount the bank will offer.

### Core Functions
* **Adaptive Question Engine:** The interface removes unnecessary questions. A salaried worker with an excellent credit score does not see questions about business history or loan defaults. A gig worker with an unknown credit score sees detailed behavioral questions. 
* **Zero Backend Data Storage:** The application processes all inputs in the browser. It compresses the final mathematical output into a secure URL hash. The user can share or save this URL without a database.
* **AI Question Selector:** I integrated the Vercel AI SDK with Groq (Llama-3.3-70b). The AI does not calculate financial numbers. Instead, it inspects the borrower's preliminary profile and selects the single most impactful question from a pre-vetted Question Registry, or decides that enough information exists to produce a reliable assessment.

## Future Additions

1. **Account Aggregator Integration:** Allow the user to link their bank securely instead of entering income and expenses manually. The application can analyze transactions to determine exact cash-flow volatility and find hidden loan payments.
2. **Direct Credit Bureau Access:** Add an option to retrieve a credit score via OTP. This removes the uncertainty of the "Unknown" credit score category and narrows the fair rate bands significantly.
3. **Product Matching Engine:** The application currently recommends generic categories like "Secured Property Loan" or "Personal Loan". I would add real market products and live API-driven interest rates.

## Features to Remove

1. **Unnecessary Inputs:** If usage data shows that borrowers skip the "Emergency Savings Months" question, I will remove it. It rarely changes the final debt distress score unless the borrower is already failing.
2. **Complex Animations:** The quiz uses smooth transitions that may reduce performance on older mobile devices. I will replace these with standard HTML forms to ensure the application works on all devices.

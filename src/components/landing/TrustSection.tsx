import React from 'react';

export function TrustSection() {
  return (
    <section className="w-full py-20 px-4 sm:px-6 bg-[#171717] text-white">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <span className="text-xs uppercase font-extrabold tracking-widest text-[#a9b5fc] block">
          The Borrower Narrative
        </span>

        <blockquote className="space-y-4">
          <p className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-snug">
            <span className="text-[#a09f9d] block">A lender asks: “How much can we lend you?”</span>
            <span className="text-white block mt-2">Borrower Copilot asks: “How much should you take?”</span>
          </p>
        </blockquote>

        <p className="text-sm sm:text-base text-[#c5c3c1] max-w-2xl mx-auto leading-relaxed">
          Banks make money by stretching loan tenures and maximizing your FOIR (debt-to-income ratio). We evaluate your uncommitted living cash flow to guarantee you never take on debt that threatens food, rent, or emergencies.
        </p>
      </div>
    </section>
  );
}

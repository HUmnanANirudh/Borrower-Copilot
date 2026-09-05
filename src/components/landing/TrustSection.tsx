import React from 'react';

export function TrustSection() {
  return (
    <section className="w-full py-20 lg:py-32 px-6 lg:px-16 bg-[#101010] text-white">
      <div className="max-w-[1280px] mx-auto text-center space-y-12">
        <span className="text-xs uppercase font-extrabold tracking-widest text-[#8a9bff] block">
          The Borrower Narrative
        </span>

        <blockquote className="space-y-4 max-w-4xl mx-auto">
          <p className="font-display text-[40px] sm:text-[48px] lg:text-[64px] font-medium tracking-[-0.03em] leading-[1.05]">
            <span className="text-[#a09f9d] block">A lender asks: “How much can we lend you?”</span>
            <span className="text-white block mt-2">Borrower Copilot asks: “How much should you take?”</span>
          </p>
        </blockquote>

        <p className="text-[18px] sm:text-[20px] text-[#c5c3c1] max-w-3xl mx-auto leading-[1.6]">
          Banks make money by stretching loan tenures and maximizing your FOIR. We evaluate your uncommitted living cash flow to guarantee you never take on debt that threatens food, rent, or emergencies.
        </p>
      </div>
    </section>
  );
}

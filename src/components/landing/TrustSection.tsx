import React from 'react';

export function TrustSection() {
  return (
    <section className="w-full bg-[#f3ede7]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16 py-16 lg:py-24">
        <div className="bg-[#171717] rounded-[20px] px-8 lg:px-16 py-16 lg:py-20 text-center">
          <h2 className="font-display text-[40px] sm:text-[56px] lg:text-[72px] font-normal text-white leading-[0.9] tracking-normal max-w-[900px] mx-auto">
            <span className="text-[#a09f9d]">A lender asks: &ldquo;How much can we lend you?&rdquo;</span>
            <br />
            <span className="text-white mt-2 block">Borrower Copilot asks: &ldquo;How much should you take?&rdquo;</span>
          </h2>

          <p className="text-[16px] sm:text-[18px] text-[#a09f9d] max-w-[600px] mx-auto leading-[1.55] mt-8">
            Banks make money by stretching loan tenures and maximizing your FOIR. We evaluate your uncommitted living cash flow to guarantee you never take on debt that threatens food, rent, or emergencies.
          </p>
        </div>
      </div>
    </section>
  );
}

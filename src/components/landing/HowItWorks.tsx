import React from 'react';

const steps = [
  {
    num: '1',
    title: 'Answer a few questions',
    description: 'Loan purpose, target amount, take-home income, and household living expenses in plain rupees.',
  },
  {
    num: '2',
    title: 'Information-value engine calculates',
    description: 'Our smart evaluation asks only what moves the needle, halting questions once your safe metrics stabilize.',
  },
  {
    num: '3',
    title: 'Take your defense card to the bank',
    description: 'Get your safe borrowing ceiling, fair interest rate band, and a one-page card to negotiate with confidence.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full bg-white">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-16 py-14 lg:py-20">
        <h2 className="font-display text-[36px] sm:text-[48px] lg:text-[64px] font-normal text-[#171717] leading-[0.9] text-center mb-10 lg:mb-14">
          HOW BORROWIQ WORKS?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div key={step.num} className="bg-[#f7f6f4] rounded-2xl p-7 lg:p-8">
              <span className="font-display text-[40px] text-[#5769e7] leading-none block mb-4">
                {step.num}
              </span>
              <h3 className="text-[20px] font-semibold text-[#171717] leading-tight mb-2">
                {step.title}
              </h3>
              <p className="text-[15px] text-[#5d5b59] leading-[1.55]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

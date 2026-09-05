import React from 'react';

const steps = [
  {
    num: '01',
    title: 'Tell us about your loan',
    description: 'Input your loan purpose, target amount, take-home earnings, and current living expenses in plain rupees.',
  },
  {
    num: '02',
    title: 'We ask only what matters',
    description: 'Our information-value engine asks only questions that move your outputs, halting when your metrics stabilize.',
  },
  {
    num: '03',
    title: 'Get your borrowing position',
    description: 'Receive your safe borrowing ceiling, fair rate band, stress analysis, and an actionable negotiation card.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16 py-16 lg:py-24">
        {/* Section heading */}
        <div className="text-center max-w-[800px] mx-auto mb-12 lg:mb-16">
          <h2 className="font-display text-[48px] sm:text-[64px] lg:text-[88px] font-normal text-[#171717] leading-[0.85] tracking-normal">
            Simple to start. Clear to act.
          </h2>
          <p className="text-[16px] text-[#5d5b59] mt-4 max-w-[480px] mx-auto leading-[1.55]">
            Deterministic financial analysis in under 3 minutes.
          </p>
        </div>

        {/* Steps — Mentimeter uses numbered steps with 01/02/03 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-[#f7f6f4] rounded-[16px] p-8 lg:p-10"
            >
              <span className="font-display text-[48px] text-[#5769e7] leading-none block mb-6">
                {step.num}
              </span>
              <h3 className="text-[28px] font-semibold text-[#171717] leading-[1.15] mb-3 font-display">
                {step.title}
              </h3>
              <p className="text-[16px] text-[#5d5b59] leading-[1.55]">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Reassurance pill */}
        <div className="mt-12 text-center">
          <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#f2f1f0] text-[14px] font-semibold text-[#171717]">
            🔒 No login · No credit bureau pull · No permanent personal data
          </span>
        </div>
      </div>
    </section>
  );
}

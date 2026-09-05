import React from 'react';

export function HowItWorks() {
  const steps = [
    {
      num: '1',
      title: 'Tell us about your loan',
      description: 'Input your loan purpose, target amount, take-home earnings, and current living expenses in plain rupees.'
    },
    {
      num: '2',
      title: 'We ask only what matters',
      description: 'Our information-value engine asks only questions that move your outputs, halting questioning when your metrics stabilize.'
    },
    {
      num: '3',
      title: 'Get your borrowing position',
      description: 'Receive your safe borrowing ceiling, fair rate band, stress analysis, and an actionable negotiation card.'
    }
  ];

  return (
    <section id="how-it-works" className="w-full py-20 lg:py-32 px-6 lg:px-16 bg-[#f3ede7]">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#5769e7] mb-4 block">
            The Process
          </span>
          <h2 className="font-display text-[44px] sm:text-[52px] lg:text-[64px] font-medium text-[#101010] tracking-[-0.03em] leading-[0.9]">
            How Borrower Copilot Works
          </h2>
          <p className="text-[18px] text-[#5d5b59] mt-6">
            Deterministic financial analysis in under 3 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col bg-white p-10 lg:p-12 rounded-[24px] border-[1px] border-[#ebeae8] menti-card-shadow">
              <div className="w-16 h-16 rounded-full bg-[#f2f1f0] flex items-center justify-center mb-8">
                <span className="font-display text-[32px] text-[#5769e7] tracking-tight">
                  {step.num}
                </span>
              </div>
              <h3 className="font-display text-[24px] lg:text-[28px] text-[#101010] tracking-tight mb-4 leading-[1.15]">
                {step.title}
              </h3>
              <p className="text-[16px] text-[#5d5b59] leading-[1.5]">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Reassurance Banner */}
        <div className="mt-16 text-center">
          <p className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#f2f1f0] border border-[#dedcd9] text-[15px] font-semibold text-[#171717]">
            🔒 No login · No credit bureau pull · No permanent personal data
          </p>
        </div>
      </div>
    </section>
  );
}

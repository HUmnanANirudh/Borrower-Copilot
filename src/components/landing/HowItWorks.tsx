import React from 'react';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Tell us about your loan',
      description: 'Input your loan purpose, target amount, take-home earnings, and current living expenses in plain rupees.'
    },
    {
      num: '02',
      title: 'We ask only what matters',
      description: 'Our information-value engine asks only questions that move your outputs, halting questioning when your metrics stabilize.'
    },
    {
      num: '03',
      title: 'Get your borrowing position',
      description: 'Receive your safe borrowing ceiling, fair rate band, stress analysis, and an actionable negotiation card.'
    }
  ];

  return (
    <section id="how-it-works" className="w-full py-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase font-extrabold tracking-wider text-[#5769e7] mb-2 block">
            The Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#171717] tracking-tight">
            How Borrower Copilot Works
          </h2>
          <p className="text-sm text-[#5d5b59] mt-2">
            Deterministic financial analysis in under 3 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col bg-white p-7 rounded-3xl border border-[#dedcd9] menti-card-shadow">
              <span className="text-4xl font-black text-[#5769e7] mb-4 tracking-tighter">
                {step.num}
              </span>
              <h3 className="text-lg font-bold text-[#171717] mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-[#5d5b59] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Reassurance Banner */}
        <div className="mt-10 text-center">
          <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f2f1f0] border border-[#dedcd9] text-xs font-semibold text-[#171717]">
            🔒 No login · No credit bureau pull · No permanent personal data
          </p>
        </div>
      </div>
    </section>
  );
}

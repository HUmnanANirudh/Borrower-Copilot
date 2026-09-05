import React from 'react';
import { CoinsSwapIcon, ShieldCheckIcon, CalculatorIcon } from '@/components/icons';

export function ValueProps() {
  const props = [
    {
      title: 'Know your limit',
      description: 'Separate what an aggressive lender may offer from what your household cash flow can safely carry without default.',
      icon: <ShieldCheckIcon className="w-6 h-6 text-[#5769e7]" aria-hidden="true" />,
      bg: 'bg-[#e5e9ff]'
    },
    {
      title: 'Know your price',
      description: 'Unmask headline interest pitches with fair market rate bands, estimated all-in APR, and fee transparency.',
      icon: <CoinsSwapIcon className="w-6 h-6 text-[#52ad6e]" aria-hidden="true" />,
      bg: 'bg-[#e4f4e7]'
    },
    {
      title: 'Negotiate with confidence',
      description: 'Take a clear, one-page borrower defense card into the branch with exact script counters and do-not-cross rules.',
      icon: <CalculatorIcon className="w-6 h-6 text-[#b28615]" aria-hidden="true" />,
      bg: 'bg-[#fff4d7]'
    }
  ];

  return (
    <section className="w-full py-20 lg:py-32 px-6 lg:px-16 bg-white border-y border-[#ebeae8]">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-[#5769e7] mb-4">
            Why Borrower Copilot
          </h2>
          <p className="font-display text-[44px] sm:text-[52px] lg:text-[64px] font-medium text-[#101010] tracking-[-0.03em] leading-[0.9]">
            Built strictly for the borrower’s side of the table.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {props.map((p, idx) => (
            <div 
              key={idx}
              className="bg-[#f7f6f4] p-10 lg:p-12 rounded-[24px] flex flex-col justify-between hover:bg-[#f2f1f0] transition-colors"
            >
              <div>
                <div className={`w-14 h-14 rounded-full ${p.bg} flex items-center justify-center mb-8`}>
                  {p.icon}
                </div>
                <h3 className="font-display text-[24px] lg:text-[28px] text-[#101010] tracking-tight mb-4 leading-[1.15]">
                  {p.title}
                </h3>
                <p className="text-[16px] text-[#5d5b59] leading-[1.5]">
                  {p.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

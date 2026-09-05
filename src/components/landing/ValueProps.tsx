import React from 'react';
import { CoinsSwapIcon, ShieldCheckIcon, CalculatorIcon } from '@/components/icons';

export function ValueProps() {
  const props = [
    {
      title: 'Know your limit',
      description: 'Separate what an aggressive lender may offer from what your household cash flow can safely carry without default.',
      icon: <ShieldCheckIcon className="w-5 h-5 text-[#5769e7]" aria-hidden="true" />,
      bg: 'bg-[#e5e9ff]'
    },
    {
      title: 'Know your price',
      description: 'Unmask headline interest pitches with fair market rate bands, estimated all-in APR, and fee transparency.',
      icon: <CoinsSwapIcon className="w-5 h-5 text-[#52ad6e]" aria-hidden="true" />,
      bg: 'bg-[#e4f4e7]'
    },
    {
      title: 'Negotiate with confidence',
      description: 'Take a clear, one-page borrower defense card into the branch with exact script counters and do-not-cross rules.',
      icon: <CalculatorIcon className="w-5 h-5 text-[#b28615]" aria-hidden="true" />,
      bg: 'bg-[#fff4d7]'
    }
  ];

  return (
    <section className="w-full py-16 px-4 sm:px-6 bg-[#fcfbf9] border-y border-[#dedcd9]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs uppercase font-extrabold tracking-wider text-[#5769e7] mb-2">
            Why Borrower Copilot
          </h2>
          <p className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight">
            Built strictly for the borrower’s side of the table.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {props.map((p, idx) => (
            <div 
              key={idx}
              className="bg-white p-7 rounded-3xl border border-[#dedcd9] menti-card-shadow flex flex-col justify-between"
            >
              <div>
                <div className={`w-10 h-10 rounded-full ${p.bg} flex items-center justify-center mb-4`}>
                  {p.icon}
                </div>
                <h3 className="text-xl font-bold text-[#171717] tracking-tight mb-2">
                  {p.title}
                </h3>
                <p className="text-sm text-[#5d5b59] leading-relaxed">
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

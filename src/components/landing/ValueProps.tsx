import React from 'react';
import { CoinsSwapIcon, ShieldCheckIcon, CalculatorIcon } from '@/components/icons';

const props = [
  {
    title: 'Know your limit',
    description: 'Separate what an aggressive lender may offer from what your household cash flow can safely carry without default risk.',
    icon: ShieldCheckIcon,
    iconColor: 'text-[#5769e7]',
    iconBg: 'bg-[#e5e9ff]',
  },
  {
    title: 'Know your price',
    description: 'Unmask headline interest pitches with fair market rate bands, estimated all-in APR, and fee transparency.',
    icon: CoinsSwapIcon,
    iconColor: 'text-[#52ad6e]',
    iconBg: 'bg-[#e4f4e7]',
  },
  {
    title: 'Negotiate with confidence',
    description: 'Take a clear, one-page borrower defense card into the branch with exact script counters and do-not-cross rules.',
    icon: CalculatorIcon,
    iconColor: 'text-[#b28615]',
    iconBg: 'bg-[#fff4d7]',
  },
] as const;

export function ValueProps() {
  return (
    <section className="w-full bg-[#f3ede7]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16 py-16 lg:py-24">
        {/* Section heading — Mentimeter style: compressed 88px */}
        <div className="text-center max-w-[800px] mx-auto mb-12 lg:mb-16">
          <h2 className="font-display text-[48px] sm:text-[64px] lg:text-[88px] font-normal text-[#171717] leading-[0.85] tracking-normal">
            Built for the borrower&apos;s side of the table.
          </h2>
          <p className="text-[16px] text-[#5d5b59] mt-4 max-w-[480px] mx-auto leading-[1.55]">
            Lenders optimize for their margin. We optimize for your safety.
          </p>
        </div>

        {/* 3-column cards — Mentimeter style: white bg, subtle border, rounded-[16px] */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {props.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="bg-white rounded-[16px] p-8 lg:p-10 border border-[#ebeae8]"
              >
                <div className={`w-12 h-12 rounded-full ${p.iconBg} flex items-center justify-center mb-6`}>
                  <Icon className={`w-5 h-5 ${p.iconColor}`} aria-hidden="true" />
                </div>
                <h3 className="text-[28px] font-semibold text-[#171717] leading-[1.15] mb-3 font-display">
                  {p.title}
                </h3>
                <p className="text-[16px] text-[#5d5b59] leading-[1.55]">
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

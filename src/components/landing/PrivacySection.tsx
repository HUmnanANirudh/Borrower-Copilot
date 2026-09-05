import React from 'react';
import { SecurityCheckIcon } from '@/components/icons';

const privacyPoints = [
  { title: 'No login required', desc: 'We never ask for your email address, passwords, or Google account.' },
  { title: 'Zero credit bureau pull', desc: 'No hard or soft bureau pull. Using Borrower Copilot has 0 impact on your CIBIL score.' },
  { title: 'No phone number or spam', desc: 'No lead generation forms. Your phone will never ring from aggressive bank agents.' },
  { title: 'Calculated in your browser', desc: 'Your financial numbers are evaluated locally in your browser session without a database.' },
];

export function PrivacySection() {
  return (
    <section id="privacy" className="w-full bg-[#f3ede7]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16 py-16 lg:py-24">
        <div className="bg-white rounded-[20px] p-8 lg:p-16 border border-[#ebeae8]">
          {/* Header row */}
          <div className="flex items-start gap-5 mb-8">
            <div className="w-14 h-14 rounded-full bg-[#f0faf2] text-[#52ad6e] flex items-center justify-center shrink-0">
              <SecurityCheckIcon className="w-7 h-7" aria-hidden="true" />
            </div>
            <div>
              <span className="text-[12px] uppercase font-semibold tracking-wider text-[#52ad6e] block mb-1">
                Defensible Privacy
              </span>
              <h2 className="font-display text-[40px] sm:text-[56px] lg:text-[64px] font-normal text-[#171717] leading-[0.9] tracking-normal">
                Your assessment belongs to you.
              </h2>
            </div>
          </div>

          <p className="text-[16px] sm:text-[18px] text-[#5d5b59] leading-[1.55] mb-10 max-w-[680px]">
            Borrower Copilot is an independent decision engine, not a loan aggregator. Your assessment is calculated in your browser. Shareable cards are encoded into an encrypted link only when you choose to share one.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-[#ebeae8]">
            {privacyPoints.map((point) => (
              <div key={point.title}>
                <h4 className="text-[16px] font-semibold text-[#171717] flex items-start gap-2 mb-1">
                  <span className="text-[#52ad6e] mt-0.5">✓</span>
                  {point.title}
                </h4>
                <p className="text-[14px] text-[#5d5b59] leading-[1.55] pl-5">
                  {point.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

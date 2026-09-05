import React from 'react';
import { SecurityCheckIcon } from '@/components/icons';

export function PrivacySection() {
  const privacyPoints = [
    { title: 'No login required', desc: 'We never ask for your email address, passwords, or Google account.' },
    { title: 'Zero credit bureau pull', desc: 'No hard or soft bureau pull. Using Borrower Copilot has 0 impact on your CIBIL score.' },
    { title: 'No phone number or spam', desc: 'No lead generation forms. Your phone will never ring from aggressive bank agents.' },
    { title: 'Calculated in your browser', desc: 'Your financial numbers are evaluated locally in your browser session without a database.' }
  ];

  return (
    <section id="privacy" className="w-full py-20 lg:py-32 px-6 lg:px-16 bg-[#f3ede7]">
      <div className="max-w-[1280px] mx-auto">
        <div className="bg-white rounded-[32px] p-10 lg:p-16 border-[1px] border-[#ebeae8] menti-card-shadow max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 mb-12">
            <div className="w-16 h-16 rounded-full bg-[#f0faf2] text-[#52ad6e] flex items-center justify-center shrink-0">
              <SecurityCheckIcon className="w-8 h-8" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#52ad6e] block mb-2">
                Defensible Privacy
              </span>
              <h2 className="font-display text-[40px] sm:text-[48px] lg:text-[56px] font-medium text-[#101010] tracking-[-0.03em] leading-[0.95]">
                Your assessment belongs to you.
              </h2>
            </div>
          </div>

          <p className="text-[18px] text-[#5d5b59] leading-[1.5] mb-12 max-w-3xl">
            Borrower Copilot is an independent decision engine, not a loan aggregator. Your assessment is calculated in your browser. Shareable cards are encoded into an encrypted link only when you choose to share one.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-10 border-t border-[#ebeae8]">
            {privacyPoints.map((point, idx) => (
              <div key={idx} className="space-y-2">
                <h4 className="text-[18px] font-bold text-[#101010] flex items-start gap-3">
                  <span className="text-[#52ad6e] font-extrabold mt-1">✓</span>
                  {point.title}
                </h4>
                <p className="text-[15px] text-[#747371] leading-[1.5] pl-7">
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

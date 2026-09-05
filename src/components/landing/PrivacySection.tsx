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
    <section id="privacy" className="w-full py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#dedcd9] menti-card-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <SecurityCheckIcon className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block">
                Defensible Privacy
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight">
                Your assessment belongs to you.
              </h2>
            </div>
          </div>

          <p className="text-sm text-[#5d5b59] leading-relaxed mb-8">
            Borrower Copilot is an independent decision engine, not a loan aggregator. Your assessment is calculated in your browser. Shareable cards are encoded into an encrypted link only when you choose to share one.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-[#dedcd9]">
            {privacyPoints.map((point, idx) => (
              <div key={idx} className="space-y-1">
                <h4 className="text-sm font-bold text-[#171717] flex items-center gap-1.5">
                  <span className="text-emerald-600 font-extrabold">✓</span>
                  {point.title}
                </h4>
                <p className="text-xs text-[#747371] leading-relaxed pl-4">
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

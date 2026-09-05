import React from 'react';

export function PrivacySection() {
  return (
    <section id="privacy" className="w-full bg-white">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-16 py-14 lg:py-20">
        <div className="max-w-[700px] mx-auto text-center">
          <h2 className="font-display text-[36px] sm:text-[48px] lg:text-[64px] font-normal text-[#171717] leading-[0.9] mb-4">
            Your data stays in your browser.
          </h2>
          <p className="text-[15px] text-[#5d5b59] leading-[1.5] mb-8">
            No login. No credit bureau pull. No database. BorrowIQ runs entirely in your browser — nothing leaves your device unless you choose to share a card.
          </p>

          <div className="inline-flex flex-wrap justify-center gap-3">
            {['No login', 'No CIBIL impact', 'No phone spam', 'Browser-only'].map((item) => (
              <span key={item} className="px-4 py-2 rounded-full bg-[#f0faf2] text-[13px] font-medium text-[#253e2d]">
                ✓ {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

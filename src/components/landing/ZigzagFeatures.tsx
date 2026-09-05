import React from "react";

export function ZigzagFeatures() {
  return (
    <section className="w-full bg-white py-16 lg:py-28">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-[800px] mx-auto mb-16 lg:mb-24">
          <h2 className="font-display text-[40px] sm:text-[54px] lg:text-[72px] font-normal text-[#171717] leading-[0.88] tracking-tight uppercase">
            BUILT FOR THE BORROWER
          </h2>
        </div>

        {/* Rows container */}
        <div className="flex flex-col gap-16 lg:gap-24">
          {/* Row 1: Left Text, Right Visual */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
            <div className="w-full lg:w-5/12 flex flex-col items-start">
              <h3 className="font-display text-[32px] sm:text-[40px] lg:text-[48px] font-normal text-[#171717] leading-[0.9] tracking-tight uppercase mb-3">
                KNOW YOUR REAL CEILING
              </h3>
              <p className="text-[15px] sm:text-[16px] text-[#5d5b59] leading-[1.55]">
                Lenders push max loan tenures and 60% FOIR to inflate borrowing.
                We calculate your actual uncommitted surplus after rent,
                essentials, and an untouched 10% emergency buffer.
              </p>
            </div>

            <div className="w-full lg:w-6/12 bg-[#eef2ff] rounded-3xl p-6 sm:p-8 flex items-center justify-center min-h-[260px] sm:min-h-[300px]">
              <div className="w-full max-w-[360px] bg-white rounded-2xl p-5 text-[#171717] shadow-lg border border-[#e5e7eb]">
                <div className="text-[12px] text-[#6b7280] mb-4 font-mono">
                  Affordability Breakdown
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[#6b7280]">
                        Bank Max Sanction (Aggressive)
                      </span>
                      <span className="text-[#dc4a4a] font-semibold">
                        ₹25.0L
                      </span>
                    </div>

                    <div className="w-full h-3 bg-[#f1f5f9] rounded-full overflow-hidden">
                      <div className="h-full w-[95%] bg-[#ef5350] rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[#6b7280]">
                        BorrowIQ Safe Ceiling
                      </span>
                      <span className="text-[#3f8f5b] font-semibold">
                        ₹18.5L
                      </span>
                    </div>

                    <div className="w-full h-3 bg-[#f1f5f9] rounded-full overflow-hidden">
                      <div className="h-full w-[70%] bg-[#52ad6e] rounded-full" />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#e5e7eb] flex items-center justify-between text-[11px] text-[#6b7280]">
                    <span>Living Buffer Retained</span>
                    <span className="text-[#171717] font-medium">
                      ₹12,500/mo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Left Visual, Right Text */}
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-16">
            <div className="w-full lg:w-6/12 bg-[#eef2ff] rounded-3xl p-6 sm:p-8 flex items-center justify-center min-h-[260px] sm:min-h-[300px]">
              <div className="w-full max-w-[340px] bg-white rounded-2xl p-5 shadow-lg border border-[#e5e7eb]">
                <div className="text-[11px] font-semibold text-[#5d5b59] uppercase tracking-wider mb-3">
                  Rate Pitch vs Reality
                </div>

                <div className="p-3 bg-[#f8fafc] rounded-xl mb-2.5 border border-[#e2e8f0]">
                  <div className="flex justify-between items-center text-[12px]">
                    <span className="text-[#64748b]">Headline Bank Pitch</span>
                    <span className="font-semibold line-through text-[#94a3b8]">
                      10.5%
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-[#f0fdf4] rounded-xl border border-[#bbf7d0] mb-3">
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="font-semibold text-[#166534]">
                      Fair APR for your tier
                    </span>
                    <span className="font-display font-medium text-[20px] text-[#15803d]">
                      8.8% – 9.4%
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-[#64748b] flex items-center gap-1.5">
                  <span className="text-[#16a34a]">✓</span> Includes 18% GST +
                  processing fee amortized
                </div>
              </div>
            </div>

            <div className="w-full lg:w-5/12 flex flex-col items-start">
              <h3 className="font-display text-[32px] sm:text-[40px] lg:text-[48px] font-normal text-[#171717] leading-[0.9] tracking-tight uppercase mb-3">
                UNMASK THE ALL-IN APR
              </h3>
              <p className="text-[15px] sm:text-[16px] text-[#5d5b59] leading-[1.55]">
                Lenders quote deceptively low flat rates while burying upfront
                processing fees, admin charges, and GST in fine print. We
                calculate the exact true annual percentage rate.
              </p>
            </div>
          </div>

          {/* Row 3: Left Text, Right Visual */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
            <div className="w-full lg:w-5/12 flex flex-col items-start">
              <h3 className="font-display text-[32px] sm:text-[40px] lg:text-[48px] font-normal text-[#171717] leading-[0.9] tracking-tight uppercase mb-3">
                DEFEND YOUR POSITION
              </h3>
              <p className="text-[15px] sm:text-[16px] text-[#5d5b59] leading-[1.55]">
                Generate an official, tamper-proof Borrower Defense Card. Take
                it directly to the branch with pre-computed counter-scripts and
                hard walk-away thresholds.
              </p>
            </div>

            <div className="w-full lg:w-6/12 bg-[#eef2ff] rounded-3xl p-6 sm:p-8 flex items-center justify-center min-h-[260px] sm:min-h-[300px]">
              <div className="w-full max-w-[340px] bg-white rounded-2xl p-5 shadow-lg border border-[#e5e7eb]">
                <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9] mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#5769e7] text-white flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </div>
                    <span className="text-[12px] font-semibold text-[#1e293b]">
                      Negotiation Card
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold bg-[#dbeafe] text-[#1d4ed8] px-2 py-0.5 rounded-full">
                    Encrypted
                  </span>
                </div>

                <div className="space-y-2 text-[12px]">
                  <div className="flex justify-between py-1 border-b border-[#f8fafc]">
                    <span className="text-[#64748b]">Max Target EMI</span>
                    <span className="font-semibold text-[#1e293b]">
                      ₹22,000 / mo
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#f8fafc]">
                    <span className="text-[#64748b]">Walk-away Rate</span>
                    <span className="font-semibold text-[#dc2626]">
                      Above 11.2%
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#64748b]">Prepayment Penalty</span>
                    <span className="font-semibold text-[#15803d]">
                      Must be 0%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

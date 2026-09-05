import React from 'react';
import { Assessment } from '@/lib/types';

interface EMITenureTableProps {
  assessment: Assessment;
}

export function EMITenureTable({ assessment }: EMITenureTableProps) {
  const formatINR = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ebeae8] shadow-sm space-y-6">
      {/* EMI Ceiling Banner */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#ebeae8] pb-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-[#5769e7] block">
            Payment Capacity
          </span>
          <h2 className="text-[32px] font-bold text-[#171717] tracking-tight">
            Your Safe EMI Ceiling
          </h2>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-[40px] font-bold text-[#5769e7]">
            {formatINR(assessment.recommendedMaxEMI)}
          </span>
          <span className="text-xs text-[#747371] block mt-0.5">/ month</span>
        </div>
      </div>

      <p className="text-xs sm:text-sm font-semibold text-[#171717] bg-[#fcfbf9] p-3.5 rounded-2xl border border-[#ebeae8]">
        Do not agree to an EMI above this without changing the loan amount or extending tenure.
      </p>
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#5d5b59] mb-3">
          Tenure Options & Cost of Delay
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#ebeae8] text-[#747371]">
                <th className="py-2 font-bold">Tenure</th>
                <th className="py-2 font-bold">Monthly EMI</th>
                <th className="py-2 font-bold">Total Interest Paid</th>
                <th className="py-2 font-bold">Total Outflow</th>
                <th className="py-2 font-bold">Safety</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebeae8]">
              {assessment.tenureMatrix.map((opt) => {
                const isOver = opt.emi > assessment.recommendedMaxEMI;
                return (
                  <tr key={opt.tenureMonths} className={isOver ? 'bg-rose-50/20' : 'bg-emerald-50/20'}>
                    <td className="py-3.5 font-bold text-[#171717]">
                      {opt.tenureMonths} Months ({opt.tenureMonths / 12} yrs)
                    </td>
                    <td className={`py-3.5 font-extrabold text-sm ${isOver ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {formatINR(opt.emi)}
                    </td>
                    <td className="py-3.5 text-[#5d5b59] font-medium">
                      {formatINR(opt.totalInterest)}
                    </td>
                    <td className="py-3.5 font-semibold text-[#171717]">
                      {formatINR(opt.totalRepayment)}
                    </td>
                    <td className="py-3.5">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        isOver ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isOver ? 'Exceeds Ceiling' : 'Safe'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-[#747371] mt-3 italic">
          ★ Rule of borrowing: Lower monthly EMI → longer debt term → substantially higher total interest paid to the lender.
        </p>
      </div>
    </div>
  );
}

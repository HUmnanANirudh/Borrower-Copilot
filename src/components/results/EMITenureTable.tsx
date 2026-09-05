'use client';

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
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-[#ebeae8] shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#ebeae8] pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#5d5b59] block">
            Repayment Horizon
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
            Tenure Amortization Schedule
          </h3>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-xs text-[#747371] block">Safe EMI Ceiling</span>
          <span className="text-xl sm:text-2xl font-bold text-[#171717]">
            {formatINR(assessment.recommendedMaxEMI)} <span className="text-xs font-normal text-[#747371]">/ month</span>
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#ebeae8] text-[#747371]">
              <th className="py-2.5 font-bold">Tenure</th>
              <th className="py-2.5 font-bold">Monthly EMI</th>
              <th className="py-2.5 font-bold">Total Interest</th>
              <th className="py-2.5 font-bold">Total Outflow</th>
              <th className="py-2.5 font-bold">Safety</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ebeae8]">
            {assessment.tenureMatrix.map((opt) => {
              const isOver = opt.emi > assessment.recommendedMaxEMI;
              return (
                <tr key={opt.tenureMonths} className="hover:bg-[#f7f6f4] transition-colors">
                  <td className="py-3 font-semibold text-[#171717]">
                    {opt.tenureMonths} Months ({opt.tenureMonths / 12} Years)
                  </td>
                  <td className="py-3 font-bold text-sm text-[#171717]">
                    {formatINR(opt.emi)}
                  </td>
                  <td className="py-3 text-[#5d5b59]">
                    {formatINR(opt.totalInterest)}
                  </td>
                  <td className="py-3 font-semibold text-[#171717]">
                    {formatINR(opt.totalRepayment)}
                  </td>
                  <td className="py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      isOver 
                        ? 'bg-[#fcfbf9] text-rose-800 border-rose-200' 
                        : 'bg-[#f7f6f4] text-[#171717] border-[#ebeae8]'
                    }`}>
                      {isOver ? 'Exceeds Ceiling' : 'Safe Capacity'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

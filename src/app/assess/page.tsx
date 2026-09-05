import React from 'react';
import { QuizContainer } from '@/components/quiz/QuizContainer';

export const metadata = {
  title: 'Loan Assessment Quiz — Borrower Copilot',
  description: 'Single-screen private assessment determining your safe borrowing ceiling and fair interest rate.'
};

export default function AssessPage() {
  return (
    <main className="min-h-screen bg-[#f3ede7] text-[#171717] font-sans selection:bg-[#5769e7]/20 selection:text-[#5769e7] flex items-center justify-center">
      <QuizContainer />
    </main>
  );
}

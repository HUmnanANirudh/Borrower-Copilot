'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { BorrowerProfile, Assessment } from '@/lib/types';
import { evaluateAssessment } from '@/lib/rules/index';
import { getPrioritizedQuestions } from '@/lib/quizzing';
import { decodeCardPayload } from '@/lib/share';

import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { QuizView } from '@/components/QuizView';
import { AssessmentResults } from '@/components/AssessmentResults';
import { NegotiationCard } from '@/components/NegotiationCard';
import { QuoteComparisonSection } from '@/components/QuoteComparison';

type AppScreen = 'landing' | 'quiz' | 'results' | 'card';

export default function Home() {
  const [screen, setScreen] = useState<AppScreen>('landing');
  
  // Borrower profile state
  const [profile, setProfile] = useState<Partial<BorrowerProfile>>({
    loanPurpose: 'wedding_personal',
    requestedAmount: 500000,
    age: 30,
    primaryIncomeSignal: 'salaried_corporate',
    netMonthlyIncome: 75000,
    existingMonthlyEMI: 0,
    householdLivingExpenses: 30000,
    creditScoreStatus: 'unknown'
  });

  const [currentStep, setCurrentStep] = useState(0);

  // Dynamic question sequence derived from current profile state via Information-Value engine
  const activeQuestions = useMemo(() => {
    return getPrioritizedQuestions(profile);
  }, [profile]);

  // Handle URL hash loading on mount for stateless sharing (#card=...)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.startsWith('#card=')) {
        const payloadStr = hash.replace('#card=', '');
        const decoded = decodeCardPayload(payloadStr);
        if (decoded) {
          // Reconstruct minimal profile to render card
          setProfile({
            loanPurpose: decoded.p,
            requestedAmount: decoded.r,
            age: 30,
            primaryIncomeSignal: 'salaried_corporate',
            netMonthlyIncome: 100000,
            existingMonthlyEMI: 10000,
            householdLivingExpenses: 30000,
            creditScoreStatus: '750_plus'
          });
          setScreen('card');
        }
      }
    }
  }, []);

  // Compute live deterministic assessment whenever profile has minimum required fields
  const assessment: Assessment = useMemo(() => {
    // Fill safe fallback defaults for any unanswered fields
    const fullProfile: BorrowerProfile = {
      loanPurpose: profile.loanPurpose || 'wedding_personal',
      requestedAmount: profile.requestedAmount || 500000,
      age: profile.age || 30,
      primaryIncomeSignal: profile.primaryIncomeSignal || 'salaried_corporate',
      netMonthlyIncome: profile.netMonthlyIncome || 75000,
      existingMonthlyEMI: profile.existingMonthlyEMI || 0,
      householdLivingExpenses: profile.householdLivingExpenses || 30000,
      creditScoreStatus: profile.creditScoreStatus || 'unknown',
      coApplicantIncome: profile.coApplicantIncome,
      businessVintageYears: profile.businessVintageYears,
      itrDeclaredMonthlyTaxable: profile.itrDeclaredMonthlyTaxable,
      hasUnencumberedCollateral: profile.hasUnencumberedCollateral,
      collateralEstimatedValue: profile.collateralEstimatedValue,
      hasHighCostAppLoans: profile.hasHighCostAppLoans,
      totalHighCostDebtOutstanding: profile.totalHighCostDebtOutstanding,
      recentDelinquencyOrBounce: profile.recentDelinquencyOrBounce,
      bounceRecencyMonths: profile.bounceRecencyMonths,
      bounceWasCuredImmediately: profile.bounceWasCuredImmediately,
      emergencySavingsMonths: profile.emergencySavingsMonths,
      variablePayPortionPercent: profile.variablePayPortionPercent
    };
    return evaluateAssessment(fullProfile);
  }, [profile]);

  // Answer handler for the single-focus question slider
  const handleAnswer = (field: keyof BorrowerProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < activeQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setScreen('results');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setProfile({
      loanPurpose: 'wedding_personal',
      requestedAmount: 500000,
      age: 30,
      primaryIncomeSignal: 'salaried_corporate',
      netMonthlyIncome: 75000,
      existingMonthlyEMI: 0,
      householdLivingExpenses: 30000,
      creditScoreStatus: 'unknown'
    });
    setCurrentStep(0);
    setScreen('landing');
    if (typeof window !== 'undefined') {
      window.location.hash = '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f3ede7] text-[#171717] font-sans selection:bg-[#5769e7]/20 selection:text-[#5769e7]">
      {/* Sticky Header */}
      <Header onReset={handleReset} showReset={screen !== 'landing'} />

      {/* Main Content Surfaces */}
      <main className="flex-1">
        {screen === 'landing' && (
          <HeroSection onStartQuiz={() => setScreen('quiz')} />
        )}

        {screen === 'quiz' && (
          <QuizView
            questions={activeQuestions}
            currentStep={currentStep}
            profile={profile}
            onAnswer={handleAnswer}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        )}

        {screen === 'results' && (
          <div>
            <AssessmentResults
              assessment={assessment}
              profile={profile as BorrowerProfile}
              onViewCard={() => setScreen('card')}
            />
            {/* Bank Quote Reality Check Mode */}
            <div className="max-w-3xl mx-auto px-4 pb-12">
              <QuoteComparisonSection assessment={assessment} />
            </div>
          </div>
        )}

        {screen === 'card' && (
          <NegotiationCard
            assessment={assessment}
            profile={profile as BorrowerProfile}
            onBackToResults={() => setScreen('results')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-[#5d5b59] border-t border-[#dedcd9]/60 no-print">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Borrower Copilot © 2026 · Built for Indian Borrowers</span>
          <span className="text-[#a09f9d]">Deterministic Rules Engine · Zero Permanent Storage</span>
        </div>
      </footer>
    </div>
  );
}

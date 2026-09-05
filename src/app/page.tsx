import React from 'react';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { MethodologySection } from '@/components/landing/MethodologySection';
import { PrivacySection } from '@/components/landing/PrivacySection';
import { FinalCTA } from '@/components/landing/FinalCTA';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />

      <main className="flex-1">
        <HeroSection />
        <HowItWorks />
        <MethodologySection />
        <PrivacySection />
        <FinalCTA />
      </main>
    </div>
  );
}

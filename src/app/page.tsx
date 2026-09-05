import React from 'react';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { ValueProps } from '@/components/landing/ValueProps';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { TrustSection } from '@/components/landing/TrustSection';
import { MethodologySection } from '@/components/landing/MethodologySection';
import { PrivacySection } from '@/components/landing/PrivacySection';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f3ede7] text-[#171717] font-sans selection:bg-[#5769e7]/20 selection:text-[#5769e7]">
      {/* Header */}
      <LandingHeader />

      {/* Main Marketing Surfaces */}
      <main className="flex-1">
        <HeroSection />
        <ValueProps />
        <HowItWorks />
        <TrustSection />
        <MethodologySection />
        <PrivacySection />
        <FinalCTA />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}

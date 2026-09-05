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
    <div className="min-h-screen flex flex-col">
      {/* Header — transparent, merges into sand hero */}
      <LandingHeader />

      <main className="flex-1">
        {/* Sand: Hero */}
        <HeroSection />
        {/* Sand: Value props */}
        <ValueProps />
        {/* White: How it works */}
        <HowItWorks />
        {/* Sand: Trust quote (dark card inside) */}
        <TrustSection />
        {/* White: Methodology */}
        <MethodologySection />
        {/* Sand: Privacy (white card inside) */}
        <PrivacySection />
        {/* Blue: Final CTA */}
        <FinalCTA />
      </main>

      {/* Sand: Footer */}
      <LandingFooter />
    </div>
  );
}

import React from 'react';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { ZigzagFeatures } from '@/components/landing/ZigzagFeatures';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { FAQSection } from '@/components/landing/FAQSection';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 1. Sticky White Navbar */}
      <LandingHeader />

      <main className="flex-1">
        {/* 2. Hero Section with Phone Mockup */}
        <HeroSection />

        {/* 3. Section 2: Zigzag Features (like Mentimeter reference) */}
        <ZigzagFeatures />

        {/* 4. Section 3: How It Works with Boxed Numbers */}
        <HowItWorks />

        {/* 5. Section 4: 4-Item Accordion FAQ */}
        <FAQSection />
      </main>

      {/* 6. Blue Footer with Giant White BORROWIQ Watermark (like CRONICI reference) */}
      <LandingFooter />
    </div>
  );
}

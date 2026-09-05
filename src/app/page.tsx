import { LandingHeader } from '@/components/landing/LandingHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { ZigzagFeatures } from '@/components/landing/ZigzagFeatures';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { FAQSection } from '@/components/landing/FAQSection';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <LandingHeader />
      <main className="flex-1">
        <HeroSection />
        <ZigzagFeatures />
        <HowItWorks />
        <FAQSection />
      </main>
      <LandingFooter />
    </div>
  );
}

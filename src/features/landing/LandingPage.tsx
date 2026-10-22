import React from 'react';
import { Navbar } from './sections/Navbar';
import { HeroSection } from './sections/HeroSection';
import { MetricsBar } from './sections/MetricsBar';
import { ComparisonSection } from './sections/ComparisonSection';
import { FeaturesGrid } from './sections/FeaturesGrid';
import { CalculatorSection } from './sections/CalculatorSection';
import { HowItWorksSection } from './sections/HowItWorksSection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { FaqSection } from './sections/FaqSection';
import { CtaSection } from './sections/CtaSection';
import { Footer } from './sections/Footer';

interface LandingPageProps {
  onStartFree?: () => void;
}

export default function LandingPage({ onStartFree }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#fcfdfd] text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar onStartFree={onStartFree} />
      <HeroSection onStartFree={onStartFree} />
      <MetricsBar />
      <ComparisonSection />
      <FeaturesGrid />
      <CalculatorSection onStartFree={onStartFree} />
      <HowItWorksSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection onStartFree={onStartFree} />
      <Footer />
    </div>
  );
}
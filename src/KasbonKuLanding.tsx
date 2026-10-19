import React from 'react';
import { Navbar } from './components/landing/navbar';
import { HeroSection } from './components/landing/HeroSection';
import { MetricsBar } from './components/landing/MetricsBar';
import { ComparisonSection } from './components/landing/ComparisonSection';
import { FeaturesGrid } from './components/landing/FeaturesGrid';
import { CalculatorSection } from './components/landing/CalculatorSection';
import { HowItWorksSection } from './components/landing/HowItWorksSection';
import { TestimonialsSection } from './components/landing/TestimonialsSection';
import { FaqSection } from './components/landing/FaqSection';
import { CtaSection } from './components/landing/CtaSection';
import { Footer } from './components/landing/Footer';

interface KasbonKuLandingProps {
  onStartFree?: () => void;
}

export default function KasbonKuLanding({ onStartFree }: KasbonKuLandingProps) {
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
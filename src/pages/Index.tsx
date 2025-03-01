
import { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/hero/HeroSection';
import FeaturesSection from '@/components/features/FeaturesSection';
import TestimonialsSection from '@/components/community/TestimonialsSection';
import ContributeSection from '@/components/community/ContributeSection';
import CallToAction from '@/components/cta/CallToAction';

const Index = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <ContributeSection />
        <CallToAction />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

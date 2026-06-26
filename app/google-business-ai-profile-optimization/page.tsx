import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import HeroSection from '@/components/google-business-ai-profile-optimization/HeroSection';
import OverviewSection from '@/components/google-business-ai-profile-optimization/OverviewSection';
import FeaturesSection from '@/components/google-business-ai-profile-optimization/FeaturesSection';
import AISection from '@/components/google-business-ai-profile-optimization/AISection';
import HowItWorksSection from '@/components/google-business-ai-profile-optimization/HowItWorksSection';
import FAQSection from '@/components/google-business-ai-profile-optimization/FAQSection';
import CTASection from '@/components/google-business-ai-profile-optimization/CTASection';
import ServiceSelectionSection from '@/components/home/ServiceSelectionSection';
import { getDisplayPrices } from '@/app/actions/admin-settings';

export const metadata: Metadata = {
  title: 'Google Business AI Profile Optimization | Reach Them AI',
  description: 'Use AI to keep Google Business profiles complete, engaging, and optimized for local visibility.',
};

export default async function GoogleBusinessAiProfileOptimizationPage() {
  const { advisorPrice, removalPrice } = await getDisplayPrices();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar background="white" maxWidth="98%" />
      <main className="pt-16">
        <HeroSection />
        <OverviewSection />
        <FeaturesSection />
        <AISection />
        <HowItWorksSection />
        <ServiceSelectionSection advisorPrice={advisorPrice} removalPrice={removalPrice} />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

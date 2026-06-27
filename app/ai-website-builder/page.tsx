import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import HeroSection from '@/components/ai-website-builder/HeroSection';
import OverviewSection from '@/components/ai-website-builder/OverviewSection';
import FeaturesSection from '@/components/ai-website-builder/FeaturesSection';
import AISection from '@/components/ai-website-builder/AISection';
import HowItWorksSection from '@/components/ai-website-builder/HowItWorksSection';
import FAQSection from '@/components/ai-website-builder/FAQSection';
import CTASection from '@/components/ai-website-builder/CTASection';
import ServiceSelectionSection from '@/components/home/ServiceSelectionSection';
import { getDisplayPrices } from '@/app/actions/admin-settings';

export const metadata: Metadata = {
  title: 'AI Local Business Website Builder | Reach Them AI',
  description: 'Launch polished, high-converting local business websites built with AI and local SEO in mind.',
};

export default async function AiLocalBusinessWebsiteBuilderPage() {
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

import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import HeroSection from '@/components/ai-local-seo-content-generation/HeroSection';
import OverviewSection from '@/components/ai-local-seo-content-generation/OverviewSection';
import FeaturesSection from '@/components/ai-local-seo-content-generation/FeaturesSection';
import AISection from '@/components/ai-local-seo-content-generation/AISection';
import HowItWorksSection from '@/components/ai-local-seo-content-generation/HowItWorksSection';
import FAQSection from '@/components/ai-local-seo-content-generation/FAQSection';
import CTASection from '@/components/ai-local-seo-content-generation/CTASection';
import ServiceSelectionSection from '@/components/home/ServiceSelectionSection';
import { getDisplayPrices } from '@/app/actions/admin-settings';

export const metadata: Metadata = {
  title: 'AI Local SEO Content Generation | Reach Them AI',
  description: 'Generate locally relevant SEO content at scale for blogs, social posts, and GBP updates.',
};

export default async function AiLocalSeoContentGenerationPage() {
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

import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import HeroSection from '@/components/content-generation/HeroSection';
import OverviewSection from '@/components/content-generation/OverviewSection';
import FeaturesSection from '@/components/content-generation/FeaturesSection';
import AISection from '@/components/content-generation/AISection';
import HowItWorksSection from '@/components/content-generation/HowItWorksSection';
import FAQSection from '@/components/content-generation/FAQSection';
import CTASection from '@/components/content-generation/CTASection';
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

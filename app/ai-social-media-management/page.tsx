import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import HeroSection from '@/components/ai-social-media-management/HeroSection';
import OverviewSection from '@/components/ai-social-media-management/OverviewSection';
import FeaturesSection from '@/components/ai-social-media-management/FeaturesSection';
import AISection from '@/components/ai-social-media-management/AISection';
import HowItWorksSection from '@/components/ai-social-media-management/HowItWorksSection';
import FAQSection from '@/components/ai-social-media-management/FAQSection';
import CTASection from '@/components/ai-social-media-management/CTASection';
import ServiceSelectionSection from '@/components/home/ServiceSelectionSection';
import { getDisplayPrices } from '@/app/actions/admin-settings';

export const metadata: Metadata = {
  title: 'Social Media Management & AI Posting | Reach Them AI',
  description: 'Coordinate social media publishing with AI-powered planning, posting, and content support.',
};

export default async function SocialMediaManagementAiPostingPage() {
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

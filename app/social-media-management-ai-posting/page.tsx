import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import HeroSection from '@/components/social-media-management-ai-posting/HeroSection';
import OverviewSection from '@/components/social-media-management-ai-posting/OverviewSection';
import FeaturesSection from '@/components/social-media-management-ai-posting/FeaturesSection';
import AISection from '@/components/social-media-management-ai-posting/AISection';
import HowItWorksSection from '@/components/social-media-management-ai-posting/HowItWorksSection';
import FAQSection from '@/components/social-media-management-ai-posting/FAQSection';
import CTASection from '@/components/social-media-management-ai-posting/CTASection';
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

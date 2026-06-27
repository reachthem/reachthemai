import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import HeroSection from '@/components/rank-tracking/HeroSection';
import OverviewSection from '@/components/rank-tracking/OverviewSection';
import FeaturesSection from '@/components/rank-tracking/FeaturesSection';
import AISection from '@/components/rank-tracking/AISection';
import HowItWorksSection from '@/components/rank-tracking/HowItWorksSection';
import FAQSection from '@/components/rank-tracking/FAQSection';
import CTASection from '@/components/rank-tracking/CTASection';
import ServiceSelectionSection from '@/components/home/ServiceSelectionSection';
import { getDisplayPrices } from '@/app/actions/admin-settings';

export const metadata: Metadata = {
  title: 'Local Rank Tracking | Reach Them AI',
  description: 'Track local rankings across Google Maps, the Local Pack, organic search, and AI answer engines with actionable insight.',
};

export default async function LocalRankTrackingPage() {
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

import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ServiceSelectionSection from '@/components/home/ServiceSelectionSection';
import HeroSection from '@/components/local-listing-aggregation/HeroSection';
import OverviewSection from '@/components/local-listing-aggregation/OverviewSection';
import FeaturesSection from '@/components/local-listing-aggregation/FeaturesSection';
import AISection from '@/components/local-listing-aggregation/AISection';
import HowItWorksSection from '@/components/local-listing-aggregation/HowItWorksSection';
import FAQSection from '@/components/local-listing-aggregation/FAQSection';
import CTASection from '@/components/local-listing-aggregation/CTASection';

export const metadata: Metadata = {
  title: 'Local Listing Aggregation — Reach Them AI',
  description: 'Aggregate and synchronize your business listings across major directories to improve local visibility and consistency.',
};

export default async function LocalListingAggregationPage() {
  return (
    <div className="home-page min-h-screen bg-white dark:bg-slate-900">
      <Navbar background="white" maxWidth="98%" />
      <main className="pt-16">
        <HeroSection />
        <OverviewSection />
        <FeaturesSection />
        <AISection />
        <HowItWorksSection />
        <ServiceSelectionSection advisorPrice="49" removalPrice="499" />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

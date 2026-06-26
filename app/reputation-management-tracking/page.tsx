import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ServiceSelectionSection from '@/components/home/ServiceSelectionSection';
import HeroSection from '@/components/reputation-management-tracking/HeroSection';
import OverviewSection from '@/components/reputation-management-tracking/OverviewSection';
import FeaturesSection from '@/components/reputation-management-tracking/FeaturesSection';
import AISection from '@/components/reputation-management-tracking/AISection';
import HowItWorksSection from '@/components/reputation-management-tracking/HowItWorksSection';
import FAQSection from '@/components/reputation-management-tracking/FAQSection';
import CTASection from '@/components/reputation-management-tracking/CTASection';

export const metadata: Metadata = {
  title: 'Reputation Management Tracking — Reach Them AI',
  description: 'Track review sentiment, mentions, and reputation signals across platforms with AI-driven alerts and reporting.',
};

export default async function ReputationManagementTrackingPage() {
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

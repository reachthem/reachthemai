import type { Metadata } from 'next';
import Script from 'next/script';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import HeroSection from '@/components/ai-phone-agents/HeroSection';
import OverviewSection from '@/components/ai-phone-agents/OverviewSection';
import FeaturesSection from '@/components/ai-phone-agents/FeaturesSection';
import AISection from '@/components/ai-phone-agents/AISection';
import HowItWorksSection from '@/components/ai-phone-agents/HowItWorksSection';
import FAQSection from '@/components/ai-phone-agents/FAQSection';
import CTASection from '@/components/ai-phone-agents/CTASection';
import ServiceSelectionSection from '@/components/home/ServiceSelectionSection';
import { getDisplayPrices } from '@/app/actions/admin-settings';

export const metadata: Metadata = {
  title: 'AI Phone Agents | Reach Them AI',
  description: 'Give every caller a polished, always-on experience with AI phone agents that answer calls, book appointments, and qualify leads.',
};

export default async function AITPhoneAgentsPage() {
  const { advisorPrice, removalPrice } = await getDisplayPrices();

  return (
    <>
      <Script
        id="ai-phone-agents-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Can the agent answer after-hours calls?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes. It can respond immediately outside business hours so callers still get a helpful experience and your team can follow up later.',
                },
              },
              {
                '@type': 'Question',
                name: 'Can it book appointments?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes. The agent can gather the details needed to schedule appointments, confirm availability, and reduce manual back-and-forth.',
                },
              },
            ],
          }),
        }}
      />
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
    </>
  );
}

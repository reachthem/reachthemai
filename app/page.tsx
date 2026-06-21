import type { Metadata } from 'next';
import Script from 'next/script';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import HomeHeroSection from '@/components/home/HomeHeroSection';
import ServiceSelectionSection from '@/components/home/ServiceSelectionSection';
import CombinedFeaturesSection from '@/components/home/CombinedFeaturesSection';
import ReviewSitesBanner from '@/components/home/ReviewSitesBanner';
import NegativeReviewsCostVideoSection from '@/components/home/NegativeReviewsCostVideoSection';
import StatsBar from '@/components/home/StatsBar';
import PlatformsSupportedSection from '@/components/home/PlatformsSupportedSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import HomeFAQSection from '@/components/home/HomeFAQSection';
import HomeCTASection from '@/components/home/HomeCTASection';
import { getDisplayPrices } from '@/app/actions/admin-settings';

export const metadata: Metadata = {
  title: 'Remove Bad Reviews & Protect Your Reputation | Reach Them AI',
  description:
    'Take control of your online reputation. Choose between our $19/mo AI Advisor for self-service guidance or our Full Service Removal for professional, guaranteed results.',
  keywords: [
    'remove bad reviews',
    'online reputation management',
    'AI review removal',
    'Google review removal',
    'Yelp review removal',
    'negative review removal',
    'reputation management software',
    'remove fake reviews',
  ],
  openGraph: {
    title: 'Remove Bad Reviews & Protect Your Reputation | Reach Them AI',
    description:
      'Take control of your online reputation. Choose between our $19/mo AI Advisor for self-service guidance or our Full Service Removal for professional, guaranteed results.',
    type: 'website',
    images: ['/featured.png'],
  },
};

function buildFaqJsonLd(advisorPrice: string, removalPrice: string) {
  return {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the difference between the AI Advisor and Full Service Removal?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `The AI Advisor ($${advisorPrice}/mo) is a self-service tool that analyzes your reviews and gives you step-by-step instructions to remove them yourself. Full Service Removal ($${removalPrice}/removal) is a "done-for-you" service where our experts handle the entire dispute and removal process for you.`,
      },
    },
    {
      '@type': 'Question',
      name: 'How does the AI Advisor work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You paste the review text into our tool. Our AI analyzes it against platform policies (Google, Yelp, etc.) to find violations. It then generates a custom report with the exact language you need to use when flagging the review, significantly increasing your chances of removal.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the Full Service Removal guaranteed?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Our Full Service Removal comes with a 100% money-back guarantee. If we cannot get the review removed, you do not pay (or are refunded in full). The AI Advisor is a monthly subscription tool and does not offer a removal guarantee, but provides the best possible guidance.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is it legal to remove reviews?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We strictly follow platform content policies and terms of service. We do not use bots, fake reports, or "black hat" tactics. We simply identify legitimate policy violations (like hate speech, conflict of interest, or spam) and report them through the proper channels.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which platforms do you support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We support removal for Google, Yelp, Facebook, Trustpilot, TripAdvisor, and BBB. Our AI Advisor works for these platforms plus many others by analyzing general policy violations common across the web.',
      },
    },
  ],
};
}

export default async function Home() {
  const { advisorPrice, removalPrice } = await getDisplayPrices();
  const faqJsonLd = buildFaqJsonLd(advisorPrice, removalPrice);

  return (
    <>
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <Navbar background="white" maxWidth="98%" />
        <main className="pt-16">
          <HomeHeroSection />
          <ReviewSitesBanner />
          <NegativeReviewsCostVideoSection />
          <ServiceSelectionSection advisorPrice={advisorPrice} removalPrice={removalPrice} />
          <CombinedFeaturesSection />
          <StatsBar />
          <PlatformsSupportedSection />
          <TestimonialsSection />
          <HomeFAQSection advisorPrice={advisorPrice} removalPrice={removalPrice} />
          <HomeCTASection advisorPrice={advisorPrice} />
        </main>
        <Footer />
      </div>
    </>
  );
}

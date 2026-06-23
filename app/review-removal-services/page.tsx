import type { Metadata } from 'next';
import Script from 'next/script';
import Navbar from '@/components/shared/Navbar';
import HeroSection from '@/components/home/HeroSection';
import ReviewSitesBanner from '@/components/home/ReviewSitesBanner';
import NegativeReviewsCostVideoSection from '@/components/home/NegativeReviewsCostVideoSection';
import StatsBar from '@/components/home/StatsBar';
import CoreServiceSection from '@/components/home/CoreServiceSection';
import AIPoweredSection from '@/components/home/AIPoweredSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import TwoPathsRemovalSection from '@/components/home/TwoPathsRemovalSection';
import FAQSection from '@/components/home/FAQSection';
import CTASection from '@/components/home/CTASection';
import Footer from '@/components/shared/Footer';
import { getDisplayPrices, getRemovalDisplayPrice } from '@/app/actions/admin-settings';

export async function generateMetadata(): Promise<Metadata> {
  const removalPrice = await getRemovalDisplayPrice();
  return {
  title: `Remove Bad Google Reviews — $${removalPrice} Per Removal | Reach Them AI`,
  description:
    `Remove bad Google reviews and protect your reputation. Professional removal from Google, Yelp, Facebook, and Trustpilot. $${removalPrice} per removal — pay only for results. Free assessment. Legitimate, policy-based removals.`,
  keywords: [
    'remove bad Google reviews',
    'remove negative reviews',
    'Google review removal',
    'Yelp review removal',
    'fake review removal',
    'reputation management',
    'negative review removal service',
    'remove bad reviews',
    'online reputation management',
  ],
  openGraph: {
    title: `Remove Bad Google Reviews — $${removalPrice} Per Removal`,
    description:
      'Remove bad Google reviews and protect your reputation. Professional removal from Google, Yelp, Facebook, and Trustpilot. Pay only for results. Free assessment.',
    type: 'website',
    images: ['/featured.png'],
  },
};
}

function buildFaqJsonLd(removalPrice: string) {
  return {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do you remove negative reviews?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We submit formal removal applications directly to the review platform (Google, Yelp, Facebook, or Trustpilot), demonstrating that the review violates their content policies. This is a completely legitimate process.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does it cost to remove a review?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `$${removalPrice} per successfully removed review. No upfront fees — you only pay when the review is permanently gone.`,
      },
    },
    {
      '@type': 'Question',
      name: 'How long does review removal take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most removals complete within 1–4 weeks, depending on the platform and the nature of the review. Some straightforward violations resolve in 24–48 hours.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is it legal to remove reviews?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. We follow entirely legitimate processes in accordance with each platform's content policies and terms of service. We never use incentives or manipulative tactics.",
      },
    },
    {
      '@type': 'Question',
      name: 'What if the removal is unsuccessful?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "You don't pay. Our service is entirely results-based — if we cannot get the review removed, there is no charge.",
      },
    },
  ],
};
}

export default async function ReviewRemovalServicesPage() {
  const { advisorPrice, removalPrice } = await getDisplayPrices();
  const faqJsonLd = buildFaqJsonLd(removalPrice);

  return (
    <>
      <Script
        id="review-removal-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="home-page min-h-screen bg-white dark:bg-slate-900">
        <Navbar background="white" maxWidth="98%" />
        <main className="pt-16">
          <HeroSection removalPrice={removalPrice} />
          <ReviewSitesBanner />
          <NegativeReviewsCostVideoSection />
          <StatsBar />
          <AIPoweredSection />
          <FeaturesSection />
          <HowItWorksSection removalPrice={removalPrice} />
          <TestimonialsSection />
          <CoreServiceSection
            removalPrice={removalPrice}
            freeAssessmentHref="/free-assessment"
            submitRemovalAuthenticatedHref="/submit-removal"
          />
          <TwoPathsRemovalSection
            advisorPrice={advisorPrice}
            removalPrice={removalPrice}
            advisorButtonText="More Details"
            removalButtonHref="/submit-removal"
          />
          <FAQSection removalPrice={removalPrice} />
          <CTASection removalPrice={removalPrice} />
        </main>
        <Footer />
      </div>
    </>
  );
}

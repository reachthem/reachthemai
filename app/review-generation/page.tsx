import type { Metadata } from 'next';
import Script from 'next/script';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import HeroSection from '@/components/review-generation/HeroSection';
import StatsBar from '@/components/review-generation/StatsBar';
import PainPointsSection from '@/components/review-generation/PainPointsSection';
import FeaturesSection from '@/components/review-generation/FeaturesSection';
import ChannelsSection from '@/components/review-generation/ChannelsSection';
import HowItWorksSection from '@/components/review-generation/HowItWorksSection';
import TestimonialsSection from '@/components/review-generation/TestimonialsSection';
import FAQSection from '@/components/review-generation/FAQSection';
import CTASection from '@/components/review-generation/CTASection';

export const metadata: Metadata = {
  title: 'Review Generation Software — Get More 5-Star Reviews | Reach Them AI',
  description:
    'Automate your review requests and get more 5-star reviews on Google, Yelp, Facebook, and 50+ platforms. Our review generation software sends personalized SMS and email requests to your customers — so you never miss a review opportunity.',
  keywords: [
    'review generation software',
    'get more reviews',
    'review request software',
    'automated review requests',
    'online review management',
    'Google review generation',
    'review generation tool',
    'customer review software',
  ],
  openGraph: {
    title: 'Review Generation Software — Get More 5-Star Reviews',
    description:
      'Automate review requests via SMS and email. Works on Google, Yelp, Facebook, Trustpilot, and 50+ platforms.',
    type: 'website',
    images: ['/featured.png'],
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does review generation software work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The software automatically sends personalized review requests to your customers via SMS or Email after a transaction or appointment. Customers click a direct link to your chosen review platform and leave feedback in seconds.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which review platforms does the software support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We support 50+ platforms including Google, Yelp, Facebook, Trustpilot, TripAdvisor, and many more.',
      },
    },
    {
      '@type': 'Question',
      name: 'How quickly will I see new reviews?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most businesses see their first new reviews within 24–48 hours. Volume builds significantly within the first 30 days.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this review generation approach compliant with platform guidelines?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We never pay for reviews, never incentivize customers, and never gate negative feedback — all of which would violate FTC guidelines and platform terms of service.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I customize the review request messages?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You have full control over your message templates — personalize with customer name, business name, and a direct platform link.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need technical skills to set up review generation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No technical skills required. Setup takes less than 5 minutes — import your customer list, pick a template, and hit send.',
      },
    },
  ],
};

export default function ReviewGenerationPage() {
  return (
    <>
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <Navbar />
        <main>
          <HeroSection />
          <StatsBar />
          <PainPointsSection />
          <FeaturesSection />
          <ChannelsSection />
          <HowItWorksSection />
          <TestimonialsSection />
          <FAQSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
}

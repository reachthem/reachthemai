import type { Metadata } from 'next';
import Script from 'next/script';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import HeroSection from '@/components/home-overview/HeroSection';
import AllServicesSection from '@/components/home-overview/AllServicesSection';
import EducationalResourcesSection from '@/components/home-overview/EducationalResourcesSection';
import CTASection from '@/components/home-overview/CTASection';

export const metadata: Metadata = {
  title: 'Remove Bad Reviews & Protect Your Reputation | Reach Them AI',
  description:
    'Take control of your online reputation. Choose between our $49/mo AI Advisor for self-service guidance or our Full Service Removal for professional, guaranteed results.',
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
      'Take control of your online reputation. Choose between our $49/mo AI Advisor for self-service guidance or our Full Service Removal for professional, guaranteed results.',
    type: 'website',
    images: ['/featured.png'],
  },
};

function buildFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What services does Reach Them AI offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We offer comprehensive reputation management and business growth services including review removal, review generation, AI-powered advisors, local SEO content generation, business website building, phone agents, social media management, reputation tracking, and more.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which service should I start with?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Start with a Free Review Scan to analyze your current reputation and see which negative reviews can be removed. Based on your results, we\'ll recommend the best combination of services for your business.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I use multiple services together?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Many businesses combine review removal, review generation, and AI content tools for maximum impact. Our platform integrates seamlessly to help you manage your reputation, generate new reviews, and grow your online presence.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you offer enterprise or custom solutions?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. For agencies, large teams, or custom integrations, contact our sales team. We offer white-label solutions, API access, and custom pricing packages.',
        },
      },
    ],
  };
}

export default async function HomePage() {
  const faqJsonLd = buildFaqJsonLd();

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
          <HeroSection />
          <AllServicesSection />
          <EducationalResourcesSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
}

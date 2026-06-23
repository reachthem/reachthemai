import type { Metadata } from 'next';
import Script from 'next/script';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import HeroSection from '@/components/ai-advisor/HeroSection';
import ReviewSitesBanner from '@/components/home/ReviewSitesBanner';
import NegativeReviewsCostVideoSection from '@/components/home/NegativeReviewsCostVideoSection';
import StatsBar from '@/components/home/StatsBar';
import FeaturesSection from '@/components/ai-advisor/FeaturesSection';
import AIAnalysisSection from '@/components/ai-advisor/AIAnalysisSection';
import HowItWorksSection from '@/components/ai-advisor/HowItWorksSection';
import AdvisorReviewsSection from '@/components/ai-advisor/AdvisorReviewsSection';
import AdvisorServiceSection from '@/components/ai-advisor/AdvisorServiceSection';
import PlatformsSupportedSection from '@/components/home/PlatformsSupportedSection';
import PipelineSection from '@/components/the-machine/PipelineSection';
import ViolationsSection from '@/components/the-machine/ViolationsSection';
import TwoPathsRemovalSection from '@/components/home/TwoPathsRemovalSection';
import FAQSection from '@/components/the-machine/FAQSection';
import CTASection from '@/components/ai-advisor/CTASection';
import { getDisplayPrices, getAdvisorDisplayPrice } from '@/app/actions/admin-settings';

export async function generateMetadata(): Promise<Metadata> {
  const advisorPrice = await getAdvisorDisplayPrice();
  return {
    title: 'AI Review Advisor — AI-Powered Review Removal Guidance | Reach Them AI',
    description:
      `Our AI agent uses NLP, pattern recognition, and real-time legal cross-referencing to analyze negative reviews for policy violations and removal eligibility. Get platform-specific, step-by-step removal guidance for Google, Yelp, Facebook, Trustpilot, and more — starting at $${advisorPrice}/month.`,
    keywords: [
      'remove negative reviews',
      'AI review removal',
      'AI review removal tool',
      'AI reputation management',
      'automated review removal',
      'self-service review removal',
      'how to remove Google review',
      'remove Yelp review',
      'negative review removal tool',
      'review removal advisor',
      'remove bad review',
    ],
    openGraph: {
      title: 'AI Review Advisor — AI-Powered Review Removal Guidance',
      description:
        `AI-powered NLP analysis, pattern recognition, and legal cross-referencing to remove negative reviews from Google, Yelp, Facebook, Trustpilot, and more. $${advisorPrice}/month. Cancel anytime.`,
      type: 'website',
      images: ['/featured.png'],
    },
  };
}

function buildFaqJsonLd(advisorPrice: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does the AI Review Advisor work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You paste the review text, URL, and platform name. Our AI analyzes the review for policy violations, fake reviewer signals, and legal grounds, then gives you a step-by-step action plan to report or flag the review on that specific platform.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which review platforms does the AI Advisor support?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The AI Advisor provides platform-specific instructions for Google, Yelp, Facebook, Trustpilot, TripAdvisor, BBB, and other major review platforms.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does the AI Review Advisor cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The AI Review Advisor is $${advisorPrice} per month with no long-term commitment. You can cancel at any time. Reputation Management Agencies charge $250–$1,500 per review removed. Get AI-powered instructions, plans and follow-up for $${advisorPrice}.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Can the AI guarantee a review will be removed?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No removal can be guaranteed — the final decision rests with the review platform. However, the AI identifies your strongest grounds and gives you a confidence score so you can prioritize cases with the highest likelihood of success.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is this the same as paying someone to remove reviews?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. The AI Review Advisor guides you through the legitimate flagging and reporting process each platform provides. It does not use black-hat tactics, fake reports, or paid removals.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does the AI analyze reviews for removal eligibility?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The AI uses natural language processing to interpret review content, pattern recognition to detect fake reviewer signals, and real-time cross-referencing of platform content policies and legal databases (defamation statutes, FTC guidelines, CDA Section 230) to identify the strongest grounds for removal.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the difference between the self-service AI audit and full-service removal?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The self-service AI audit ($${advisorPrice}/month) gives you an AI-generated audit report with violation categories, removal probability, legal grounds, and step-by-step instructions — you take action yourself. Full-service removal pairs the AI analysis with a dedicated reputation specialist who files disputes and monitors outcomes on your behalf.`,
        },
      },
      {
        '@type': 'Question',
        name: 'What do I receive in an AI audit report?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Each audit report includes a policy violation assessment with specific clauses cited, a removal probability score, a legal grounds summary, platform-specific flagging instructions, suggested response templates, and access to follow-up AI chat for additional questions.',
        },
      },
    ],
  };
}

export default async function AIAdvisorPage() {
  const { advisorPrice, removalPrice } = await getDisplayPrices();

  const faqJsonLd = buildFaqJsonLd(advisorPrice);

  return (
    <>
      <Script
        id="ai-advisor-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <Navbar background="white" maxWidth="98%" />
        <main className="pt-16">
          <HeroSection advisorPrice={advisorPrice} />
          <ReviewSitesBanner />
          <NegativeReviewsCostVideoSection />
          <HowItWorksSection />
          <StatsBar />
          <FeaturesSection />
          <AIAnalysisSection />
          <AdvisorReviewsSection />
          <PlatformsSupportedSection />
          <PipelineSection />
          <ViolationsSection />
          <AdvisorServiceSection advisorPrice={advisorPrice} />
          <TwoPathsRemovalSection
            advisorPrice={advisorPrice}
            removalPrice={removalPrice}
            advisorButtonHref="/auth/register"
            advisorCheckoutWhenAuthenticated
            removalButtonText="Service Details"
          />
          <FAQSection advisorPrice={advisorPrice} removalPrice={removalPrice} />
          <CTASection price={advisorPrice} />
        </main>
        <Footer />
      </div>
    </>
  );
}

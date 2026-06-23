import type { Metadata } from 'next';
import Script from 'next/script';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import HeroSection from '@/components/the-machine/HeroSection';
import PipelineSection from '@/components/the-machine/PipelineSection';
import ViolationsSection from '@/components/the-machine/ViolationsSection';
import RemovalPathsSection from '@/components/the-machine/RemovalPathsSection';
import FAQSection from '@/components/the-machine/FAQSection';
import CTASection from '@/components/the-machine/CTASection';
import { getDisplayPrices } from '@/app/actions/admin-settings';

export const metadata: Metadata = {
  title: 'The Machine — Automated Google Review Scanner & Threat Detection | Reach Them AI',
  description:
    'Scan every Google review for your business automatically. Our AI-powered Machine detects fake reviews, spam, harassment, and 8 other policy violations — then generates evidence-based removal strategies. Free scan available.',
  keywords: [
    'Google review scanner',
    'automated review scanning',
    'fake review detection',
    'Google review removal tool',
    'review threat detection',
    'review policy violations',
    'scan Google reviews',
    'remove fake Google reviews',
    'Google Maps review scanner',
    'review monitoring tool',
    'automated reputation management',
    'AI review analysis',
    'detect fake reviews',
    'Google review audit',
    'review removal strategy',
    'bulk review analysis',
    'review threat report',
    'Google content policy violations',
    'spam review detection',
    'harassment review removal',
  ],
  openGraph: {
    title: 'The Machine — Automated Google Review Scanner & Threat Detection',
    description:
      'AI-powered review scanner that finds every policy-violating Google review and generates removal strategies. Detects fake reviews, spam, harassment, and more. Free scan available.',
    type: 'website',
    images: ['/featured.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Machine — Automated Google Review Scanner',
    description:
      'Scan every Google review for policy violations. AI-powered detection of fake reviews, spam, harassment, and more.',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is The Machine and how does it work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Machine is an automated Google Review scanning pipeline. It pulls every review for your business, runs AI-powered policy classification on each one, assigns a confidence score, and generates a threat report with actionable removal strategies.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many reviews can The Machine scan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'There is no practical limit. The Machine can scan businesses with thousands of reviews.',
      },
    },
    {
      '@type': 'Question',
      name: 'What policy categories does the AI check for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "We check for 8 violation categories: Spam & Fake Reviews, Off-Topic Content, Restricted Content, Illegal Activity, Sexually Explicit Content, Conflict of Interest, Impersonation, and Harassment & Threats. These align directly with Google's Maps User Contributed Content Policy.",
      },
    },
    {
      '@type': 'Question',
      name: 'Will legitimate negative reviews be flagged?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "No. The AI is conservative. A negative review is legitimate if it reflects a real customer experience. Only reviews that genuinely violate Google's content policies are flagged.",
      },
    },
    {
      '@type': 'Question',
      name: 'What happens after a review is flagged?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'PLACEHOLDER_FAQ_PRICES',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does a scan take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most scans complete in 1-3 minutes depending on how many reviews the business has.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can The Machine monitor for new reviews?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. Continuous monitoring re-scans your business daily. If a new policy-violating review is detected, you'll be notified immediately.",
      },
    },
    {
      '@type': 'Question',
      name: 'Is this service available for platforms other than Google?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Currently, The Machine supports Google reviews. Support for Yelp, Facebook, Trustpilot, and other platforms is on the roadmap.',
      },
    },
  ],
};

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'The Machine — Google Review Scanner',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI-powered Google Review scanner that detects fake reviews, spam, harassment, and other policy violations with automated removal strategies.',
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: 'PLACEHOLDER_LOW',
    highPrice: 'PLACEHOLDER_HIGH',
    priceCurrency: 'USD',
    offerCount: 3,
  },
  provider: {
    '@type': 'Organization',
    name: 'Reach Them AI',
    url: 'https://reachthem.ai',
  },
};

function buildFaqJsonLd(advisorPrice: string, removalPrice: string) {
  const text = `Each flagged review shows the violation type, confidence score, policy citation, and removal strategy. Use the AI Removal Advisor ($${advisorPrice}/month) for DIY guidance, or submit to professional removal ($${removalPrice}/review with money-back guarantee).`;
  return {
    ...faqJsonLd,
    mainEntity: faqJsonLd.mainEntity.map((item: { '@type': string; name: string; acceptedAnswer: { '@type': string; text: string } }) =>
      item.name === 'What happens after a review is flagged?'
        ? { ...item, acceptedAnswer: { ...item.acceptedAnswer, text } }
        : item
    ),
  };
}

function buildSoftwareJsonLd(advisorPrice: string, removalPrice: string) {
  return {
    ...softwareJsonLd,
    offers: { ...softwareJsonLd.offers, lowPrice: advisorPrice, highPrice: removalPrice },
  };
}

export default async function TheMachinePage() {
  const { advisorPrice, removalPrice } = await getDisplayPrices();
  const faqJsonLdWithPrices = buildFaqJsonLd(advisorPrice, removalPrice);
  const softwareJsonLdWithPrices = buildSoftwareJsonLd(advisorPrice, removalPrice);

  return (
    <>
      <Script
        id="the-machine-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLdWithPrices) }}
      />
      <Script
        id="the-machine-software-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLdWithPrices) }}
      />

      <div className="min-h-screen bg-white dark:bg-slate-900">
        <Navbar background="default" maxWidth="98%" />
        <main>
          <HeroSection />
          <PipelineSection removalPrice={removalPrice} />
          <ViolationsSection />
          <RemovalPathsSection advisorPrice={advisorPrice} removalPrice={removalPrice} />
          <FAQSection advisorPrice={advisorPrice} removalPrice={removalPrice} />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
}
